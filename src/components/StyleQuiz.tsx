import { useNavigate } from 'react-router-dom';

export default function StyleQuiz() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <h1 className="text-4xl font-serif font-bold text-primary-700 mb-8 text-center">
          Style Quiz
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-sage-700 text-center mb-8">
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