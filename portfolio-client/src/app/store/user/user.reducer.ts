import { createReducer, on } from '@ngrx/store';
import {
  setUser,
  clearUser,
  loginSuccess,
  loadUsers,
  loadUsersSuccess,
  loadUsersFailure,
  registerUserFailure,
  registerUserSuccess,
} from './user.actions';
import { User } from '../../models/user.model';

export interface UserState {
  user: any | null;
  allUsers: User[];
}

export const initialState: UserState = {
  user: null,
  allUsers: [],
};

export const userReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({ ...state, user })),
  on(clearUser, (state) => ({ ...state, user: null })),
  on(loginSuccess, (state, { user }) => ({ ...state, user })),

  on(loadUsers, (state) => ({
    ...state,
    // loading: true,
    // error: null,
  })),
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    // loading: false,
    allUsers: users,
  })),
  on(loadUsersFailure, (state, { error }) => ({
    ...state,
    // loading: false,
    // error,
  })),
  on(registerUserSuccess, (state, { user }) => ({
    ...state,
    user: user,
    allUsers: [...state.allUsers, user],
  })),
  on(registerUserFailure, (state, { error }) => ({
    ...state,
    // error
  }))
);
