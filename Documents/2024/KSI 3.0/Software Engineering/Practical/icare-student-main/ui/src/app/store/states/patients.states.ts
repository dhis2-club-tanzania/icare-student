import { BaseState, initialBaseState } from './base.state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface PatientState extends BaseState, EntityState<any> {
  samples: any[];
}

export const patientAdapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialPatientState = patientAdapter.getInitialState({
  ...initialBaseState,
  samples: [],
});
