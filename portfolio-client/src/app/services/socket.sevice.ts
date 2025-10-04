import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

export interface UserStatus {
  mstrid: string;
  status: 'online' | 'offline';
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  // private socket: Socket | undefined;
  private readonly SERVER_URL = environment.base;

  private socket!: Socket;
  private heartbeatSub?: Subscription;

  // Observable for user status updates
  public onlineUsers$ = new BehaviorSubject<string[]>([]); // Array of online mstrids

  constructor() {}

  //**********Testing socket */
  // connect() {
  //   this.socket = io(this.SERVER_URL, {
  //     withCredentials: false, // Already handled by CORS '*'
  //   });

  //   this.socket.on('connect', () => {
  //     console.log(`🟢 Connected to server: ${this.socket?.id}`);
  //     // 🔥 Test ping immediately after connect
  //     this.sendPing();

  //     // Or keep pinging every 5s
  //     setInterval(() => this.sendPing(), 5000);
  //   });

  //   this.socket.on('disconnect', (reason) => {
  //     console.log(`🔴 Disconnected from server: ${reason}`);
  //   });

  //   // Optional: test ping/pong
  //   this.socket.on('pong', () => {
  //     console.log('✅ Received pong from server');
  //   });
  // }

  // disconnect() {
  //   if (this.socket?.connected) {
  //     this.socket.disconnect();
  //   }
  // }

  // // Optional method to test ping
  // sendPing() {
  //   this.socket?.emit('ping');
  // }
  //**********Testing socket end */

  /** Connect socket and start heartbeat */
  connect(mstrid: string) {
    this.socket = io(environment.base, { withCredentials: false });

    this.socket.on('connect', () => {
      console.log(`🟢 Connected: ${this.socket.id}`);

      // Notify backend that user is online
      this.socket.emit('user:online', { mstrid });

      // Heartbeat to refresh Redis TTL every 10s
      this.heartbeatSub = interval(10000).subscribe(() => {
        this.socket.emit('user:ping', { mstrid });
      });
    });

    // Listen for user status updates
     this.socket.on('user:online-list', (onlineUsers: string[]) => {
      this.onlineUsers$.next(onlineUsers);
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`🔴 Disconnected: ${reason}`);
      this.stopHeartbeat();
    });
  }

  /** Disconnect socket and stop heartbeat */
  disconnect() {
    this.stopHeartbeat();
    this.socket?.disconnect();
  }

  /** Stop heartbeat interval */
  private stopHeartbeat() {
    if (this.heartbeatSub) {
      this.heartbeatSub.unsubscribe();
      this.heartbeatSub = undefined;
    }
  }
}
