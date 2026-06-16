import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Star, PlusCircle, Shield, QrCode, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navigation() {
  const location = useLocation();
  const isAdminOrScan = location.pathname.startsWith('/admin') || location.pathname.startsWith('/scan');

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
      isActive
        ? "bg-[#0f4c81] text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-[#0f4c81]"
    );

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex flex-col items-center justify-center w-full py-2 text-xs font-medium transition-colors",
      isActive
        ? "text-[#0f4c81]"
        : "text-gray-500 hover:text-[#0f4c81]"
    );

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <img 
                  src="https://i.imgur.com/c5XQ7TW.png" 
                  alt="EAC Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="font-bold text-xl text-[#0f4c81] hidden sm:block">Álbum EAC</span>
              </div>
              
              <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
                <NavLink to="/" className={navLinkClass}>
                  <BookOpen className="h-4 w-4" />
                  <span>Álbum</span>
                </NavLink>
                <NavLink to="/solicitar" className={navLinkClass}>
                  <PlusCircle className="h-4 w-4" />
                  <span>Criar Figurinha</span>
                </NavLink>
                <NavLink to="/scan" className={navLinkClass}>
                  <QrCode className="h-4 w-4" />
                  <span>Escanear</span>
                </NavLink>
                <NavLink to="/ajuda" className={navLinkClass}>
                  <HelpCircle className="h-4 w-4" />
                  <span>Ajuda</span>
                </NavLink>
              </div>
            </div>
            
            <div className="flex items-center">
               <NavLink to="/admin" className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-md bg-white hover:bg-gray-50 transition-colors shadow-sm">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-gray-700">Admin</span>
               </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav space filler */}
      {!isAdminOrScan && <div className="h-16 sm:hidden" />}

      {/* Mobile fixed bottom nav */}
      {!isAdminOrScan && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 border-t bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center h-[72px] pb-2 pt-1">
           <NavLink to="/" className={mobileNavLinkClass}>
              <BookOpen className="h-6 w-6 mb-1" />
              <span>Álbum</span>
           </NavLink>
           <NavLink to="/solicitar" className={mobileNavLinkClass}>
              <PlusCircle className="h-6 w-6 mb-1" />
              <span>Criar</span>
           </NavLink>
           <NavLink to="/scan" className={mobileNavLinkClass}>
              <QrCode className="h-6 w-6 mb-1" />
              <span>Escanear</span>
           </NavLink>
           <NavLink to="/ajuda" className={mobileNavLinkClass}>
              <HelpCircle className="h-6 w-6 mb-1" />
              <span>Ajuda</span>
           </NavLink>
        </div>
      )}
    </>
  );
}
