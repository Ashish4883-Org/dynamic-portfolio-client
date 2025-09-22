import { Component, Input, input } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [NzLayoutModule, NzMenuModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isRegisterSelected: boolean = false;
  isLoginSelected: boolean = false;
  message = input('');

  constructor(router: Router) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        this.updateSelectedMenu(url);
      });
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
