import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home";
import WelcomePage from "../pages/WelcomePage";
import SignUpPage from "../pages/SignUpPage";



const homeRouter = [
  {
    index: true,
    element: <WelcomePage/>,
  },
  {
    path: 'sign-up',
    element: <SignUpPage />
  },
]

export const router= createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>,
    children: [
      {
        path: "/",
        element: <Home/>,
        children: homeRouter,
      },
    ]
  }
]);

