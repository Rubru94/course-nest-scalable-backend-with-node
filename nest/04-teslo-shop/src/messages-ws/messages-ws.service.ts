import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ConnectedClient } from './interfaces/connected-client.interface';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class MessagesWsService {
  constructor(private readonly authService: AuthService) {}

  private connectedClients: ConnectedClient = {};

  async registerClient(client: Socket, userId: string): Promise<void> {
    const user = await this.authService.getUserById(userId);

    this.checkUserConnection(user);
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

  private checkUserConnection(user: User) {
    for (const clientId of this.getConnectedClientsKeys()) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
