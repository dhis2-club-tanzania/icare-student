import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { sanitizeUsers } from '../../resources/helpers';
import { UsersService } from '../../resources/services/users.service';
import { addLoadedUsers, loadingUsersFails, loadUsers } from '../actions';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersService: UsersService) {}

  allUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.usersService.getUsers().pipe(
          map((usersResponse) => {
            return addLoadedUsers({
              users: sanitizeUsers(usersResponse?.results || []),
            });
          }),
          catchError((error) => of(loadingUsersFails({ error })))
        )
      )
    )
  );
}
