import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser } from '../../store/user/user.selectors';
import { clearUser, logout } from '../../store/user/user.actions';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header',
  imports: [NzLayoutModule, RouterModule, NzDropDownModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  private api = inject(ApiService);

  isRegisterSelected: boolean = false;
  isLoginSelected: boolean = false;

  user$: Observable<any>;

  constructor(private store: Store, router: Router) {
    this.user$ = this.store.select(selectUser);
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        this.updateSelectedMenu(url);
      });
  }

  logout() {
    this.store.dispatch(logout());
  }

  updateSelectedMenu(url: string) {
    this.resetRouteVariables();
    if (url.startsWith('/register')) {
      this.isRegisterSelected = true;
    } else if (url.startsWith('/login')) {
      this.isLoginSelected = true;
    }
  }

  resetRouteVariables() {
    this.isLoginSelected = false;
    this.isRegisterSelected = false;
  }
}
