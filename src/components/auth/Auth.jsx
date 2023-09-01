import React from "react";
import Login from "./login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
// This is Auth component
function Auth() {
  return (
    <div>
      {/* Define Routes */}
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to={"/auth/login"} />} />
      </Routes>
    </div>
  );
}

export default Auth;
