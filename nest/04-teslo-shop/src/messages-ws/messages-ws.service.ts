import { Injectable } from '@nestjs/common';
import { ConnectedClient } from './interfaces/connected-client.interface';
import { Socket } from 'socket.io';

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClient = {};

  registerClient(client: Socket): void {
    this.connectedClients[client.id] = client;
  }

  removeClient(clientId: string): void {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }
}
