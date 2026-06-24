import React from "react";
import HomeNavbar from "../components/home/HomeNavbar";
import HomeHero from "../components/home/HomeHero";
import HomeVideo from "../components/home/HomeVideo";
import HomeIde from "../components/home/HomeIde";
import {
  DashboardSection,
  TopicsSection,
  FeaturesGrid,
  InterviewAceProSection,
  SkillBadgesSection,
  ExpertCoachingSection
} from "../components/home/HomeFeatures";
import {
  TrustedBySection,
  TestimonialsSection,
  SecondTestimonial,
  StudentReviews,
  HowItWorksSection,
  PricingPreviewSection,
  FaqSection,
  CommunitySection,
  FeaturedInSection,
  ResourcesSection,
  TrustedSection,
  CtaSection,
  HomeFooter
} from "../components/home/HomeSocial";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white overflow-y-auto relative" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(28,174,228,0.18) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[25%] -left-24 w-[420px] h-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(110,206,59,0.14) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-[12%] w-[360px] h-[360px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0 soft-grid opacity-40" />
      </div>
      <HomeNavbar />
      <HomeHero />
      <TrustedBySection />
      <FeaturesGrid />
      <HowItWorksSection />
      <HomeVideo />
      <HomeIde />
      <DashboardSection />
      <TopicsSection />
      <TestimonialsSection />
      <PricingPreviewSection />
      <InterviewAceProSection />
      <SkillBadgesSection />
      <ExpertCoachingSection />
      <SecondTestimonial />
      <StudentReviews />
      <FaqSection />
      <CommunitySection />
      <FeaturedInSection />
      <ResourcesSection />
      <TrustedSection />
      <CtaSection />
      <HomeFooter />
    </div>
  );
}
