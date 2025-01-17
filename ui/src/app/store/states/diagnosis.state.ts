import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { DiagnosisObject } from 'src/app/shared/resources/diagnosis/models/diagnosis-object.model';
import { BaseState, initialBaseState } from './base.state';

export interface DiagnosisState
  extends EntityState<DiagnosisObject>,
    BaseState {}

export const diagnosisAdapter: EntityAdapter<DiagnosisObject> = createEntityAdapter<
  DiagnosisObject
>();

export const initialDiagnosisState: DiagnosisState = diagnosisAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);
