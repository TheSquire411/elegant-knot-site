import WeddingHero from "@/components/WeddingHero";
import AboutCouple from "@/components/AboutCouple";
import WeddingDetails from "@/components/WeddingDetails";
import RSVPSection from "@/components/RSVPSection";
import GiftRegistry from "@/components/GiftRegistry";
import WeddingFooter from "@/components/WeddingFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <WeddingHero />
      <AboutCouple />
      <WeddingDetails />
      <RSVPSection />
      <GiftRegistry />
      <WeddingFooter />
    </div>
  );
};

export default Index;
