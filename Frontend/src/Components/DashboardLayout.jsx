import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'Farmer', path: '/' },
    { icon: User, label: 'Manufacturer', path: '/manufacturer' },
    { icon: User, label: 'Distributer', path: '/distributer' },
    { icon: User, label: 'Retailer', path: '/retailer' },
    { icon: User, label: 'Consumer', path: '/consumer' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="h-16 bg-white shadow-sm flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center">
          <button className="p-2 rounded-full text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
          </button>
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } w-64 bg-white md:block md:translate-x-0`}
        >
          <div className="h-full flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 md:hidden">
              <span className="text-xl font-bold">Logo</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 Your Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
