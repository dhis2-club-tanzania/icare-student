import { Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Api, ConceptmaptypeCreate } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class ConceptMapTypesService {
  constructor(private api: Api) {}

  createConceptMapType(
    data: ConceptmaptypeCreate
  ): Observable<ConceptmaptypeCreate> {
    return from(this.api.conceptmaptype.createConceptMapType(data)).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
