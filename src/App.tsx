import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import WelcomePage from '../src/pages/WelcomePage';
import HomePage from '../src/pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import RepositoryPage from './pages/RepositoryPage';
import RepositoriesPage from './pages/RepositoriesPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';
import NotificationsPage from './pages/NotificationsPage';
<<<<<<< Updated upstream
=======
import SettingsPage from './pages/SettingsPage';
>>>>>>> Stashed changes
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnimatePresence } from 'framer-motion';
import MessagesPage from './pages/MessagesPage';
import FollowersPage from './pages/FollowersPage';
import FollowingPage from './pages/FollowingPage';
import ConnectsPage from './pages/ConnectsPage';
import EditProfilePage from './pages/EditProfilePage';
import BackgroundPattern from './components/BackgroundPattern';
import Sidebar from './components/Sidebar';
<<<<<<< Updated upstream
=======
import NewRepoPage from './pages/NewRepoPage';
>>>>>>> Stashed changes

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/auth/signin" />;
  }
  
  return <>{children}</>;
};

// Layout component that conditionally renders Navbar
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname === '/home';
  const isAuthPage = location.pathname.startsWith('/auth');
  const isWelcomePage = location.pathname === '/';

  if (isAuthPage || isWelcomePage) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <BackgroundPattern />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <BackgroundPattern />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {showNavbar && <Navbar />}
        <main className="flex-grow backdrop-blur-xl bg-gray-900/40 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20 pointer-events-none" />
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        }>
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/auth/:mode" element={<AuthPage />} />
                <Route path="/home" element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } />
<<<<<<< Updated upstream
=======
                <Route path="/repositories" element={
                  <ProtectedRoute>
                    <RepositoriesPage />
                  </ProtectedRoute>
                } />
>>>>>>> Stashed changes
                <Route path="/explore" element={
                  <ProtectedRoute>
                    <ExplorePage />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                } />
<<<<<<< Updated upstream
                <Route path="/:username" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/:username/:repoName/*" element={
                  <ProtectedRoute>
                    <RepositoryPage />
                  </ProtectedRoute>
                } />
=======
>>>>>>> Stashed changes
                <Route path="/followers" element={
                  <ProtectedRoute>
                    <FollowersPage />
                  </ProtectedRoute>
                } />
                <Route path="/following" element={
                  <ProtectedRoute>
                    <FollowingPage />
                  </ProtectedRoute>
                } />
                <Route path="/connects" element={
                  <ProtectedRoute>
                    <ConnectsPage />
                  </ProtectedRoute>
                } />
                <Route path="/edit-profile" element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                } />
<<<<<<< Updated upstream
                <Route path="PNF" element={<NotFoundPage />} />
=======
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/new-repo" element={
                  <ProtectedRoute>
                    <NewRepoPage />
                  </ProtectedRoute>
                } />
                <Route path="/:username/:repoName/*" element={
                  <ProtectedRoute>
                    <RepositoryPage />
                  </ProtectedRoute>
                } />
                <Route path="/:username" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
>>>>>>> Stashed changes
              </Routes>
            </AnimatePresence>
          </Layout>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
