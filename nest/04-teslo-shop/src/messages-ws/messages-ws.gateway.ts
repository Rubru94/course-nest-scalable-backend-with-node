import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';

/**
 *  @info Websocket concepts
 *
 *  - Namespace: is a communication channel that allows you to split the logic of your application over a single shared connection. If not specified points to root ('/').
 */
@WebSocketGateway({ cors: true /* , namespace: '/' */ })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    // console.log(`Client connected: ${client.id}`);
    this.messagesWsService.registerClient(client);
    this.emitClientsUpdated();
  }

  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
    this.messagesWsService.removeClient(client.id);
    this.emitClientsUpdated();
  }

  private emitClientsUpdated(): void {
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }
}
