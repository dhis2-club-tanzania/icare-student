import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observation } from 'src/app/shared/resources/observation/models/observation.model';
import { Api, PatientCreate } from 'src/app/shared/resources/openmrs';
import { Consultation } from '../models/consultation.model';

@Injectable()
export class ConsultationService {
  constructor(private api: Api) {}

  start(patient: any): Observable<Consultation> {
    return from(this.api.encounter.createEncounter(patient)).pipe(
      map((res) => ({
        encounterUuid: res?.uuid,
        startDate: res?.startDate,
        stopDate: res?.stopDate,
      }))
    );
  }

  save() {}

  saveDrugOrder() {}
}
