
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';

export interface Image {
  id: string;
  url: string;
  type?: string;
  category?: string;
}

interface SortableImageProps {
  image: Image;
  onDelete: (id: string) => void;
}

const SortableImage = ({ image, onDelete }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 z-50' : ''
      }`}
    >
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <img 
          src={image.url} 
          alt={`Vision board ${image.category || 'image'}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.id);
          }}
          className="absolute top-2 right-2 bg-background/90 hover:bg-background text-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:shadow-lg"
          title="Remove image"
        >
          <X className="h-3 w-3" />
        </button>
        {image.category && (
          <div className="absolute bottom-2 left-2 bg-background/90 text-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {image.category}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortableImage;