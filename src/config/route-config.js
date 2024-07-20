import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import Home from '../pages/Home';
import WelcomePage from '../pages/WelcomePage';
import LoginForm from '../components/auth/LoginForm';
import SignUpPage from "../components/auth/SignUpPage";

const homeRouter = [
  {
    index: true,
    element: <WelcomePage />,
  },
  {
    path: 'login',
    element: <LoginForm />,
  },
  {
    path: 'signup',
    element: <SignUpPage/>
  }
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Home />,
        children: homeRouter,
      },
    ],
  },
]);