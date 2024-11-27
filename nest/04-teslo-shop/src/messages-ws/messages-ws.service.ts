import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ConnectedClient } from './interfaces/connected-client.interface';

@Injectable()
export class MessagesWsService {
  constructor(private readonly authService: AuthService) {}

  private connectedClients: ConnectedClient = {};

  async registerClient(client: Socket, userId: string): Promise<void> {
    const user = await this.authService.getUserById(userId);
    this.connectedClients[client.id] = { socket: client, user };
  }

  removeClient(clientId: string): void {
    delete this.connectedClients[clientId];
  }

  getConnectedClientsKeys(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string): string {
    return this.connectedClients[socketId].user.fullName;
  }
}
