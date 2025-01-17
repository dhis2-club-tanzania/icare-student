import { Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Api, ConceptdatatypeGet } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class DataTypesService {
  constructor(private api: Api) {}

  getDataTypes(): Observable<ConceptdatatypeGet[]> {
    return from(this.api.conceptdatatype.getAllConceptDatatypes()).pipe(
      map((response) => {
        return response?.results;
      }),
      catchError((error) => of(error))
    );
  }
}
