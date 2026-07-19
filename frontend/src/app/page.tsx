import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedExperiences } from "@/components/home/FeaturedExperiences";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { AISpotlightSection } from "@/components/home/AISpotlightSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedExperiences />
      <HowItWorksSection />
      <CategoriesSection />
      <AISpotlightSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <CTASection />
    </>
  );
}
