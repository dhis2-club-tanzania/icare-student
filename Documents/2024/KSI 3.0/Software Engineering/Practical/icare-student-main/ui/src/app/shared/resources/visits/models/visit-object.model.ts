import { DiagnosisObject } from "../../diagnosis/models/diagnosis-object.model";
import { VisitAttribute } from "./visit-attribute.model";

export interface VisitObject {
  id: string;
  uuid: string;
  visitType: any;
  patientUuid: string;
  encounters: any[];
  labOrders: any[];
  startDate?: string;
  stopDate?: string;
  attributes?: VisitAttribute[];
  location?: any;
  diagnoses?: DiagnosisObject[];
  encounterUuid?: string;
  isAdmitted?: boolean;
  waitingToBeAdmitted?: boolean;
  radiologyOrders?: any[];
  procedureOrders?: any[];
  isEmergency?: boolean;
  markedAsDead?: boolean;
  isEnsured?: boolean;
  paymentType: string;
  otherOrders: any[];
  transferedOutSide?: boolean;
  transferToEncounterDetails?: any;
  patientProfileAttributes?: any;
  consultationStarted?: boolean;
  consultationStatusOrder?: any;
  hasProvisonalDiagnosis?: boolean;
  hasConfirmedDiagnosis?: boolean;
  observations?: any;
  drugOrders?: any;
}
