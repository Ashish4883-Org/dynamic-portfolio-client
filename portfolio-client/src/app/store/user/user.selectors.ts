import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');
export const selectCurrentUser = createSelector(
  selectUserState,
  (state) => state.user
);

export const selectAllUsers = createSelector(
  selectUserState,
  (state) => state.allUsers
);
