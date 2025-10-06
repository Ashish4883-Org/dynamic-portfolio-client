import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { AllUserStatus } from '../../models/userStatus.model';
import { User } from '../../models/user.model';
import { Store } from '@ngrx/store';
import { selectAllUsers } from '../../store/user/user.selectors';
import { loadUsers } from '../../store/user/user.actions';
import { SocketService } from '../../services/socket.sevice';

@Component({
  selector: 'app-all-users',
  imports: [CommonModule, FormsModule, NzTableModule],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss',
})
export class AllUsersComponent {
  allUsers$: Observable<User[]>;
  users: AllUserStatus[] = []; // store online status

  constructor(private store: Store) {
    this.allUsers$ = this.store.select(selectAllUsers);

    this.store.dispatch(loadUsers());

    SocketService.onlineUsers$.subscribe((onlineMstrIds) => {
      this.allUsers$.subscribe((allUsers) => {
        this.users = allUsers.map((user) => ({
          mstrid: user.mstrid,
          name: user.name,
          role: user.role,
          online: onlineMstrIds.includes(user.mstrid),
        }));
      });
    });
  }
}
