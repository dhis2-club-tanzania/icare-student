import { createSelector } from '@ngrx/store';
import { AppState, getRootState } from '../reducers';
import { encounterTypeAdapter } from '../states/encounter-type.state';
import { find } from 'lodash';
import { EncounterType } from 'src/app/shared/models/encounter-type.model';

const getEncounterTypeState = createSelector(
  getRootState,
  (state: AppState) => state.encounterType
);

export const {
  selectAll: getAllEncounterTypes,
  selectEntities: getEncounterTypeEntities,
} = encounterTypeAdapter.getSelectors(getEncounterTypeState);

export const getEncounterTypeByName = (name: string) =>
  createSelector(getAllEncounterTypes, (encounterTypes: EncounterType[]) =>
    find(encounterTypes, ['display', name])
  );

export const getEncounterTypeByUuid = createSelector(
  getAllEncounterTypes,
  (encounterTypes: EncounterType[], props) =>
    find(encounterTypes, ['id', props?.uuid])
);

export const getEncounterLoadedStatus = createSelector(
  getEncounterTypeState,
  (encounterTypeState) => encounterTypeState.loaded
);
