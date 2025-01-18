import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Api } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class DatasetDefinitionsService {
  constructor(private api: Api) {}

  getDataSets(): Observable<any[]> {
    return from(
      this.api.reportingrest.getAllDataSetDefinitions({ limit: 100 })
    ).pipe(map((response) => response?.results));
  }
}
