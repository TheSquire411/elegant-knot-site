import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Heart, Gift } from "lucide-react";

const WeddingDetails = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Wedding Details
          </h2>
          <p className="text-lg text-muted-foreground">
            Join us for our special celebration
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Ceremony */}
          <Card className="p-8 shadow-romantic hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-6 text-foreground">
                Ceremony
              </h3>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Saturday, June 15, 2024</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">4:00 PM</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div className="text-muted-foreground">
                    <p>Garden Pavilion</p>
                    <p>Countryside Estate</p>
                    <p>123 Meadowbrook Lane</p>
                    <p>Rosewood Valley, CA 90210</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Reception */}
          <Card className="p-8 shadow-romantic hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Gift className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-6 text-foreground">
                Reception
              </h3>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span className="text-muted-foreground">Immediately Following</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-secondary" />
                  <span className="text-muted-foreground">6:00 PM - 11:00 PM</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary mt-1" />
                  <div className="text-muted-foreground">
                    <p>Grand Ballroom</p>
                    <p>Countryside Estate</p>
                    <p>Same Location</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Additional Information */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center shadow-soft">
            <h4 className="font-heading text-lg font-bold mb-2 text-foreground">Dress Code</h4>
            <p className="text-muted-foreground">Cocktail Attire</p>
            <p className="text-sm text-muted-foreground mt-2">
              We suggest garden party elegant
            </p>
          </Card>
          
          <Card className="p-6 text-center shadow-soft">
            <h4 className="font-heading text-lg font-bold mb-2 text-foreground">Parking</h4>
            <p className="text-muted-foreground">Complimentary Valet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Available on-site
            </p>
          </Card>
          
          <Card className="p-6 text-center shadow-soft">
            <h4 className="font-heading text-lg font-bold mb-2 text-foreground">Accommodations</h4>
            <p className="text-muted-foreground">Room Block Available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Details in your invitation
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WeddingDetails;