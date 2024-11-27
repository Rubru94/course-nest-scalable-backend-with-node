import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

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
    // console.log({ extraHeaders: client.handshake.headers });
    const token = client.handshake.headers.authentication as string;
    console.log({ token });
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

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    /**
     * This way only issuing to the client itself, not to everyone.
     */
    /* client.emit('messages-from-server', {
      fullName: "It's me!",
      message: payload.message || 'No message...',
    }); */

    /**
     * This way it is issued to everyone except the client who emites changes.
     */
    /* client.broadcast.emit('messages-from-server', payload); */

    /**
     * This way it is issued to everyone.
     */
    this.wss.emit('messages-from-server', payload);
  }
}
