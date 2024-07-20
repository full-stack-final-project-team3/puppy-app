import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import Home from '../pages/Home';
import WelcomePage from '../pages/WelcomePage';
import LoginForm, { loginAction } from '../components/auth/LoginForm';
import SignUpPage from '../components/auth/SignUpPage';
import { userDataLoader } from './auth';

const homeRouter = [
  {
    index: true,
    element: <WelcomePage />,
  },
  {
    path: 'login',
    element: <LoginForm />,
    action: loginAction,
  },
  {
    path: 'signup',
    element: <SignUpPage />
  }
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    loader: userDataLoader,
    id: 'user-data',
    children: [
      {
        path: '',
        element: <Home />,
        children: homeRouter,
      },
    ],
  },
]);