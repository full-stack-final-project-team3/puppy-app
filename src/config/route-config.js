import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import Home from '../pages/Home';
import WelcomePage from '../pages/WelcomePage';
import LoginForm, { loginAction } from '../components/auth/LoginForm';
import SignUpPage from '../components/auth/SignUpPage';
import HotelPage from '../pages/HotelPage'; // 새로 추가된 HotelPage
import AddHotelPage from '../pages/AddHotelPage'; // 새로 추가된 AddHotelPage
import { userDataLoader, authCheckLoader } from './auth';
import { logoutAction } from '../pages/Logout';

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
      {
        path: 'logout',
        action: logoutAction,
      },
      {
        path: 'hotel',
        element: <HotelPage />,
        loader: authCheckLoader, // 로그인 정보를 확인하는 loader 추가
      },
      {
        path: 'add-hotel',
        element: <AddHotelPage />,
        loader: authCheckLoader, // 로그인 정보를 확인하는 loader 추가
      },
    ],
  },
]);