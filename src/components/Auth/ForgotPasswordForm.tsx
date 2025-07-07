import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { sanitizeInput, validateEmail, validateInputLength, checkRateLimit } from '../../utils/security';
import { motion } from 'framer-motion';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Rate limiting check
    if (!checkRateLimit('forgot-password', 3, 600000)) { // 3 attempts per 10 minutes
      setError('Too many password reset attempts. Please wait 10 minutes before trying again.');
      setLoading(false);
      return;
    }

    // Input validation
    const sanitizedEmail = sanitizeInput(email);
    const emailValidation = validateInputLength(sanitizedEmail, 255, 1);

    if (!emailValidation.isValid) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error: any) {
      setError('An error occurred while sending the password reset email. Please try again.');
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
            <div className="subheading-accent text-primary mb-2">Check Your Email</div>
            <h2 className="section-heading text-primary-700 mb-4">
              Password Reset Link Sent
            </h2>
            <p className="elegant-text mb-6">
              We've sent a password reset link to <strong>{email}</strong>. 
              Click the link in the email to reset your password.
            </p>
            <Link
              to="/login"
              className="text-primary-600 hover:underline font-medium"
            >
              Back to Login
            </Link>
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
            Forgot Your Password?
          </h2>
          <p className="elegant-text mt-2">
            Enter your email address and we'll send you a link to reset your password.
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
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </motion.button>
        </motion.form>

        <motion.p 
          className="elegant-text text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
        >
          Remember your password?{' '}
          <Link to="/login" className="text-primary-600 hover:underline font-medium">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}