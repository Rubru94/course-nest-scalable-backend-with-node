import { connectToServer } from "./socket-client";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h2>Websocket - Client</h2>

    <div>
      <input id="jwt-token" placeholder="Json Web Token" />
      <button id="connect-btn">Connect</button>
    </div>
    
    <div>
      <span id="server-status"></span>
    </div>
  
    <div class="clients">
      <h3>Users:</h3>
      <ul id="clients-ul"></ul>
    </div>

    <form id="message-form">
      <input placeholder="message" id="message-input"/>
      <br/><br/>
      <button type="submit">Send</button> 
    </form>

    <div class="messages">
      <h3>Messages:</h3>
      <ul id="messages-ul"></ul>
    </div>
  
  </div>
`;

const jwtInput = document.querySelector<HTMLInputElement>("#jwt-token")!;
const connectButton =
  document.querySelector<HTMLButtonElement>("#connect-btn")!;

connectButton.addEventListener("click", () => {
  if (jwtInput.value.trim().length <= 0) return alert("Enter a valid JWT");

  connectToServer(jwtInput.value.trim());
});
