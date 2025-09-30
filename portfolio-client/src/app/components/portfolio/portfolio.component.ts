import { Component } from '@angular/core';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser } from '../../store/user/user.selectors';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-portfolio',
  imports: [NzSplitterModule, NzButtonModule, CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  user$: Observable<any>;
  openPortfolioForm: boolean = false;
  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
  }
  createPortfolioForm() {
    // this.openPortfolioForm = true;
  }
}
