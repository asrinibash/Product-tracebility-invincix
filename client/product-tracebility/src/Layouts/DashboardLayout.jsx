import React, { useState } from "react";
import {
  BoxesIcon,
  LayoutDashboard,
  Truck,
  Warehouse,
  Package,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";
import Header from "../components/Header";
import logo from "../assets/logo.svg";

// Sidebar Component
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Farmer", path: "farmer" }, // removed leading slash
    { icon: Warehouse, label: "Manufacturer", path: "manufacturer" }, // removed leading slash
    { icon: Truck, label: "Distributer", path: "distributer" }, // removed leading slash
    { icon: Package, label: "Retailer", path: "retailer" }, // removed leading slash
    { icon: Users, label: "Consumers", path: "consumer" }, // removed leading slash
    { icon: Settings, label: "Settings", path: "settings" }, // removed leading slash
    { icon: HelpCircle, label: "Help & Support", path: "help" }, // removed leading slash
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full bg-white border-r transition-all duration-300 
      ${isSidebarOpen ? "w-68" : "w-20"} lg:relative`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div
          className={`flex items-center p-5 border-b ${
            !isSidebarOpen && "justify-center"
          }`}
        >
          <BoxesIcon className="h-8 w-8 text-blue-600" />
          {isSidebarOpen && (
            <div className="ml-2 w-36">
              <h4 className="text-sm font-medium">Blockchain based Supply Chain Portal</h4>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors
                      ${
                        location.pathname === item.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    {isSidebarOpen && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="h-14 border-t l-4 flex items-center justify-start relative pl-8">
          {/* Logo Section */}
          <div className="flext">
            <img src={logo} alt="Invincix Logo" className="h-6 w-auto" />
          </div>

        </div>
      </div>
    </aside>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-white border-t py-4 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © 2024 Invincix. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-blue-600"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-blue-600"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-blue-600"
          >
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};

// Layout Component
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-2">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
