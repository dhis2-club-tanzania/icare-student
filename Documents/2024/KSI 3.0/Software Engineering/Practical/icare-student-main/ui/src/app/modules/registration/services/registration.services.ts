import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { Api } from "src/app/shared/resources/openmrs";
import { head } from "lodash";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RegistrationService {
  constructor(private httpClient: OpenmrsHttpClientService) {}
  createPerson(personPayload) {
    let url = "person";

    return this.httpClient.post(url, personPayload);
  }

  createPatient(patientPayload: any, patientUuid?: string): Observable<any> {
    let url = "patient";
    return (
      !patientUuid
        ? this.httpClient.post(url, patientPayload)
        : this.updatePatient(patientPayload, patientUuid)
    ).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  updatePatient(patientPayload, uuid) {
    let url = `patient/${uuid}?v=full`;
    return this.httpClient.post(url, patientPayload).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getPatientIdentifierTypes() {
    return this.httpClient.get("patientidentifiertype?v=full").pipe(
      map((res) => {
        return (res.results || [])
          .map((patientIdenfierType: any) => {
            // In order to get empty results on the format key if the value is null
            if (patientIdenfierType.format === null) {
              patientIdenfierType.format = "";
            }
            const {
              uuid,
              display,
              required,
              retired,
              description,
              format,
              uniquenessBehavior,
              validator,
              locationBehavior,
            } = patientIdenfierType;

            if (retired) {
              return null;
            }

            return {
              id: uuid,
              name: display,
              required,
              description,
              format,
              uniquenessBehavior,
              validator,
              locationBehavior,
            };
          })
          .filter((identifierType) => identifierType);
      })
    );
  }

  getPersonAttributeTypes() {
    return this.httpClient.get("personattributetype?limit=60&v=full").pipe(
      map((res) => {
        return (res.results || [])
          .map((personAttributeType: any) => {
            const { uuid, display, required, retired } = personAttributeType;

            if (retired) {
              return null;
            }

            return {
              id: uuid,
              name: display,
              required,
            };
          })
          .filter((identifierType) => identifierType);
      })
    );
  }

  getAutoFilledPatientIdentifierType() {
    return this.httpClient
      .get("systemsetting?q=patient.autoFilledPatientIdentifierType&v=full")
      .pipe(
        map((res: any) => {
          return head((res?.results || []).map((payload) => payload?.value));
        })
      );
  }

  getVisitTypes() {
    let url = "visittype?v=custom:(display,name,uuid)";

    return this.httpClient.get(url).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getServicesConceptHierarchy() {
    let url = `concept/${ICARE_CONFIG?.visit?.serviceConceptUuid}?v=custom:(uuid,display,setMembers:(uuid,display,answers:(uuid,display),setMembers:(uuid,display)))`;

    return this.httpClient.get(url).pipe(
      map((res) => {
        return {
          results: [res],
        };
      })
    );
  }

  getPaymentOptionsHierarchy() {
    let url = `concept/${ICARE_CONFIG?.visit?.paymentCategoriesConceptUuid}?v=custom:(uuid,display,setMembers:(uuid,display,answers:(uuid,display),setMembers:(uuid,display)))`;

    return this.httpClient.get(url).pipe(
      map((res) => {
        return {
          results: [res],
        };
      })
    );
  }

  getRegistrationMRNSource() {
    return this.httpClient
      .get("systemsetting?q=icare.registration.mrnSource&v=full")
      .pipe(
        map((response) => {
          return response?.results[0]?.value;
        }),
        catchError((error) => {
          return error;
        })
      );
  }
}
