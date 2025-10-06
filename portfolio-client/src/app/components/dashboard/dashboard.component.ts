import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Observable } from 'rxjs';
import { selectCurrentUser } from '../../store/user/user.selectors';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NzButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public user$: Observable<any>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectCurrentUser);
  }

  createPortfolioForm() {}

  getInitials(nameOrEmail: string): string {
    if (!nameOrEmail) return 'U';
    const parts = nameOrEmail.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    } else {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
  }
}
