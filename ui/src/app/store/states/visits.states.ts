import { BaseState, initialBaseState } from './base.state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface VisitsState extends BaseState, EntityState<any> {
  parameters: any;
  collectedSamples: any[];
  visitsReferences: any[];
  loadingVisits: boolean;
  loadedVisits: boolean;
  loadingVisitsHasError: boolean;
  loadingVisitsError: any;
}

export const visitsAdapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialVisitsState = visitsAdapter.getInitialState({
  ...initialBaseState,
  parameters: null,
  collectedSamples: [],
  visitsReferences: [],
  loadingVisits: false,
  loadedVisits: false,
  loadingVisitsHasError: false,
  loadingVisitsError: null,
});
