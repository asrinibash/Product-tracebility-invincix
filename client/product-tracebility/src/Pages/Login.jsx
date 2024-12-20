import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ChevronRight, BarChart3, Truck, Factory, BoxesIcon } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.svg";
import bgImage from "../assets/bgImage.jpg"

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hardcoded credentials
  const hardcodedEmail = "admin@delmonte.com";
  const hardcodedPassword = "123456";

  const handleLogin = () => {
    setLoading(true);
    setError("");

    // Simulate an async operation (e.g., API call)
    setTimeout(() => {
      if (email === hardcodedEmail && password === hardcodedPassword) {
        const token = "mock-token-123456789";
        localStorage.setItem("authToken", token);
        
        toast.success("Authorisation success!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setTimeout(() => {
          navigate('farmer');
        }, 2000);
      } else {
        setError("Invalid email or password");
        toast.error("Invalid email or password!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full relative bg-cover bg-center bg-no-repeat"
    style={{ 
      backgroundImage: `url(${bgImage})`
    }}>
    {/* Logo Container - Absolute positioned to top-left */}
    <div className="absolute top-10 left-10">
      <img 
        src={logo} 
        alt="Invincix Logo" 
        className="h-6 w-auto"
      />
    </div>
    <div className="min-h-screen w-full p-4 flex items-center justify-center bg-login bg-cover bg-center bg-no-repeat">

       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
     <Card className="w-full max-w-4xl overflow-hidden shadow-2xl ">
        <div className="flex flex-col md:flex-row ">
          {/* Left Section */}
          <div className="w-full md:w-1/2 p-8 bg-gradient-to-r from-cyan-100 to-blue-50">
            <div className="flex items-center space-x-2 mb-8">
              <BoxesIcon className="h-8 w-8 text-blue-600" />
              <div>
              <h3 className="text-xl font-medium">
                Blockchain based Supply Chain Portal
              </h3>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome Back !</h2>
                <p className="text-muted-foreground">
                  Access your supply chain management dashboard
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.name@delmonte.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm">Keep me signed in</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="#ffffff" size={20} />
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Need access? Contact your
                <a href="#" className="text-blue-600 hover:underline mx-1">
                  system administrator
                </a>
                or
                <a href="#" className="text-blue-600 hover:underline mx-1">
                  Invincix support
                </a>
              </div>
            </div>
          </div>

          {/* Right Section - Features & Info */}
          <div className="w-full md:w-1/2  p-8 text-white relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-700">
            <div className="relative z-10">
              
              <h4 className="text-2xl font-bold mb-2">
               Supply Chain Excellence
              </h4>
              <p className="mb-6 text-sm">
                Streamline Del Monte's global supply chain operations with
                Invincix's integrated management system.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Real-time Analytics</p>
                    <p className="text-sm text-white/80">
                      Track KPIs and performance metrics
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Logistics Management</p>
                    <p className="text-sm text-white/80">
                      End-to-end shipment tracking
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Factory className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Inventory Control</p>
                    <p className="text-sm text-white/80">
                      Optimize stock levels across facilities
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
          </div>
        </div>
      </Card>
    </div>
    </div>
  );
};

export default Login;