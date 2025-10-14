import { Component, inject, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { AllUserStatus } from '../../models/userStatus.model';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import {
  selectAllUsers,
  selectCurrentUser,
} from '../../store/user/user.selectors';
import { loadUsers } from '../../store/user/user.actions';
import { SocketService } from '../../services/socket.sevice';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ApiService } from '../../services/api.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';

@Component({
  selector: 'app-all-users',
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
    ChatModalComponent,
  ],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss',
})
export class AllUsersComponent {
  allUsers$: Observable<User[]>;
  user$: Observable<any>;
  users: AllUserStatus[] = []; // store online status
  selectedUser: any = null;
  isChatModalVisible = false;
  messages: any[] = [];
  newMessage: string = '';

  private socketService = inject(SocketService);
  private apiService = inject(ApiService);

  constructor(private store: Store) {
    this.allUsers$ = this.store.select(selectAllUsers);
    this.user$ = this.store.select(selectCurrentUser);

    this.store.dispatch(loadUsers());

    SocketService.onlineUsers$.subscribe((onlineMstrIds) => {
      this.allUsers$.subscribe((allUsers) => {
        this.users = allUsers
          .map((user) => ({
            mstrid: user.mstrid,
            name: user.name,
            role: user.role,
            online: onlineMstrIds.includes(user.mstrid),
          }))
          .filter((user) => user.mstrid !== this.getLoggedInUserId());
      });
    });

    // ✅ Register global message listener ONCE
    this.socketService.onMessageReceived((message: any) => {
      if (
        this.selectedUser &&
        (message.sender === this.selectedUser.mstrid ||
          message.receiver === this.selectedUser.mstrid)
      ) {
        this.messages.push(message);
      }
    });
  }

  // Function to open the chat modal and start the chat session
  startChat(user: any) {
    console.log('Starting chat with:', user);
    this.loadChatHistory(user.mstrid);

    // Set the selected user
    this.selectedUser = user;

    // Show the chat modal
    this.isChatModalVisible = true;

    // Connect the socket for this chat
    this.socketService.connect(this.getLoggedInUserId());

    // Listen for incoming messages
    // this.socketService.onMessageReceived((message: any) => {
    //   this.messages.push(message);
    // });

    // this.socketService.onMessageReceived((message: any) => {
    //   if (
    //     message.sender === this.selectedUser.mstrid ||
    //     message.receiver === this.selectedUser.mstrid
    //   ) {
    //     this.messages.push(message);
    //   }
    // });
  }

  // Send a message to the selected user
  // sendMessage() {
  //   if (this.newMessage.trim()) {
  //     const chatMessage = {
  //       sender: this.getLoggedInUserId(),
  //       receiver: this.selectedUser.mstrid,
  //       message: this.newMessage.trim(),
  //       timestamp: new Date(),
  //     };

  //     // Emit the message via socket
  //     // this.socketService.sendMessage(chatMessage);

  //     // Add the sent message to the message list (for immediate UI update)
  //     this.messages.push(chatMessage);
  //     this.newMessage = ''; // Clear input field
  //   }
  // }

  sendMessage(message?: string) {
    const text =
      message?.trim() ?? (this.newMessage ? this.newMessage.trim() : '');
    if (text) {
      const chatMessage = {
        sender: this.getLoggedInUserId(),
        receiver: this.selectedUser.mstrid,
        message: text,
        timestamp: new Date(), // Optional, server can also assign
      };

      // ✅ Emit to backend
      this.socketService.sendMessage(chatMessage);

      // Optionally keep this for immediate feedback
      this.messages.push(chatMessage);
      this.newMessage = '';
    }
  }

  // Close the chat modal
  closeChatModal() {
    this.isChatModalVisible = false;
    this.selectedUser = null;
    this.messages = []; // Optionally reset messages on modal close
  }

  loadChatHistory(selectedUserMstrId: string) {
    const loggedInUserId = this.getLoggedInUserId();

    this.apiService
      .get(`chat/${loggedInUserId}/${selectedUserMstrId}`, {
        responseType: 'json',
      })
      .subscribe(
        (response: any) => {
          this.messages = response;
        },
        (error) => {
          console.error('Failed to fetch chat history:', error);
        }
      );
  }

  private getLoggedInUserId(): string {
    let loggedInUserId: string = '';

    this.user$.subscribe((user) => {
      if (user) {
        loggedInUserId = user.mstrid;
      }
    });

    return loggedInUserId;
  }
}
