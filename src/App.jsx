import { Routes, Route } from "react-router-dom";

import AuthLayout from "./components/layout/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Dashboard from "./pages/Dashboard"; // <--- Import Dashboard

function App() {
  return (
    <Routes>
      {/* Public Homepage Route */}
      <Route path="/" element={<Home />} />

      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Dashboard Route (Dynamic User ID) */}
      <Route path="/db/:userid" element={<Dashboard />} />

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
}

export default App;