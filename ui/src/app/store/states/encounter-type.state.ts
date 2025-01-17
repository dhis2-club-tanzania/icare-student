import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { EncounterType } from 'src/app/shared/models/encounter-type.model';
import { BaseState, initialBaseState } from './base.state';

export interface EncounterTypeState
  extends EntityState<EncounterType>,
    BaseState {}

export const encounterTypeAdapter: EntityAdapter<EncounterType> = createEntityAdapter<
  EncounterType
>();

export const initialEncounterTypeState: EncounterTypeState = encounterTypeAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);
