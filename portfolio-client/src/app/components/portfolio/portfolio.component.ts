import { Component } from '@angular/core';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';

@Component({
  selector: 'app-portfolio',
  imports: [NzSplitterModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {}
