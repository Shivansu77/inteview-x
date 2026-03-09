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
  CommunitySection,
  FeaturedInSection,
  ResourcesSection,
  TrustedSection,
  CtaSection,
  HomeFooter
} from "../components/home/HomeSocial";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white overflow-y-auto" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <HomeNavbar />
      <HomeHero />
      <TrustedBySection />
      <FeaturesGrid />
      <HomeVideo />
      <HomeIde />
      <DashboardSection />
      <TopicsSection />
      <TestimonialsSection />
      <InterviewAceProSection />
      <SkillBadgesSection />
      <ExpertCoachingSection />
      <SecondTestimonial />
      <StudentReviews />
      <CommunitySection />
      <FeaturedInSection />
      <ResourcesSection />
      <TrustedSection />
      <CtaSection />
      <HomeFooter />
    </div>
  );
}
