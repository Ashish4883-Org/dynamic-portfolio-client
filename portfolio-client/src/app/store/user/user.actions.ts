import { createAction, props } from '@ngrx/store';

export const setUser = createAction('[User] Set User', props<{ user: any }>());
export const clearUser = createAction('[User] Clear User');

export const login = createAction(
  '[User] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[User] Login Success',
  props<{ user: any }>()
);

export const loginFailure = createAction(
  '[User] Login Failure',
  props<{ error: any }>()
);

export const logout = createAction('[User] Logout');
export const logoutSuccess = createAction('[User] Logout Success');
export const logoutFailure = createAction(
  '[User] Logout Failure',
  props<{ error: any }>()
);
