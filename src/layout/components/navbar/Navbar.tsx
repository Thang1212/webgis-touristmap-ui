import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, MapPin, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isBg, setIsBg] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle scroll for background
  useEffect(() => {
    const handleScroll = () => {
      setIsBg(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
      setShowUserMenu(false);
    };

    if (isOpen || showUserMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, showUserMenu]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav
     className={`fixed top-0 left-0 w-full bg-amber-50 z-[200] px-8 py-1 transition-all duration-300 ${
    isBg || isOpen ? 'bg-black/80 backdrop-blur-xl shadow-lg' : ''
      }`}
    >
      <div className="flex justify-between items-center">

        <Link
          to="/map"
          className="font-bold text-xl md:text-2xl text-white hover:text-amber-400 transition-colors flex items-center gap-2"
        >
          <MapPin className="text-amber-500" size={24} />
          <span className="tracking-wider text-amber-400">Du lịch Phan Thiết</span>
        </Link>

        {/* Desktop Menu - Right Side (Auth) */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-amber-500 hover:text-amber-400 transition-colors font-medium"
                >
                                      Trang quản lý
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors"
                >
                  <User size={20} />
                  <span className="font-medium text-amber-400">{user?.name || user?.email?.split('@')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-lg shadow-xl border border-amber-500/20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-amber-500/20">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-white font-medium truncate">{user?.email}</p>
                      <p className="text-xs text-amber-500 capitalize">{user?.role}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-white hover:bg-amber-500/10 transition-colors"
                    >
                      <Settings size={16} />
                      <span>Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-amber-500 hover:text-amber-400 transition-colors font-medium"
              >
                login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
              >
                sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white z-50 hover:text-amber-400 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl px-6 py-6 space-y-4 border-t border-amber-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Navigation Links */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-white hover:text-amber-400 transition-colors font-medium py-2"
          >
            home
          </Link>
          <Link
            to="/map"
            onClick={() => setIsOpen(false)}
            className="block text-white hover:text-amber-400 transition-colors font-medium py-2"
          >
            explore
          </Link>
          <Link
            to="#destinations"
            onClick={() => setIsOpen(false)}
            className="block text-white hover:text-amber-400 transition-colors font-medium py-2"
          >
            destinations
          </Link>

          {/* Search */}
          <button className="w-full flex items-center gap-2 text-white hover:text-amber-400 transition-colors py-2">
            <Search size={20} />
            <span>Search</span>
          </button>

          {/* Divider */}
          <div className="border-t border-amber-500/20 pt-4">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="mb-4 pb-4 border-b border-amber-500/20">
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="text-white font-medium">{user?.email}</p>
                  <p className="text-xs text-amber-500 capitalize">{user?.role}</p>
                </div>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block text-white hover:text-amber-400 transition-colors font-medium py-2"
                  >
                                        Trang quản lý

                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors py-2"
                >
                  <Settings size={20} />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors py-2 mt-2"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-white hover:text-amber-400 transition-colors font-medium py-2"
                >
                  login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors mt-4"
                >
                  sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};