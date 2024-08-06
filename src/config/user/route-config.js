import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../../layout/user/RootLayout";
import Home from "../../pages/hotel/Home";
import WelcomePage from "../../pages/user/WelcomePage";
import LoginForm from "../../components/auth/user/login/LoginForm";
import SignUpPage from "../../components/auth/user/signup/SignUpPage";
import HotelPage from "../../pages/hotel/HotelPage";
import AddHotelPage from "../../pages/hotel/AddHotelPage";
import { logoutAction } from "../../pages/user/Logout";
import UserProvider from "../../components/context/UserProvider";
import { userDataLoader, authCheckLoader, getUserToken } from "./auth";
import MyPageMain from "../../components/auth/user/mypage/MyPageMain";
import AddDogMain from "../../components/auth/dog/AddDogMain";
import DogEdit from "../../components/auth/dog/DogEdit";
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
import ReviewPage from "../../pages/shop/review/ReviewPage"; //리뷰페이지
import WriteReviewPage from "../../pages/shop/review/WriteReviewPage"; // 글쓰기 페이지
import EditReviewPage from "../../pages/shop/review/EditReviewPage"; // 수정 페이지
import ReviewDetailPage from "../../pages/shop/review/ReviewDetailPage"; //리뷰 상세
import ErrorPage from "../../pages/user/ErrorPage";

import BoardPostPage from "../../pages/community/BoardPostPage";
import MyBoards from "../../pages/user/MyBoards";
import checkMyInfo from "../../pages/user/MyBoards";
import HotelRecords from "../../pages/user/HotelRecords";
import MyLikeBoards from "../../pages/user/MyLikeBoards";
import MyLikeHotel from "../../pages/user/MyLikeHotel";
import MyLikeSnack from "../../pages/user/MyLikeSnack";
import SnackRecords from "../../pages/user/SnackRecords";
import DetailAboutReservation from "../../components/hotel/DetailAboutReservation";
import ShowCart from "../../pages/shop/ShowCart";

import SeasonalityChart from '../../pages/hotel/SeasonalityChart'



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
    loader: authCheckLoader,
    id: "auth-check-loader",
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
    errorElement: <ErrorPage />,
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
        path: "get-monthly",
        element: <SeasonalityChart />,
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
        path: "cart",
        element: <ShowCart />,
        loader: authCheckLoader,
      },
      {
        path: "add-dog",
        element: <AddDogMain />,
      },
      {
        path: "boards",
        element: <BoardPage />,
        // loader: authCheckLoader,
      },
      {
        path: "board/:id",
        element: <BoardDetailPage />,
        // loader: authCheckLoader,
      },
      {
        path: "board/create", // 게시글 상세 페이지 경로 추가
        element: <BoardPostPage />,
        loader: authCheckLoader, // 로그인 정보를 확인하는 loader 추가
      },
      {
        path: "forgot-info",
        element: <ForgotSection />,
      },
      {
        path: "review-page",
        element: <ReviewPage />,
        loader: authCheckLoader, // 리뷰페이지 추가
      },
      {
        path: "review-page/write-review",
        element: <WriteReviewPage />,
        loader: authCheckLoader, // 글쓰기 페이지 추가
      },
      {
        path: "/review-page/review-detail/:reviewId",
        element: <ReviewDetailPage />,
        loader: authCheckLoader, // 상세 페이지 추가
      },
      {
        //path: 'review-page/edit-review/:id',
        //path: 'review-page/edit-review/:reviewId', // EditReviewPage 경로 츄가
        path: "/review-page/edit-review/:reviewId",
        element: <EditReviewPage />,
        loader: authCheckLoader, // 수정 페이지 추가
      },
      {
        path: "/my-boards",
        element: <MyBoards/>
      },
      {
        path: "/hotel-record",
        element: <HotelRecords/>
      },
      {
        path: "/like-boards",
        element: <MyLikeBoards/>
      },
      {
        path: "/like-hotel",
        element: <MyLikeHotel/>
      },
      {
        path: "/like-snack",
        element: <MyLikeSnack/>
      },
      {
        path: "/snack-record",
        element: <SnackRecords/>
      },
      {
        path: "/detail-reservation",
        element: <DetailAboutReservation/>
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
