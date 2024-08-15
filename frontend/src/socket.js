import { io } from "socket.io-client";

const getSocketURL = () => {
  return "http://localhost:3030";
};

const URL = getSocketURL();

const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1,
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log(`Reconnected on attempt: ${attemptNumber}`);
});

socket.on("reconnect_error", (error) => {
  console.error("Socket reconnection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log(`Disconnected: ${reason}`);
  if (reason === "io server disconnect") {
    socket.connect();
  }
});

export { socket };
