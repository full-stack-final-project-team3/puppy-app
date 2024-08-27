const LOCAL_PORT = 8888; // 백엔드 로컬 서버 포트번호
const LOCAL_FRONT = 3000;

const clientHostName = window.location.hostname;

let backendHostName;
let frontendHostName;

if (clientHostName === "localhost") {
  backendHostName = "http://localhost:" + LOCAL_PORT;
  frontendHostName = "http://localhost:" + LOCAL_FRONT;
} else {
  backendHostName = 'http://43.203.105.27:8888';
  frontendHostName = "http://doggle.kr";
}

const API_BASE_URL = backendHostName;
const APP_BASE_URL = frontendHostName;

const EVENT = "/events";
const HOTEL = "/hotel";
const ROOM = "/room";
const UPLOAD = "/hotel/upload";
const DOG = "/dog";
const BOARD = "/board";
const TREATS = "/treats";
const BUNDLE = "/bundle";
const CART = "/cart";
const SHOP = "/shop";
const notice = "/notice";
const admin = "/admin";
const REVIEW = "/shop/reviews";
const likes = "/likes";
const RESERVATION = "/api/reservation";
const HOTEL_REVIEW = "/api/reviews"
// const AUTH = '/auth'

export const BASE_URL = API_BASE_URL;
export const EVENT_URL = API_BASE_URL + EVENT;
export const HOTEL_URL = API_BASE_URL + HOTEL;
export const ROOM_URL = API_BASE_URL + ROOM;
export const UPLOAD_URL = API_BASE_URL + UPLOAD;
export const AUTH_URL = API_BASE_URL;
export const DOG_URL = API_BASE_URL + DOG;
export const BOARD_URL = API_BASE_URL + BOARD;
export const TREATS_URL = API_BASE_URL + TREATS;
export const BUNDLE_URL = API_BASE_URL + BUNDLE;
export const CART_URL = API_BASE_URL + CART;
export const SHOP_URL = API_BASE_URL + SHOP;
export const NOTICE_URL = API_BASE_URL + notice;
export const ADMIN_URL = API_BASE_URL + admin;
export const REVIEW_URL = API_BASE_URL + REVIEW;
export const LIKE_URL = API_BASE_URL + likes;
export const RESERVATION_URL = API_BASE_URL + RESERVATION;
export const HOTEL_REVIEW_URL = API_BASE_URL + HOTEL_REVIEW;
export const FRONT = APP_BASE_URL;

export const RESOURCES_URL = API_BASE_URL;
