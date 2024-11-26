import { Manager, Socket } from "socket.io-client";

export const connectToServer = () => {
  const manager = new Manager(import.meta.env.VITE_SOCKET_URI);
  const socket = manager.socket("/");
  console.log(socket);

  addListeners(socket);
};

const addListeners = (socket: Socket) => {
  // socket.on // listen to server
  // socket.emit // emit to server

  const serverStatusLabel = document.querySelector("#server-status")!; // ! will always have value
  const clientsList = document.querySelector("#clients-ul")!; // ! will always have value

  socket.on("connect", () => {
    serverStatusLabel.innerHTML = "connected";
  });

  socket.on("disconnect", () => {
    serverStatusLabel.innerHTML = "disconnected";
  });

  socket.on("clients-updated", (clients: string[]) => {
    const ids = clients
      .map((clientId: string) => `<li>${clientId}</li>`)
      .join("");
    clientsList.innerHTML = ids;
  });
};
