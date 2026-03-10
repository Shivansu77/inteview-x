import React, { useRef, useState, useEffect } from "react";

function getScrollParent(element) {
    if (!element) return window;
    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;
    if ((overflowY === "auto" || overflowY === "scroll") && element.scrollHeight > element.clientHeight) {
        return element;
    }
    return getScrollParent(element.parentElement) || window;
}

export default function HomeVideo() {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollParent = getScrollParent(container.parentElement);

        const onScroll = () => {
            const rect = container.getBoundingClientRect();
            const vh = window.innerHeight;
            const raw = (vh - rect.top) / (vh * 1.2);
            const eased = 1 - Math.pow(1 - Math.min(Math.max(raw, 0), 1), 3);
            setProgress(eased);

            if (videoRef.current) {
                if (eased > 0.05) {
                    videoRef.current.play().catch(() => {});
                }
            }
        };

        const target = scrollParent === window ? window : scrollParent;
        target.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        onScroll();

        return () => {
            target.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const tryPlay = () => video.play().catch(() => {});
        tryPlay();
        video.addEventListener("canplay", tryPlay, { once: true });
        return () => video.removeEventListener("canplay", tryPlay);
    }, []);

    const scale = 0.6 + progress * 0.4;
    const radius = 24 - progress * 16;
    const opacity = 0.3 + progress * 0.7;

    return (
        <section ref={containerRef} className="py-24 px-6" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)", minHeight: "70vh" }}>
            <div className="max-w-5xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    See InterviewAce In Action
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Watch how our AI interviewer conducts realistic technical interviews with real-time feedback.
                </p>
            </div>
            <div className="max-w-5xl mx-auto" style={{ perspective: "1200px" }}>
                <div
                    className="overflow-hidden aspect-video mx-auto"
                    style={{
                        transform: `scale(${scale})`,
                        borderRadius: `${radius}px`,
                        opacity,
                        transition: "transform 0.35s ease-out, border-radius 0.35s ease-out, opacity 0.35s ease-out",
                        willChange: "transform, border-radius, opacity",
                        boxShadow: "0 25px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",
                    }}
                >
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="https://res.cloudinary.com/df2sjtgh6/video/upload/v1773050614/Screen_Recording_2026-03-09_at_3.30.28_PM_effk1d.mov" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </section>
    );
}
