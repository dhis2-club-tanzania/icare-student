import { BaseState, initialBaseState } from './base.state';
import {
  PatientIdentifierGetRef,
  PersonGet,
  UserGet,
} from 'src/app/shared/resources/openmrs';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';

export interface CurrentPatientState extends BaseState {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  identifiers?: PatientIdentifierGetRef[];
  preferred?: boolean;
  voided?: boolean;
  person?: PersonGet;
  patient: Patient;
  admitted: boolean;
  transferred: boolean;
}

export const initialCurrentPatientState: CurrentPatientState = {
  ...initialBaseState,
  auditInfo: null,
  links: null,
  uuid: null,
  display: null,
  identifiers: null,
  preferred: null,
  voided: null,
  person: null,
  patient: null,
  admitted: false,
  transferred: false,
};
