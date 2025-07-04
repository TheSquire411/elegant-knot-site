import { useNavigate } from 'react-router-dom';
import BackButton from './common/BackButton';

export default function StyleQuiz() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-8">
          <BackButton />
        </div>
        <h1 className="text-4xl font-serif font-bold text-primary-700 mb-8 text-center">
          Style Quiz
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-muted-foreground text-center mb-8">
            Help us understand your wedding style preferences
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}