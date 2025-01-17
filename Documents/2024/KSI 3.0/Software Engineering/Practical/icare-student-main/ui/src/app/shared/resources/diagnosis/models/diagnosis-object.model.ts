export interface DiagnosisObject {
  id?: string;
  uuid?: string;
  encounterUuid?: string;
  voided?: boolean;
  diagnosis?: any;
  certainty?: string;
  rank?: number;
  condition?: any;
  display?: string;
  isConfirmedDiagnosis?: boolean;
}
