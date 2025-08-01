
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import NotificationCenter from './components/common/NotificationCenter';

// Import all your page components
import LandingPage from './components/LandingPage';
import SignupForm from './components/Auth/SignupForm';
import LoginForm from './components/Auth/LoginForm';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import StyleQuiz from './components/StyleQuiz';
import Dashboard from './components/Dashboard/Dashboard';
import PlanningPage from './components/Planning/PlanningPage';
import GuestListPage from './components/Planning/GuestListPage';
import SeatingPage from './components/Planning/SeatingPage';
import BudgetPage from './components/Budget/BudgetPage';
import ChatPage from './components/Chat/ChatPage';
import VisionBoardPage from './components/VisionBoard/VisionBoardPage';
import WebsitePage from './components/Website/WebsitePage';
import RegistryPage from './components/Registry/RegistryPage';
import UpgradePage from './components/UpgradePage';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';
import AdminDashboard from './components/Admin/AdminDashboard';
import RSVPPage from './components/RSVP/RSVPPage';
import BlogPage from './components/Blog/BlogPage';
import BlogPost from './components/Blog/BlogPost';
import BlogAdminDashboard from './components/Blog/BlogAdminDashboard';
import BlogPostEditor from './components/Blog/BlogPostEditor';
import PublicWeddingWebsite from './components/Website/PublicWeddingWebsite';
import { GuestPhotoManager } from './components/GuestPhotos/GuestPhotoManager';
import { GuestPhotoUpload } from './components/GuestPhotos/GuestPhotoUpload';


/**
 * A component to protect routes that require authentication.
 * If the user is not logged in, it redirects them to the login page.
 */
function ProtectedRoute() {
  const { state } = useApp();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!state.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they
    // log in, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // Renders the child route's element
}

/**
 * The main application component that sets up routing.
 */
function AppRoutes() {
  return (
    <div className="app">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/upgrade" element={<UpgradePage />} />
        <Route path="/rsvp/:token" element={<RSVPPage />} />
        
        {/* Public Wedding Website Routes */}
        <Route path="/wedding/:slug" element={<PublicWeddingWebsite />} />
        
        {/* Public Guest Photo Upload */}
        <Route path="/photos/:shareCode" element={<GuestPhotoUpload />} />
        
        {/* Blog Routes */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/category/:category" element={<BlogPage />} />
        <Route path="/blog/tag/:tag" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/quiz" element={<StyleQuiz />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/planning/guests" element={<GuestListPage />} />
          <Route path="/planning/seating" element={<SeatingPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/vision-board" element={<VisionBoardPage />} />
          <Route path="/website" element={<WebsitePage />} />
          <Route path="/registry" element={<RegistryPage />} />
          <Route path="/guest-photos" element={<GuestPhotoManager />} />
          
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/blog/admin" element={<BlogAdminDashboard />} />
          <Route path="/blog/admin/new" element={<BlogPostEditor mode="create" />} />
          <Route path="/blog/admin/edit/:id" element={<BlogPostEditor mode="edit" />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

/**
 * The root App component that wraps the application with the context provider.
 */
function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="min-h-screen bg-gradient-to-br from-sage-50 to-blush-50">
          <AppRoutes />
          <NotificationCenter />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;