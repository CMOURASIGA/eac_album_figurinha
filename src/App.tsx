import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Solicitar } from './pages/Solicitar';
import { Admin } from './pages/Admin';
import { Scan } from './pages/Scan';
import { VisualizarFigurinha } from './pages/VisualizarFigurinha';
import { Splash } from './components/Splash';
import { supabase } from './lib/supabase';
import { useStore } from './lib/store';

import { Ajuda } from './pages/Ajuda';

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
  const setEncounters = useStore(state => state.setEncounters);

  const [showSplash, setShowSplash] = useState(() => {
    // Check if it's the first time in this session
    return !sessionStorage.getItem('splashShown');
  });

  useEffect(() => {
    async function syncEncounters() {
      const { data, error } = await supabase
        .from('encontros')
        .select('id, nome')
        .order('nome', { ascending: true }); 

      if (error) {
        console.error('Error fetching encounters:', error);
      } else if (data) {
         setEncounters(data.map(d => ({
            id: d.id,
            name: d.nome,
            logoUrl: 'https://i.imgur.com/c5XQ7TW.png' // Default logo, since columns mostly are missing it
         })));
      }
    }
    syncEncounters();
  }, [setEncounters]);

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
            <Route path="ajuda" element={<Ajuda />} />
            <Route path="figurinha/:id" element={<VisualizarFigurinha />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
