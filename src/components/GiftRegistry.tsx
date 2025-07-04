import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift, Heart } from "lucide-react";

const GiftRegistry = () => {
  return (
    <section className="py-20 px-4 bg-soft-gradient">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-16">
          <Gift className="mx-auto mb-6 w-12 h-12 text-primary" />
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Gift Registry
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your presence is the greatest gift, but if you'd like to help us start our new life together, 
            we've registered at a few of our favorite places.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 shadow-romantic hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏺</span>
              </div>
              <h3 className="font-heading text-xl font-bold mb-2 text-foreground">
                Williams Sonoma
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                For our kitchen and home essentials
              </p>
              <Button variant="outline" className="w-full">
                View Registry
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 shadow-romantic hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-heading text-xl font-bold mb-2 text-foreground">
                Crate & Barrel
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Modern furniture and decor
              </p>
              <Button variant="outline" className="w-full">
                View Registry
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 shadow-romantic hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">✈️</span>
              </div>
              <h3 className="font-heading text-xl font-bold mb-2 text-foreground">
                Honeymoon Fund
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Help us make memories in Italy
              </p>
              <Button variant="outline" className="w-full">
                Contribute
              </Button>
            </div>
          </Card>
        </div>
        
        <Card className="p-8 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-primary" />
            <h3 className="font-heading text-2xl font-bold text-foreground">
              A Note from Emma & James
            </h3>
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            We are so grateful to have you in our lives and to share this special day with you. 
            Your love and support mean the world to us. If you choose to give a gift, know that 
            it will be treasured as we build our life together. But truly, having you there to 
            celebrate with us is all we could ask for.
          </p>
          <p className="text-primary font-medium mt-4">
            With love and gratitude ❤️
          </p>
        </Card>
      </div>
    </section>
  );
};

export default GiftRegistry;