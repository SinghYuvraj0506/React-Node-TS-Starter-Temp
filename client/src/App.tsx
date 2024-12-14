import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import ProtectRoutes from "./components/global/ProtectRoutes";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const router = (isAuthenticated: boolean, loading: boolean) => {
  return createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectRoutes
          navigateTo="/dashboard"
          allowed={!isAuthenticated}
          loading={loading}
        />
      ),
      children: [
        {
          path: "",
          element: <Landing />,
        },
      ],
    },
    {
      path: "/auth",
      element: (
        <ProtectRoutes
          navigateTo="/dashboard"
          allowed={!isAuthenticated}
          loading={loading}
        />
      ),
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },
  ]);
};

function App() {

  return (
    <div className="w-full h-full">
      <RouterProvider
        // router={router(isAuthenticated || false, loading || false)}
        router={router(false, false)}
      />
      <Toaster />
    </div>
  );
}

export default App;
