import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ObservationObject } from 'src/app/shared/resources/observation/models/obsevation-object.model';
import { BaseState, initialBaseState } from './base.state';

export interface ObservationState
  extends EntityState<ObservationObject>,
    BaseState {
  savingObservations: boolean;
}

export const observationAdapter: EntityAdapter<ObservationObject> = createEntityAdapter<
  ObservationObject
>();

export const initialObservationState: ObservationState = observationAdapter.getInitialState(
  {
    ...initialBaseState,
    savingObservations: false
  }
);
