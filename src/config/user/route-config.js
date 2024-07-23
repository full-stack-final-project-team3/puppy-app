import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../../layout/user/RootLayout';
import Home from '../../pages/hotel/Home';
import WelcomePage from '../../pages/user/WelcomePage';
import LoginForm from '../../components/auth/user/LoginForm';
import SignUpPage from '../../components/auth/user/SignUpPage';
import HotelPage from '../../pages/hotel/HotelPage'; // 새로 추가된 HotelPage
import AddHotelPage from '../../pages/hotel/AddHotelPage'; // 새로 추가된 AddHotelPage
import { userDataLoader, authCheckLoader } from './auth';
import { logoutAction } from '../../pages/user/Logout';
import ReviewPage from '../../pages/shop/ReviewPage';

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
      {
        path: 'review-page',
        element: <ReviewPage />,
        loader: authCheckLoader, // 리뷰페이지 
      },
    ],
  },
]);