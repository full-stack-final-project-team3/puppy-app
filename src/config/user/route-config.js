import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../../layout/user/RootLayout";
import Home from "../../pages/hotel/Home";
import WelcomePage from "../../pages/user/WelcomePage";
import LoginForm from "../../components/auth/user/login/LoginForm";
import SignUpPage from "../../components/auth/user/signup/SignUpPage";
import HotelPage from "../../pages/hotel/HotelPage"; // 새로 추가된 HotelPage
import AddHotelPage from "../../pages/hotel/AddHotelPage"; // 새로 추가된 AddHotelPage
import { logoutAction } from "../../pages/user/Logout";
import UserProvider from "../../components/context/UserProvider";
import { userDataLoader, authCheckLoader, getUserToken } from "./auth";
import MyPageMain from "../../components/auth/user/mypage/MyPageMain";
import AddDogMain from "../../components/auth/dog/AddDogMain";
import BoardPage from "../../pages/community/BoardPage";
import BoardDetailPage from "../../pages/community/BoardDetailPage";
import AddRoomPage from "../../pages/hotel/AddRoomPage";
import AddReviewPage from "../../pages/hotel/AddReviewPage";
import ModifyHotelPage from "../../pages/hotel/ModifyHotelPage";
import ModifyRoomPage from "../../pages/hotel/ModifyRoomPage";
import ForgotSection from "../../components/auth/user/forgot-info/ForgotSection";
import ShopMain from "../../pages/shop/ShopMain";
import TreatsListForDog from "../../pages/shop/TreatsListForDog";
import AddTreats from "../../pages/shop/AddTreats";
import ErrorPage from "../../pages/user/ErrorPage"; // ErrorPage import 추가

const homeRouter = [
  {
    index: true,
    element: <WelcomePage />,
    loader: userDataLoader,
    id: "user-data3",
  },
  {
    path: "login",
    element: <LoginForm />,
  },
  {
    path: "signup",
    element: <SignUpPage />,
  },
  {
    path: "mypage",
    element: <MyPageMain />,
    loader: userDataLoader,
    id: "user-data2",
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <UserProvider>
          <RootLayout />
        </UserProvider>
    ),
    loader: userDataLoader,
    id: "user-data",
    errorElement: <ErrorPage />, // 잘못된 URL에 대한 에러 페이지 설정
    children: [
      {
        path: "",
        element: <Home />,
        children: homeRouter,
      },
      {
        path: "logout",
        action: logoutAction,
      },
      {
        path: "hotel",
        element: <HotelPage />,
        loader: authCheckLoader,
      },
      {
        path: "add-hotel",
        element: <AddHotelPage />,
        loader: authCheckLoader,
      },
      {
        path: "add-room/:hotelId",
        element: <AddRoomPage />,
        loader: authCheckLoader,
      },
      {
        path: "modify-hotel/:hotelId",
        element: <ModifyHotelPage />,
        loader: authCheckLoader,
      },
      {
        path: "add-review/:hotelId",
        element: <AddReviewPage />,
        loader: authCheckLoader,
      },
      {
        path: "modify-room/:roomId",
        element: <ModifyRoomPage />,
        loader: authCheckLoader,
      },
      {
        path: "treats",
        element: <ShopMain />,
      },
      {
        path: "add-treats",
        element: <AddTreats />,
        loader: getUserToken,
        id: "getToken",
      },
      {
        path: "list/:dogId",
        element: <TreatsListForDog />,
        loader: authCheckLoader,
      },
      {
        path: "add-dog",
        element: <AddDogMain />,
      },
      {
        path: "boards",
        element: <BoardPage />,
        loader: authCheckLoader,
      },
      {
        path: "board/:id",
        element: <BoardDetailPage />,
        loader: authCheckLoader,
      },
      {
        path: "forgot-info",
        element: <ForgotSection />,
      },
    ],
  },
  {
    path: "*", // 이상한 경로 다 여기로 보냄
    element: <ErrorPage />, //
  },
]);