import React, { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { navLinks, platformItems, mockInterviewsItems, resourcesItems } from "../../data/homeData";

function useDropdownPos(btnRef, navRef, panelW) {
    const [pos, setPos] = useState({ left: 0, caretLeft: 80 });
    useEffect(() => {
        if (!btnRef?.current || !navRef?.current) return;
        const btn = btnRef.current.getBoundingClientRect();
        const nav = navRef.current.getBoundingClientRect();
        let left = btn.left + btn.width / 2 - panelW / 2 - nav.left;
        left = Math.max(8, Math.min(left, nav.width - panelW - 8));
        const caretLeft = btn.left + btn.width / 2 - nav.left - left - 7;
        setPos({ left, caretLeft });
    }, [btnRef, navRef, panelW]);
    return pos;
}

function DropdownShell({ pos, panelW, children }) {
    return (
        <div
            className="absolute bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100"
            style={{ width: panelW, left: pos.left, top: "calc(100% + 8px)", zIndex: 999 }}
        >
            <div
                className="absolute -top-2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"
                style={{ left: pos.caretLeft }}
            />
            {children}
        </div>
    );
}

function PlatformRow({ item }) {
    return (
        <a href="#" className="flex items-start gap-3.5 group rounded-xl px-3.5 py-3 hover:bg-gray-50 transition-all duration-150">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1caee4]/10 to-[#1caee4]/5 text-[#1caee4] text-lg group-hover:from-[#1caee4]/20 group-hover:to-[#1caee4]/10 transition-colors">
                {item.icon}
            </div>
            <div className="pt-0.5">
                <div className="text-[13px] font-semibold text-gray-900 group-hover:text-[#1caee4] transition-colors leading-tight">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</div>
            </div>
        </a>
    );
}

function NavDropdown({ btnRef, navRef, items }) {
    const PANEL_W = 640;
    const pos = useDropdownPos(btnRef, navRef, PANEL_W);
    return (
        <DropdownShell pos={pos} panelW={PANEL_W}>
            <div className="grid grid-cols-2 gap-x-2 p-4">
                <div>{items.left.map(item => <PlatformRow key={item.title} item={item} />)}</div>
                <div>{items.right.map(item => <PlatformRow key={item.title} item={item} />)}</div>
            </div>
        </DropdownShell>
    );
}

export default function HomeNavbar() {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const navRef = React.useRef(null);
    const platformBtnRef = React.useRef(null);
    const mockInterviewsBtnRef = React.useRef(null);
    const resourcesBtnRef = React.useRef(null);

    const getBtnRef = (label) => {
        if (label === "Platform") return platformBtnRef;
        if (label === "Mock Interviews") return mockInterviewsBtnRef;
        if (label === "Resources") return resourcesBtnRef;
        return undefined;
    };

    const toggle = (label) => setOpenMenu(prev => prev === label ? null : label);

    useEffect(() => {
        const onMouseDown = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
        };
        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const parent = navRef.current?.closest(".min-h-screen");
            if (parent) {
                setScrolled(parent.scrollTop > 10);
            } else {
                setScrolled(window.scrollY > 10);
            }
        };
        const parent = navRef.current?.closest(".min-h-screen");
        const target = parent || window;
        target.addEventListener("scroll", onScroll, { passive: true });
        return () => target.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className={`sticky top-0 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "bg-white"}`}
            style={{ zIndex: 100 }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-[72px]">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2.5 shrink-0">
                    <img src="/image.png" alt="InterviewAce Logo" className="w-10 h-10 object-contain rounded-lg" />
                    <span className="font-extrabold text-gray-900 text-xl tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Interview<span className="text-[#1caee4]">Ace</span>
                    </span>
                </a>

                {/* Center nav links */}
                <div className="hidden lg:flex items-center gap-1">
                    {navLinks.map(({ label, hasDropdown }) => {
                        const isOpen = openMenu === label;
                        return (
                            <button
                                key={label}
                                ref={hasDropdown ? getBtnRef(label) : undefined}
                                onClick={() => hasDropdown ? toggle(label) : undefined}
                                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all duration-150
                  ${isOpen ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                            >
                                {label}
                                {hasDropdown && (
                                    <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => navigate("/login")}
                        className="hidden sm:block px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-all duration-150 shadow-sm"
                    >
                        Sign Up Free
                    </button>
                </div>
            </div>

            {openMenu === "Platform" && <NavDropdown btnRef={platformBtnRef} navRef={navRef} items={platformItems} />}
            {openMenu === "Mock Interviews" && <NavDropdown btnRef={mockInterviewsBtnRef} navRef={navRef} items={mockInterviewsItems} />}
            {openMenu === "Resources" && <NavDropdown btnRef={resourcesBtnRef} navRef={navRef} items={resourcesItems} />}
        </nav>
    );
}
