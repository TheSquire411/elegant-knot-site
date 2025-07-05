import SeatingChart from './SeatingChart/SeatingChart';
import BackButton from '../common/BackButton';

export default function SeatingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seating Arrangement</h1>
        <p className="text-gray-600 mt-2">Organize your guests with an interactive drag-and-drop seating chart</p>
      </div>

      <SeatingChart />
    </div>
  );
}