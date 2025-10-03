import { Component, inject } from '@angular/core';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser } from '../../store/user/user.selectors';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ApiService } from '../../services/api.service';

interface UserStatus {
  mstrid: string;
  name: string;
  role: string;
  online: boolean;
}

@Component({
  selector: 'app-portfolio',
  imports: [NzSplitterModule, NzButtonModule, CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})

export class PortfolioComponent {
  user$: Observable<any>;
  openPortfolioForm: boolean = false;
  users: UserStatus[] = []; // store online status

  private api = inject(ApiService);

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.getActiveUsers();
  }
  createPortfolioForm() {
    // this.openPortfolioForm = true;
  }

  getActiveUsers() {
    this.api.get('users/onlineStatus').subscribe({
      next: (res: any) => {
        this.users = res;
      },
      error: (err) => {
        console.error('Failed to fetch online status', err);
      },
    });
  }
}
