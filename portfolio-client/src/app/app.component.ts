import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { HeaderComponent } from './components/header/header.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { catchError, delay, of, retryWhen, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NzAlertModule, NzSpinModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'portfolio-client';
  isLoading: boolean = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.tryBackendWakeUp();

    // Test fetching portfolio data on init
    this.api.getPortfolio().subscribe((data) => {
      console.log('Portfolio data:', data);
    });
  }

  tryBackendWakeUp() {
    this.api
      .getHello()
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            tap(() => console.log('Backend not ready yet, retrying...')),
            delay(2000) // wait 2s before retry
          )
        ),
        catchError((err) => {
          console.error('Backend still not reachable', err);
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.isLoading = false;
          console.log('Backend is awake:', res);
        }
      });
  }
}
