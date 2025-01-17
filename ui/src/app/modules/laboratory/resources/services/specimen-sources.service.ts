import { Injectable } from '@angular/core';
import { Api } from 'src/app/shared/resources/openmrs';
import { Observable, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpecimenSourcesService {
  constructor(private api: Api) {}

  getSpecimenSources(configs): Observable<any> {
    return from(
      this.api.concept.getAllConcepts({
        name: configs?.name,
        v: configs?.fields,
      })
    );
  }
}
