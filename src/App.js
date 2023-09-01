import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./components/auth/Auth";
import { Suspense, createContext, useState } from "react";
import Panel from "./components/panel/Panel";
// Create a context
export const CartContext = createContext();
function App() {
  // State for cartArr
  const [cartArr, setCartArr] = useState([]);
  return (
    <div>
      <CartContext.Provider value={{ cartArr, setCartArr }}>
        <Routes>
          <Route
            path="/auth/*"
            element={
              <Suspense fallback={<></>}>
                <Auth />
              </Suspense>
            }
          ></Route>
          <Route path="*" element={<Navigate to={"/auth/login"} />} />
          <Route
            path="/panel/*"
            element={
              <Suspense fallback={<></>}>
                <Panel />
              </Suspense>
            }
          ></Route>
        </Routes>
      </CartContext.Provider>
    </div>
  );
}

export default App;
