import { ObservationObject } from "./obsevation-object.model";

export class Observation {
  constructor(private obs) {}

  get uuid(): string {
    return this.obs?.uuid;
  }

  get observationType(): any {
    return {
      encounterTypeUuid: this.obs?.encounterType?.uuid,
      display: this.obs?.encounterType?.display,
    };
  }

  get concept(): any {
    return {
      ...this.obs?.concept,
      uuid: this.obs?.concept?.uuid,
      display: this.obs?.concept?.display,
    };
  }

  get personUuid(): string {
    return this.obs?.person?.uuid;
  }

  get observationDatetime(): string {
    return this.obs?.obsDatetime;
  }

  get valueCodedName(): string {
    return this.obs?.valueCodedName;
  }

  get location(): { uuid: string } {
    return { uuid: this.obs?.location?.uuid };
  }

  get encounterUuid(): string {
    return this.obs?.encounter.uuid;
  }

  get voided(): boolean {
    return this.obs?.voided;
  }

  get value(): string | number {
    return this.obs?.value?.hasOwnProperty("uuid")
      ? this.obs?.value?.uuid
      : this.obs?.value;
  }

  get valueObject(): any {
    const valueObject = this.obs?.value?.hasOwnProperty("uuid")
      ? this.obs?.value
      : null;
    return valueObject;
  }

  get status(): string {
    return this.obs.status;
  }

  get obsTime(): number {
    return new Date(this.obs.obsDatetime).getHours();
  }

  get obsDate(): any {
    const obsDateTime = new Date(this.obs.obsDatetime);
    return new Date(
      obsDateTime.getFullYear() +
        "-" +
        obsDateTime.getMonth() +
        "-" +
        obsDateTime.getDate()
    );
  }

  get conceptUuid(): string {
    return this.obs?.concept?.uuid;
  }

  get provider(): any {
    return this.obs?.encounterProvider;
  }

  get order(): any {
    return this.obs?.order;
  }

  toJson(): ObservationObject {
    return {
      id: this.uuid,
      uuid: this.uuid,
      concept: this.concept,
      personUuid: this.personUuid,
      observationType: this.observationType,
      observationDatetime: this.observationDatetime,
      obsDatetime: this.observationDatetime,
      valueCodedName: this.valueCodedName,
      location: this.location,
      encounterUuid: this.encounterUuid,
      obsDate: this.obsDate,
      obsTime: this.obsTime,
      voided: this.voided,
      value: this.value,
      valueObject: this.valueObject,
      status: this.status,
      conceptUuid: this.conceptUuid,
      provider: this.provider,
      order: this.order,
    };
  }
}
