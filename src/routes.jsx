import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
// Admin section placeholders
import DashboardOverview from './components/admin/DashboardOverview';
import ShakhaManager from './components/admin/ShakhaManager';
import EventManager from './components/admin/EventManager';
import ResourceManager from './components/admin/ResourceManager';
import SevaManager from './components/admin/SevaManager';
import UserManager from './components/admin/UserManager';
import LeaderboardManager from './components/admin/LeaderboardManager';
import NotificationManager from './components/admin/NotificationManager';
import SettingsPanel from './components/admin/SettingsPanel';
import UserNotifications from './components/user/UserNotifications';
import Landing from './pages/Landing';
import EventsPage from './components/user/EventsPage';
import ShakhaLocator from './components/user/ShakhaLocator';
import ResourcesPage from './components/user/ResourcesPage';
import SevaProjectsPage from './components/user/SevaProjectsPage';
import BadgesPage from './components/user/BadgesPage';
import HelpPage from './components/user/HelpPage';
import ProfilePage from './components/user/ProfilePage';
import FeedPage from './components/user/FeedPage';
import UserLayout from './components/user/UserLayout';
import HelpRequestsManager from './components/admin/HelpRequestsManager';

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}> 
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="shakhas" element={<ShakhaManager />} />
          <Route path="events" element={<EventManager />} />
          <Route path="resources" element={<ResourceManager />} />
          <Route path="seva" element={<SevaManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="leaderboard" element={<LeaderboardManager />} />
          <Route path="notifications" element={<NotificationManager />} />
          <Route path="settings" element={<SettingsPanel />} />
          <Route path="help-requests" element={<HelpRequestsManager />} />
        </Route>
      </Route>

      {/* User routes */}
      <Route element={<ProtectedRoute allowedRoles={['user']} />}> 
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="shakha-locator" element={<ShakhaLocator />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="seva-projects" element={<SevaProjectsPage />} />
          <Route path="badges" element={<BadgesPage />} />
          <Route path="notifications" element={<UserNotifications />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="feed" element={<FeedPage />} />
        </Route>
      </Route>

      {/* Default route */}
      <Route path="*" element={<Login />} />
    </Routes>
  </Router>
);

export default AppRoutes; 