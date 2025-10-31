import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

// Ng Zorro imports
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-view-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzAvatarModule,
    NzDividerModule,
    NzDescriptionsModule,
    NzGridModule,
    NzTypographyModule,
    NzTagModule,
    NzSpinModule,
    NzButtonModule,
    NzToolTipModule,
  ],
  templateUrl: './view-portfolio.component.html',
  styleUrls: ['./view-portfolio.component.scss'],
})
export class ViewPortfolioComponent {
  mstrid!: string;
  loading = true;
  portfolio: any = null;
  api = inject(ApiService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.mstrid = this.route.snapshot.paramMap.get('userId')!;
    this.api.get(`portfolios/mstrid/${this.mstrid}`).subscribe({
      next: (res: any) => {
        this.portfolio = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.portfolio = null;
      },
    });
  }

  openPortfolio() {
    window.open(`/portfolio/${this.mstrid}`, '_blank');
  }

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
