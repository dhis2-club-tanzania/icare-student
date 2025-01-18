import { DiagnosisObject } from "./diagnosis-object.model";

export class Diagnosis {
  constructor(private diagnosisDetails: any) {}

  get uuid(): string {
    return this.diagnosisDetails?.uuid;
  }
  get id(): string {
    return this.diagnosisDetails?.uuid;
  }

  get diagnosis(): any {
    return {
      uuid: this.diagnosisDetails?.diagnosis?.coded?.uuid,
      display: this.diagnosisDetails?.diagnosis?.coded?.display,
    };
  }

  get encounterUuid(): string {
    return this.diagnosisDetails?.encounter.uuid;
  }

  get voided(): boolean {
    return this.diagnosisDetails?.voided;
  }

  get rank(): number {
    return this.diagnosisDetails?.rank;
  }

  get condition(): any {
    return this.diagnosisDetails?.condition;
  }

  get display(): string {
    return this.diagnosisDetails?.display;
  }

  get certainty(): string {
    return this.diagnosisDetails?.certainty;
  }

  get isConfirmedDiagnosis(): boolean {
    return this.diagnosisDetails?.certainty?.toLowerCase() === "confirmed";
  }

  toJson(): DiagnosisObject {
    return {
      id: this.uuid,
      uuid: this.uuid,
      encounterUuid: this.encounterUuid,
      voided: this.voided,
      diagnosis: this.diagnosis,
      certainty: this.certainty,
      rank: this.rank,
      condition: this.condition,
      display: this.display,
      isConfirmedDiagnosis: this.isConfirmedDiagnosis,
    };
  }
}
