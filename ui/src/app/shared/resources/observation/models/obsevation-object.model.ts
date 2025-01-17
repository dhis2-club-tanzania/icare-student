export interface ObservationObject {
  id: string;
  uuid: string;
  concept: any;
  conceptUuid?: string;
  obsDatetime?: string;
  personUuid: string;
  observationType?: any;
  observationDatetime: string;
  valueCodedName: string;
  location: any;
  encounterUuid: string;
  voided: boolean;
  value: string | number;
  valueObject?: any;
  status: string;
  obsDate?: any;
  obsTime?: any;
  provider?: any;
  order?: any;
}
