import { createReducer, on } from '@ngrx/store';
import { initialConceptState, conceptAdapter } from '../states';
import {
  loadConcept,
  upsertLoadedConcept,
  loadingConceptFails
} from '../actions';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState
} from '../states/base.state';

const reducer = createReducer(
  initialConceptState,
  on(loadConcept, state => ({
    ...state,
    ...loadingBaseState
  })),
  on(upsertLoadedConcept, (state, { concepts }) =>
    conceptAdapter.addMany(concepts, { ...state, ...loadedBaseState })
  ),
  on(loadingConceptFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState
  }))
);

export function conceptReducer(state, action) {
  return reducer(state, action);
}
