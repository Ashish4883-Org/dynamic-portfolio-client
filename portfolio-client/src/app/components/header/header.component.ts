import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [NzLayoutModule, RouterModule, NzDropDownModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isRegisterSelected: boolean = false;
  isLoginSelected: boolean = false;

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
