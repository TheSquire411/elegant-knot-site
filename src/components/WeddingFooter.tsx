import { Heart } from "lucide-react";

const WeddingFooter = () => {
  return (
    <footer className="py-12 px-4 bg-foreground text-background">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-6 h-6 fill-primary text-primary" />
          <span className="font-heading text-2xl font-bold">Emma & James</span>
          <Heart className="w-6 h-6 fill-primary text-primary" />
        </div>
        
        <p className="text-lg mb-2">June 15, 2024</p>
        <p className="text-muted opacity-80 mb-6">
          Countryside Estate • Rosewood Valley, CA
        </p>
        
        <div className="border-t border-background/20 pt-6">
          <p className="text-sm opacity-70">
            Can't wait to celebrate with our favorite people ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default WeddingFooter;