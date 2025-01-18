import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Consultation } from 'src/app/core/models';
import { Api } from 'src/app/shared/resources/openmrs';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  constructor(private api: Api) {}

  start(patientConsultation: any): Observable<Consultation> {
    return from(this.api.encounter.createEncounter(patientConsultation)).pipe(
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
