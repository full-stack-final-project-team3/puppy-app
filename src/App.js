import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./config/user/route-config";
import { AuthProvider } from "./components/auth/AuthProvider";

const App = () => {
  return (

    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
