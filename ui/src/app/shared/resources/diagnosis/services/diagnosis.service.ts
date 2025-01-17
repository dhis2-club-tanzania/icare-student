import { Injectable } from "@angular/core";
import { Api } from "../../openmrs";
import { Observable, from, of } from "rxjs";

import { omit } from "lodash";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DiagnosisService {
  constructor(private api: Api) {}

  // concept?code=Diagnosis+Concept+Set&source=org.openmrs.module.emrapi&v=custom:(uuid,name,setMembers)
  addDiagnosis(data: any, currentDiagnosisUuid?: string): Observable<any> {
    if (!currentDiagnosisUuid) {
      return from(this.api.patientdiagnoses.createDiagnosis(data)).pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
    } else {
      data = omit(data, "patient");
      return from(
        this.api.patientdiagnoses.updateDiagnosis(currentDiagnosisUuid, data)
      ).pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
    }
  }

  deleteDiagnosis(uuid): Observable<any> {
    return from(this.api.patientdiagnoses.deleteDiagnosis(uuid)).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
