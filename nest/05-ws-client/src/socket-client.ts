import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new Manager(import.meta.env.VITE_SOCKET_URI, {
    extraHeaders: {
      foo: "foo",
      authentication: token,
    },
  });
  socket?.removeAllListeners();
  socket = manager.socket("/");

  addListeners();
};

const addListeners = () => {
  // socket.on // listen to server
  // socket.emit // emit to server

  const clientsList = document.querySelector<HTMLUListElement>("#clients-ul")!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;
  const messagesList =
    document.querySelector<HTMLUListElement>("#messages-ul")!;
  const serverStatusLabel =
    document.querySelector<HTMLSpanElement>("#server-status")!; // ! will always have value

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

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault(); // avoid form propagation & tab refresh

    if (messageInput.value.trim().length <= 0) return;

    socket.emit("message-from-client", {
      anyKey: "Me!",
      message: messageInput.value,
    });
    messageInput.value = "";
  });

  socket.on(
    "messages-from-server",
    (payload: { fullName: string; message: string }) => {
      const newMessage = `
        <li>
            <strong>${payload.fullName}: </strong>
            <span>${payload.message}</span>
        </li>
      `;
      const li = document.createElement("li");
      li.innerHTML = newMessage;
      messagesList.append(li);
    }
  );
};
