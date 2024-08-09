const LOCAL_PORT = 8888; // 백엔드 로컬 서버 포트번호

const clientHostName = window.location.hostname;

let backendHostName;

if (clientHostName === "localhost") {
  backendHostName = "http://localhost:" + LOCAL_PORT;
}
// } else if (clientHostName === 'www.bananagrape.co.kr') {
//   backendHostName = 'https://api.myapi.com';
// }

const API_BASE_URL = backendHostName;

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
const admin = "/admin"
// const AUTH = '/auth'

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