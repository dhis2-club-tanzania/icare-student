import { createReducer, on } from '@ngrx/store';
import {
  initialSpecimenSourcesAndLabTestsState,
  specimenSourcesAndLabTestsAdapter,
} from '../states/specimen-sources-and-tests-management.states';
import {
  loadSpecimenSources,
  addLoadedSpecimenSources,
  loadingSpecimenSourcesFails,
} from '../actions/specimen-sources-and-tests-management.actions';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState,
} from 'src/app/store/states/base.state';

const reducer = createReducer(
  initialSpecimenSourcesAndLabTestsState,
  on(loadSpecimenSources, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedSpecimenSources, (state, { specimenSources }) =>
    specimenSourcesAndLabTestsAdapter.addMany(specimenSources, {
      ...state,
      ...loadedBaseState,
    })
  ),
  on(loadingSpecimenSourcesFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  }))
);

export function specimenSourcesAndLabTestsReducer(state, action) {
  return reducer(state, action);
}
