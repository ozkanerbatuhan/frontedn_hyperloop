import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://192.168.1.75:3030";

export const socket = io(URL, {
    transports: ["websocket"],
    autoConnect: true,
});
