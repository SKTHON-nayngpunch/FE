import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import MainPage from '@pages/MainPage';
import MapPage from '@pages/MapPage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/vegetables" element={<Navigate to="/map" replace />} />
      </Routes>
    </Router>
  );
}
