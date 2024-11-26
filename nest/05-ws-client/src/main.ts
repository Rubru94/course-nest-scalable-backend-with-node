import { connectToServer } from "./socket-client";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Websocket - Client</h1>

    <span id="server-status"></span>
  
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

connectToServer();
