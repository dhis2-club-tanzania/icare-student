import { getSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppState } from '../reducers';

export const selectRouter = createFeatureSelector<AppState, RouterReducerState>(
  'router'
);

export const {
  selectQueryParams: getQueryParams, // select the current route query params
  selectRouteParams: getRouteParams, // select the current route params
  selectRouteData: getRouteData, // select the current route data
  selectUrl: getUrl, // select the current url
} = getSelectors(selectRouter);

export const getIfNonLoginRoute = createSelector(
  getUrl,
  (url: string) => !(url || '').includes('login')
);
