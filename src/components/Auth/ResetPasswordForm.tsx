import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { validateInputLength } from '../../utils/security';
import { motion } from 'framer-motion';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if we have the necessary tokens in the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setError('Invalid password reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Input validation
    const passwordValidation = validateInputLength(password, 128, 6);
    const confirmPasswordValidation = validateInputLength(confirmPassword, 128, 6);

    if (!passwordValidation.isValid) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (!confirmPasswordValidation.isValid) {
      setError('Password confirmation must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error: any) {
      if (error.message === 'Auth session missing!') {
        setError('Your password reset link has expired. Please request a new password reset.');
      } else {
        setError('An error occurred while updating your password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 w-full max-w-md"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center">
            <div className="subheading-accent text-primary mb-2">Success!</div>
            <h2 className="section-heading text-primary-700 mb-4">
              Password Updated
            </h2>
            <p className="elegant-text mb-6">
              Your password has been successfully updated. You will be redirected to the login page shortly.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <div className="subheading-accent text-primary mb-2">Reset Password</div>
          <h2 className="section-heading text-primary-700">
            Set New Password
          </h2>
          <p className="elegant-text mt-2">
            Enter your new password below.
          </p>
        </motion.div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
          >
            <label className="block text-foreground mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
              maxLength={128}
              minLength={6}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
          >
            <label className="block text-foreground mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loading}
              maxLength={128}
              minLength={6}
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}