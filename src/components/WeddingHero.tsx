import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import heroImage from "@/assets/wedding-hero.jpg";

const WeddingHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <Heart className="mx-auto mb-6 w-12 h-12 text-primary animate-pulse" />
        
        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4 tracking-wide">
          Emma & James
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 font-light tracking-wider">
          are getting married
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 inline-block">
          <p className="text-lg md:text-xl font-medium mb-2">Save the Date</p>
          <p className="text-2xl md:text-3xl font-heading font-bold">
            June 15, 2024
          </p>
          <p className="text-lg mt-2 opacity-90">
            Garden Pavilion, Countryside Estate
          </p>
        </div>
        
        <div className="space-x-4">
          <Button variant="wedding" size="lg" className="text-lg px-8">
            RSVP Now
          </Button>
          <Button variant="elegant" size="lg" className="text-lg px-8">
            View Details
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default WeddingHero;