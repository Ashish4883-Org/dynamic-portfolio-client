import { Component } from '@angular/core';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProfileComponent } from '../profile/profile.component';
import { AllUsersComponent } from '../all-users/all-users.component';
import { CreatePortfolioComponent } from '../create-portfolio/create-portfolio.component';

@Component({
  selector: 'app-portfolio',
  imports: [
    NzSplitterModule,
    CommonModule,
    DashboardComponent,
    ProfileComponent,
    AllUsersComponent,
    CreatePortfolioComponent,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  selected: string = 'dashboard';

  loadContent(option: string) {
    this.selected = option;
  }
}
