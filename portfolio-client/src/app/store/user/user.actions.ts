import { createAction, props } from '@ngrx/store';
import { RegisterUser, User } from '../../models/user.model';

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

export const loadUsers = createAction('[User] Load Users');

export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: any }>()
);

export const registerUser = createAction(
  '[Register] Register User',
  props<{ user: RegisterUser }>()
);

export const registerUserSuccess = createAction(
  '[Register] Register User Success',
  props<{ user: User }>()
);

export const registerUserFailure = createAction(
  '[Register] Register User Failure',
  props<{ error: any }>()
);
