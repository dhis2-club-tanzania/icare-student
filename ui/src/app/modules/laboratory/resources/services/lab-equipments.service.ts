import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Api } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class LabEquipmentsService {
  constructor(private api: Api) {}

  getLabEquiments(): Observable<any> {
    return from(
      this.api.concept.getAllConcepts({ q: "LIS_INSTRUMENT", limit: 50 })
    ).pipe(
      map((response: any) => {
        return response?.results;
      }),
      catchError((error: any) => of(error))
    );
  }
}
