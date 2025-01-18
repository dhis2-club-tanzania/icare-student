import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api, ConceptGet } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class LabTestsService {
  constructor(
    private api: Api,
    private openMRSHttpClient: OpenmrsHttpClientService
  ) {}

  getSetMembersByConceptUuid(uuid: string): Observable<ConceptGet[]> {
    return this.openMRSHttpClient
      .get(
        `concept/${uuid}?v=custom:(uuid,display,setMembers:(uuid,display,name))`
      )
      .pipe(
        map((response) => {
          return response?.setMembers;
        }),
        catchError((error) => of(error))
      );
  }

  getLabTestsByDepartment(uuid: string): Observable<any> {
    return this.openMRSHttpClient
      .get(
        `concept/${uuid}?v=custom:(uuid,display,setMembers:(uuid,display,name))`
      )
      .pipe(
        map((response) => {
          return response?.setMembers;
        }),
        catchError((error) => of(error))
      );
  }
}
