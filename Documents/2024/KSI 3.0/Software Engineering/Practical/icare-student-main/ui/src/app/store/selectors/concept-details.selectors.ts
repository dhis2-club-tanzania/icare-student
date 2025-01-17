import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import { conceptAdapter } from '../states';

import * as _ from 'lodash';

const getConceptState = createSelector(
  getRootState,
  (state: AppState) => state.concept
);

export const {
  selectEntities: getConceptDetailsEntities,
  selectAll: getAllConcepts,
} = conceptAdapter.getSelectors(getConceptState);

export const getConceptById = createSelector(
  getConceptDetailsEntities,
  (entities, props) => entities[props.id]
);

export const getConceptByFullSpecifiedName = createSelector(
  getAllConcepts,
  (concepts, props) => (_.filter(concepts, { name: props.name }) || [])[0]
);

export const getLabTestSpecimenSources = createSelector(
  getAllConcepts,
  (concepts, props) =>
    (_.filter(concepts, { name: props.name }) || [])[0]?.setMembers || []
);

export const getTestContainers = createSelector(
  getAllConcepts,
  (concepts, props) =>
    (_.filter(concepts, { name: props.name }) || [])[0]?.answers
);

export const getConceptDetailsByName = createSelector(
  getAllConcepts,
  (concepts, props) => (_.filter(concepts, { name: props.name }) || [])[0]
);
