import React, { useEffect } from "react";
import TopBar from "./pages/TopBar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Products from "./pages/Products";

function Panel() {
  const navigate = useNavigate();
  /**
   * check if token is saved on session storage that means user login so display the panel
   * otherwise move user to login page
   */
  useEffect(() => {
    const token = sessionStorage.getItem("user_token");
    if (token === null) {
      navigate("/auth/login");
    }
  }, []);
  return (
    <div>
      <TopBar />
      <div style={{ marginTop: "4.9em" }}>
        <Routes>
          <Route path="/home" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
}

export default Panel;
