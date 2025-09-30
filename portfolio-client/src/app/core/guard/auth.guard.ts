// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select('user').pipe(
    map((userState: any) => {
      if (userState && userState.user) {
        return true; // allow access
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
