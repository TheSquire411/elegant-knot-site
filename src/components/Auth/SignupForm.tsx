import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { sanitizeInput, validateEmail, validateInputLength, checkRateLimit } from '../../utils/security';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Rate limiting check
    if (!checkRateLimit('signup', 3, 600000)) { // 3 attempts per 10 minutes
      setError('Too many signup attempts. Please wait 10 minutes before trying again.');
      setLoading(false);
      return;
    }

    // Input validation and sanitization
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedFullName = sanitizeInput(fullName);
    const sanitizedUsername = sanitizeInput(username);

    const emailValidation = validateInputLength(sanitizedEmail, 255, 1);
    const fullNameValidation = validateInputLength(sanitizedFullName, 100, 1);
    const usernameValidation = validateInputLength(sanitizedUsername, 50, 1);
    const passwordValidation = validateInputLength(password, 128, 6);

    if (!emailValidation.isValid || !validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!fullNameValidation.isValid) {
      setError('Full name must be between 1 and 100 characters.');
      setLoading(false);
      return;
    }

    if (!usernameValidation.isValid) {
      setError('Username must be between 1 and 50 characters.');
      setLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // Check for potentially unsafe characters in username
    if (!/^[a-zA-Z0-9_-]+$/.test(sanitizedUsername)) {
      setError('Username can only contain letters, numbers, underscores, and hyphens.');
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: sanitizedFullName,
            username: sanitizedUsername
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        if (data.user.email_confirmed_at) {
          // User is automatically confirmed
          window.location.href = '/quiz';
        } else {
          // User needs to confirm email
          setMessage('Please check your email and click the confirmation link to complete your signup.');
        }
      }
    } catch (error: any) {
      if (error.message === 'User already registered') {
        setError('An account with this email already exists. Please try logging in instead.');
      } else {
        setError('An error occurred during signup. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 w-full max-w-md">
        <h2 className="text-3xl font-serif font-bold text-primary-700 mb-6 text-center">
          Create Account
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-foreground mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-foreground mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
              maxLength={50}
              pattern="[a-zA-Z0-9_-]+"
              title="Username can only contain letters, numbers, underscores, and hyphens"
            />
          </div>
          <div>
            <label className="block text-foreground mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
              maxLength={255}
            />
          </div>
          <div>
            <label className="block text-foreground mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
              minLength={6}
              maxLength={128}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}