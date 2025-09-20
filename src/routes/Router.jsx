import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import RootLayout from '@components/layout/RootLayout';

import MainPage from '@pages/MainPage';
import MapPage from '@pages/MapPage';
import ChatPage from '@pages/ChatPage';
import ProfilePage from '@pages/ProfilePage';
import Login from '@pages/Login';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RootLayout />}>
          <Route index element={<MainPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/vegetables" element={<Navigate to="/map" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
