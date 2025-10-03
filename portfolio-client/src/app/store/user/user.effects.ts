import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  logoutFailure,
  clearUser,
} from './user.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { SocketService } from '../../services/socket.sevice';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private api = inject(ApiService);
  private router = inject(Router);
  private store = inject(Store);
  private socketService = inject(SocketService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(({ email, password }) =>
        this.api.post('login', { email, password }).pipe(
          map((res: any) => loginSuccess({ user: res.user || res })),
          catchError((error) => of(loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => this.router.navigate(['/portfolio']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      mergeMap(() =>
        this.api.post('logout', {}).pipe(
          map((res: any) => {
            this.socketService.disconnect();
            if (res.message === 'Logged out successfully') {
              return logoutSuccess();
            } else {
              return logoutFailure({ error: 'Unexpected response' });
            }
          }),
          catchError((error) => of(logoutFailure({ error })))
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccess),
        tap(() => {
          this.store.dispatch(clearUser());
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
