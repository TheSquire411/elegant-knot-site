import { useDrag, useDrop } from 'react-dnd';
import { Users, Edit3, Trash2, AlertCircle } from 'lucide-react';
import { SeatingTable, GuestGroup } from '../../../types/guests';

interface DragItem {
  id: string;
  type: string;
  guestCount: number;
}

interface TableCardProps {
  table: SeatingTable;
  assignedGroups: GuestGroup[];
  availability: {
    capacity: number;
    occupied: number;
    available: number;
  };
  onEdit: (table: SeatingTable) => void;
  onDelete: (tableId: string) => void;
  onGroupAssigned: (guestGroupId: string, tableId: string) => void;
  isDraggable?: boolean;
}

const DRAG_TYPES = {
  TABLE: 'table',
  GUEST_GROUP: 'guestGroup'
};

export default function TableCard({
  table,
  assignedGroups,
  availability,
  onEdit,
  onDelete,
  onGroupAssigned,
  isDraggable = false
}: TableCardProps) {
  // Drag functionality for moving table
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPES.TABLE,
    item: { id: table.id, type: DRAG_TYPES.TABLE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isDraggable
  }));

  // Drop functionality for accepting guest groups
  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: DRAG_TYPES.GUEST_GROUP,
    drop: (item: DragItem) => {
      if (item.type === DRAG_TYPES.GUEST_GROUP && availability.available >= item.guestCount) {
        onGroupAssigned(item.id, table.id);
      }
    },
    canDrop: (item: DragItem) => availability.available >= item.guestCount,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }));

  const getTableShape = () => {
    switch (table.shape) {
      case 'round':
        return 'rounded-full';
      case 'square':
        return 'rounded-lg';
      case 'rectangular':
        return 'rounded-lg';
      default:
        return 'rounded-lg';
    }
  };

  const getTableSize = () => {
    const baseSize = table.capacity <= 4 ? 'w-24 h-24' : 
                    table.capacity <= 8 ? 'w-32 h-32' : 'w-40 h-40';
    
    if (table.shape === 'rectangular') {
      return table.capacity <= 4 ? 'w-32 h-20' : 
             table.capacity <= 8 ? 'w-40 h-24' : 'w-48 h-28';
    }
    
    return baseSize;
  };

  const getStatusColor = () => {
    if (availability.occupied === 0) return 'bg-gray-100 border-gray-300';
    if (availability.available === 0) return 'bg-red-50 border-red-300';
    if (availability.available < 2) return 'bg-yellow-50 border-yellow-300';
    return 'bg-green-50 border-green-300';
  };

  const getDropStyle = () => {
    if (isOver && canDrop) return ' ring-2 ring-green-400 ring-opacity-75';
    if (isOver && !canDrop) return ' ring-2 ring-red-400 ring-opacity-75';
    return '';
  };

  const attachRef = (el: HTMLDivElement | null) => {
    drag(el);
    drop(el);
  };

  return (
    <div
      ref={attachRef}
      className={`
        ${getTableSize()} ${getTableShape()} ${getStatusColor()}
        border-2 relative cursor-pointer transition-all duration-200
        ${isDragging ? 'opacity-50 transform scale-95' : ''}
        ${isDraggable ? 'hover:shadow-lg hover:scale-105' : ''}
        ${getDropStyle()}
        flex flex-col items-center justify-center p-2
      `}
      style={{
        position: isDraggable ? 'absolute' : 'relative',
        left: isDraggable ? table.x_position : 'auto',
        top: isDraggable ? table.y_position : 'auto'
      }}
    >
      {/* Table Header */}
      <div className="text-center mb-1">
        <h4 className="text-xs font-semibold text-gray-800 truncate max-w-full">
          {table.name}
        </h4>
        <div className="flex items-center justify-center space-x-1 text-xs text-gray-600">
          <Users className="h-3 w-3" />
          <span>{availability.occupied}/{availability.capacity}</span>
        </div>
      </div>

      {/* Assigned Groups */}
      {assignedGroups.length > 0 && (
        <div className="text-center">
          {assignedGroups.slice(0, 2).map((group) => (
            <div key={group.id} className="text-xs text-gray-600 truncate max-w-full">
              {group.name}
            </div>
          ))}
          {assignedGroups.length > 2 && (
            <div className="text-xs text-gray-500">
              +{assignedGroups.length - 2} more
            </div>
          )}
        </div>
      )}

      {/* Capacity Warning */}
      {availability.available === 0 && availability.occupied > 0 && (
        <AlertCircle className="h-3 w-3 text-red-500 mt-1" />
      )}

      {/* Action Buttons (only show when not dragging) */}
      {!isDragging && !isDraggable && (
        <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(table);
            }}
            className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
          >
            <Edit3 className="h-3 w-3 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(table.id);
            }}
            className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
          >
            <Trash2 className="h-3 w-3 text-red-600" />
          </button>
        </div>
      )}

      {/* Drop indicator */}
      {isOver && (
        <div className={`absolute inset-0 ${getTableShape()} border-2 border-dashed ${
          canDrop ? 'border-green-400 bg-green-100' : 'border-red-400 bg-red-100'
        } bg-opacity-50 flex items-center justify-center`}>
          <span className={`text-xs font-medium ${
            canDrop ? 'text-green-700' : 'text-red-700'
          }`}>
            {canDrop ? 'Drop Here' : 'No Space'}
          </span>
        </div>
      )}
    </div>
  );
}