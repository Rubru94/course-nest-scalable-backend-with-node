import { Manager } from "socket.io-client";

export const connectToServer = () => {
  const manager = new Manager(import.meta.env.VITE_SOCKET_URI);
  const socket = manager.socket("/");
  console.log({ socket });
};
