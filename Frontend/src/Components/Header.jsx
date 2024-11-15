import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../Context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./Ui/DropdownMenu";
import {
  FiSun,
  FiMoon,
  FiUser,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Static farmer data
  const farmerData = {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    businessName: "Green Farms"
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    navigate("/admin/secure/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            
          </div>

          <span className="text-lg font-bold text-primary">
           Product Tracebility
          </span>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <span className="text-sm font-medium hidden md:inline-block">
                {farmerData.name}
              </span>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-full inline-flex items-center justify-center border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <FiUser />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {farmerData.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {farmerData.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/admin/secure/profile")}
                >
                  <FiUser className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                  <FiSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/help")}>
                  <FiHelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogoutClick}
                  className="text-red-600"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full inline-flex items-center justify-center border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
