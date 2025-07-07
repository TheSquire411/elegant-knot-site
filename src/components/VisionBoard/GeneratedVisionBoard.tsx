
import { Plus, ImageIcon } from 'lucide-react';
import SortableImage, { Image } from './SortableImage';

interface GeneratedVisionBoardProps {
  images: Image[];
  onDelete: (id: string) => void;
  onAddImages?: () => void;
  isLoading?: boolean;
}

const GeneratedVisionBoard = ({ 
  images, 
  onDelete, 
  onAddImages,
  isLoading = false 
}: GeneratedVisionBoardProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading your vision board...</span>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Your vision board is empty
        </h3>
        <p className="text-muted-foreground mb-6">
          Generate a vision board or search for images to add to your collection
        </p>
        {onAddImages && (
          <button
            onClick={onAddImages}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Images</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Your Vision Board ({images.length} images)
        </h3>
        {onAddImages && (
          <button
            onClick={onAddImages}
            className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Add More</span>
          </button>
        )}
      </div>
      
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
        {images.map((image) => (
          <div key={image.id} className="break-inside-avoid">
            <SortableImage image={image} onDelete={onDelete} />
          </div>
        ))}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Drag and drop images to rearrange • Click the X to remove images</p>
      </div>
    </div>
  );
};

export default GeneratedVisionBoard;