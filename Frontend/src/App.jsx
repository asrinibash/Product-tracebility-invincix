import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import DashboardLayout from "./DashboardLayout";
import Farmer from "./Pages/Farmer";
import Manufacturer from "./Pages/Manufacturer";
import Distributer from "./Pages/Distributer";
import Retailer from "./Pages/Retailer";
import Consumer from "./Pages/Consumer";
import { useContext } from "react";
import { ThemeContext } from "./Context/ThemeContext";
const App = () => {
  // Simplified auth check - replace with your actual auth logic
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const { darkMode } = useContext(ThemeContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }
        >
          <Route index element={<Farmer />} />
          <Route path="Manufacturer" element={<Manufacturer />} />
          <Route path="Distributer" element={<Distributer />} />
          <Route path="Retailer" element={<Retailer />} />
          <Route path="Consumer" element={<Consumer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
