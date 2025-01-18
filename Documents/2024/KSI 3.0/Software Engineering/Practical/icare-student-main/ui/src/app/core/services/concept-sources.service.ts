import { Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  Api,
  ConceptsourceCreate,
  ConceptsourceGet,
} from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class ConceptSourcesService {
  constructor(private api: Api) {}

  createConceptSource(
    data: ConceptsourceCreate
  ): Observable<ConceptsourceCreate> {
    return from(this.api.conceptsource.createConceptSource(data)).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getConceptSources(): Observable<ConceptsourceGet[]> {
    return from(this.api.conceptsource.getAllConceptSources()).pipe(
      map((response) => response?.results),
      catchError((error) => of(error))
    );
  }
  getConceptSourceDetailsByUuid(uuid): Observable<any> {
    return from(this.api.conceptsource.getConceptSource(uuid)).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
