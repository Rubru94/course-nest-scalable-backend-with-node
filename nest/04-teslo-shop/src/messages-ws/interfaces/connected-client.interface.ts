import { Socket } from 'socket.io';

export interface ConnectedClient {
  [id: string]: Socket;
}
