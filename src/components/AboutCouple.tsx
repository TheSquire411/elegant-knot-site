import { Card } from "@/components/ui/card";

const AboutCouple = () => {
  return (
    <section className="py-20 px-4 bg-soft-gradient">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Love Story
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Two hearts, one beautiful journey together
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Emma's Side */}
          <Card className="p-8 shadow-romantic hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-heading font-bold text-primary">E</span>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-foreground">Emma</h3>
              <p className="text-muted-foreground leading-relaxed">
                A passionate photographer who sees beauty in every moment. 
                Emma believes in capturing life's precious memories and 
                creating art that tells a story. She loves weekend adventures, 
                trying new coffee shops, and planning surprise picnics.
              </p>
            </div>
          </Card>
          
          {/* James's Side */}
          <Card className="p-8 shadow-romantic hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-32 h-32 bg-secondary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-heading font-bold text-secondary">J</span>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-foreground">James</h3>
              <p className="text-muted-foreground leading-relaxed">
                An architect with a love for sustainable design and innovation. 
                James brings creativity and structure to everything he does. 
                He enjoys hiking, cooking elaborate Sunday dinners, and 
                building things with his hands.
              </p>
            </div>
          </Card>
        </div>
        
        {/* How We Met */}
        <Card className="mt-16 p-12 shadow-romantic bg-primary/5 border-primary/20">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="font-heading text-3xl font-bold mb-6 text-foreground">
              How We Met
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              It was a rainy Tuesday evening at the local bookstore café. Emma was editing photos 
              on her laptop while James sketched building designs at the next table. When Emma's 
              coffee accidentally spilled onto James's sketches, what could have been a disaster 
              turned into three hours of conversation about art, dreams, and the perfect rainy day. 
              Two years later, we still visit that same café every Tuesday.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AboutCouple;