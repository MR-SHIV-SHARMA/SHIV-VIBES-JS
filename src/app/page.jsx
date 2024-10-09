import FeaturedCourses from "../components/FeaturedCourses";
import Footer from "../components/Footer";
import GoogleGeminiEffectDemo from "../components/Google-Gemini-Effect";
import HeroParallaxDemo from "../components/HeroParallaxDemo";
import TestimonialsCards from "../components/TestimonialsCards";
import UpcomingWebinars from "../components/UpcomingWebinars";
import WhyChooseUs from "../components/WhyChooseUs";


export default function Home() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <HeroParallaxDemo />
      <FeaturedCourses />
      <WhyChooseUs />
      <TestimonialsCards />
      <UpcomingWebinars />
      <GoogleGeminiEffectDemo />
      <Footer />
    </main>
  );
}
