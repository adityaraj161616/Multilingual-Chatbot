import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { BenefitsSection } from "@/components/landing/benefits-section"
import { LanguageSection } from "@/components/landing/language-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      <main>
        <HeroSection />
        <LanguageSection />
        <FeaturesSection />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
