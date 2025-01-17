import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { VisitObject } from 'src/app/shared/resources/visits/models/visit-object.model';
import { BaseState, initialBaseState } from './base.state';

export interface VisitState extends EntityState<VisitObject>, BaseState {
  activeVisitUuid: string;
  markedAsDead: boolean;
  admittedPatientsVisitLocations: any;
  patientAdmittedVisitsAdded: boolean;
}

export const visitAdapter: EntityAdapter<VisitObject> =
  createEntityAdapter<VisitObject>();

export const initialVisitState: VisitState = visitAdapter.getInitialState({
  ...initialBaseState,
  activeVisitUuid: null,
  markedAsDead: false,
  admittedPatientsVisitLocations: [],
  patientAdmittedVisitsAdded: false,
});
