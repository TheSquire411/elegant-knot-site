import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const RSVPSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: "1",
    attending: "",
    dietary: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("RSVP submitted:", formData);
  };

  return (
    <section className="py-20 px-4 bg-romantic-gradient">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            RSVP
          </h2>
          <p className="text-lg text-white/90">
            We can't wait to celebrate with you!
          </p>
          <p className="text-white/80 mt-2">
            Please respond by April 15, 2024
          </p>
        </div>
        
        <Card className="p-8 shadow-romantic bg-white/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="transition-romantic"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="transition-romantic"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-foreground font-medium">
                  Number of Guests
                </Label>
                <select
                  id="guests"
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                  className="w-full p-2 border border-input rounded-md bg-background transition-romantic focus:ring-2 focus:ring-ring"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-foreground font-medium">
                  Will you be attending? *
                </Label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      onChange={(e) => setFormData({...formData, attending: e.target.value})}
                      className="text-primary"
                      required
                    />
                    <span className="text-muted-foreground">Yes, I'll be there!</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      onChange={(e) => setFormData({...formData, attending: e.target.value})}
                      className="text-primary"
                      required
                    />
                    <span className="text-muted-foreground">Sorry, can't make it</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dietary" className="text-foreground font-medium">
                Dietary Restrictions or Allergies
              </Label>
              <Input
                id="dietary"
                type="text"
                value={formData.dietary}
                onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                placeholder="Let us know about any dietary needs"
                className="transition-romantic"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground font-medium">
                Special Message for the Couple
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Share your excitement or well wishes..."
                className="transition-romantic min-h-[100px]"
              />
            </div>
            
            <div className="text-center pt-4">
              <Button 
                type="submit" 
                variant="wedding" 
                size="lg"
                className="px-12 text-lg"
              >
                Send RSVP
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default RSVPSection;