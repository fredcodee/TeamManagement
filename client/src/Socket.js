// socket.js
import io from 'socket.io-client';

let baseURL = "";
if (import.meta.env.VITE_MODE === "Production") {
    baseURL = import.meta.env.VITE_API_BASE_URL_PROD;
} else if (import.meta.env.VITE_MODE === "Development") {
    baseURL = import.meta.env.VITE_API_BASE_URL_DEV;
}

const socket = io(baseURL);

export default socket;

