import {
  MemoizedSelector,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import {
  specimenSourcesAndLabTestsAdapter,
  SpecimenSourcesAndLabTestsState,
} from '../states/specimen-sources-and-tests-management.states';

import { filter } from 'lodash';

const getSpecimenSoucesAndLabTestsState: MemoizedSelector<
  Object,
  SpecimenSourcesAndLabTestsState
> = createFeatureSelector<SpecimenSourcesAndLabTestsState>(
  'specimenSourcesAndLabTests'
);

const {
  selectAll,
  selectEntities,
} = specimenSourcesAndLabTestsAdapter.getSelectors(
  getSpecimenSoucesAndLabTestsState
);

export const getSpecimenSources = createSelector(
  selectAll,
  (all, props) => (filter(all, { name: props['name'] }) || [])[0]
);
