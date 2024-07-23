
const LOCAL_PORT = 8888;

const clientHostName = window.location.hostname;

let backendHostName;

if (clientHostName === 'localhost') {
    backendHostName = 'http://localhost:' + LOCAL_PORT;
}
// else if (clientHostName === 'www.bananagrape.co.kr') {
//     backendHostName = 'https://api.myapi.com';
// }

const API_BASE_URL = backendHostName;

// const AUTH = '/auth'

export const AUTH_URL = API_BASE_URL;