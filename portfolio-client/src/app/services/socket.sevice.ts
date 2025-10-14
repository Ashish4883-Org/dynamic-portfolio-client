import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { ChatMessage } from '../models/chatMessages.model';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  // private socket: Socket | undefined;
  private readonly SERVER_URL = environment.base;

  private socket!: Socket;
  private heartbeatSub?: Subscription;

  // Observable for user status updates
  public static onlineUsers$ = new BehaviorSubject<string[]>([]); // Array of online mstrids
  // public static chatMessages$ = new BehaviorSubject<ChatMessage[]>([]); // Array of chat messages

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

      // ✅ Join your private room (REQUIRED for receiving messages)
      this.socket.emit('chat:join', mstrid);

      // Notify backend that user is online
      this.socket.emit('user:online', { mstrid });

      // Heartbeat to refresh Redis TTL every 10s
      this.heartbeatSub = interval(10000).subscribe(() => {
        this.socket.emit('user:ping', { mstrid });
      });
    });

    // Listen for user status updates
    this.socket.on('user:online-list', (onlineUsers: string[]) => {
      SocketService.onlineUsers$.next(onlineUsers);
    });

    // Listen for incoming chat messages
    // this.socket.on('chat:message', (message: ChatMessage) => {
    //   console.log('📩 New chat message received:', message);
    //   const currentMessages = SocketService.chatMessages$.getValue();
    //   SocketService.chatMessages$.next([...currentMessages, message]);
    // });

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

  onMessageReceived(callback: (message: any) => void) {
    if (!this.socket) return;

    this.socket.on('chat:message:received', (message: any) => {
      callback(message);
    });
  }

  onMessageSent(callback: (message: any) => void) {
    if (!this.socket) return;

    this.socket.on('chat:message:sent', (message: any) => {
      callback(message);
    });
  }

  sendMessage(message: {
    sender: string;
    receiver: string;
    message: string;
    timestamp?: Date;
  }) {
    if (!this.socket || !this.socket.connected) {
      console.warn('⚠️ Socket not connected. Message not sent.');
      return;
    }

    this.socket.emit('chat:message', message);
  }
}
