import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RootLayout from '@components/layout/RootLayout'

import MainPage from '@pages/MainPage'
import MapPage from '@pages/MapPage'
import CartPage from '@pages/CartPage'
import ProfilePage from '@pages/ProfilePage'

export default function AppRouter() {
  return (
    <Router>
        <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<MainPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
        </Routes>
    </Router>
  );
}