import { NavigationExtras } from '@angular/router';
import { createAction, props } from '@ngrx/store';

export const go = createAction(
  '[Router] Go',
  props<{
    path: any;
    query?: any;
    extras?: NavigationExtras;
  }>()
);

export const back = createAction('[Router] Back');

export const forward = createAction('[Router] Forward');
