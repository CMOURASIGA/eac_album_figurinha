import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Solicitar } from './pages/Solicitar';
import { Admin } from './pages/Admin';
import { Scan } from './pages/Scan';
import { VisualizarFigurinha } from './pages/VisualizarFigurinha';
import { Splash } from './components/Splash';

function Layout() {
  return (
    <div className="min-h-screen bg-[#07243c] flex flex-col font-sans text-gray-900 selection:bg-[#fcd116] selection:text-[#07243c]">
      <Navigation />
      <main className="flex-1 w-full bg-[#07243c]">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if it's the first time in this session
    return !sessionStorage.getItem('splashShown');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <Splash onComplete={handleSplashComplete} />}
      {!showSplash && (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="solicitar" element={<Solicitar />} />
            <Route path="scan" element={<Scan />} />
            <Route path="figurinha/:id" element={<VisualizarFigurinha />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
