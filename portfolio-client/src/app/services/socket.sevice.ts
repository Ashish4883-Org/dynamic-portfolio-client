import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | undefined;
  private readonly SERVER_URL = environment.base;

  constructor() {}

  connect() {
    this.socket = io(this.SERVER_URL, {
      withCredentials: false, // Already handled by CORS '*'
    });

    this.socket.on('connect', () => {
      console.log(`🟢 Connected to server: ${this.socket?.id}`);
      // 🔥 Test ping immediately after connect
      this.sendPing();

      // Or keep pinging every 5s
      setInterval(() => this.sendPing(), 5000);
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`🔴 Disconnected from server: ${reason}`);
    });

    // Optional: test ping/pong
    this.socket.on('pong', () => {
      console.log('✅ Received pong from server');
    });
  }

  disconnect() {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
  }

  // Optional method to test ping
  sendPing() {
    this.socket?.emit('ping');
  }
}
