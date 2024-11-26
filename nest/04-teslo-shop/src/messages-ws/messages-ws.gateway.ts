import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

/**
 *  @info Websocket concepts
 *
 *  - Namespace: is a communication channel that allows you to split the logic of your application over a single shared connection. If not specified points to root ('/').
 */
@WebSocketGateway({ cors: true /* , namespace: '/' */ })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    // console.log(`Client connected: ${client.id}`);
    this.messagesWsService.registerClient(client);

    console.log(
      `Connected clients: ${this.messagesWsService.getConnectedClients()}`,
    );
  }

  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
    this.messagesWsService.removeClient(client.id);

    console.log(
      `Connected clients: ${this.messagesWsService.getConnectedClients()}`,
    );
  }
}
