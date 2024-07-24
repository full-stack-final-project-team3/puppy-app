
const LOCAL_PORT = 8888; // 백엔드 로컬 서버 포트번호


const clientHostName = window.location.hostname;

let backendHostName;

if (clientHostName === 'localhost') {
  backendHostName = 'http://localhost:' + LOCAL_PORT;
}
// } else if (clientHostName === 'www.bananagrape.co.kr') {
//   backendHostName = 'https://api.myapi.com';
// }

const API_BASE_URL = backendHostName;

const EVENT = '/events';
const AUTH = '/auth';
const HOTEL = '/hotel';
const ROOM = '/room';
const UPLOAD = '/hotel/upload';
// const AUTH = '/auth'

export const EVENT_URL = API_BASE_URL + EVENT;
export const HOTEL_URL = API_BASE_URL + HOTEL;
export const ROOM_URL = API_BASE_URL + ROOM;
export const UPLOAD_URL = API_BASE_URL + UPLOAD;
export const AUTH_URL = API_BASE_URL;