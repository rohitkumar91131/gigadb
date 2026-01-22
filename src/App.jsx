import { Routes, Route } from "react-router-dom";

import AuthLayout from "./components/layout/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Dashboard from "./pages/Dashboard"; 
import { Toaster } from "sonner";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ApiPageWrapper from "./pages/api/ApiPageWrapper";
import Docs from "./pages/Docs/Docs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path= "/dashboard" element={<Dashboard />} />
      <Route path= "/api-keys" element = { <ApiPageWrapper/>} />
      <Route path = "/docs" element = { <Docs />} />

      <Route path="/privacy" element={<PrivacyPolicy />} />

      <Route path="/db/:userid" element={<Dashboard />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>

      <Route path="/verify-email" element={<VerifyEmailPage />} />
    </Routes>
  );
}

export default App;