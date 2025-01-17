import { Injectable } from "@angular/core";
import { Api } from "src/app/shared/resources/openmrs";
import { Observable, from, of } from "rxjs";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { catchError, map } from "rxjs/operators";
import { SampleAllocation } from "src/app/shared/resources/sample-allocations/models/allocation.model";

@Injectable({
  providedIn: "root",
})
export class WorkSheetsService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  createWorkSheet(data: any): Observable<any> {
    return this.httpClient.post(`lab/worksheets`, data).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getWorkSheets(): Observable<any[]> {
    return this.httpClient.get(`lab/worksheets`).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  createWorksheetControls(data: any): Observable<any> {
    return this.httpClient.post(`lab/worksheetcontrols`, data).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getWorksheetControls(): Observable<any[]> {
    return this.httpClient.get(`lab/worksheetcontrols`).pipe(
      map((controlsRespone: any) => {
        return controlsRespone?.map((response) => {
          return {
            ...response,
            testOrder: {
              ...response?.testOrder,
              name:
                response?.testOrder?.display?.indexOf(":") > -1
                  ? response?.testOrder?.display?.split(":")[1]
                  : response?.testOrder?.display,
              display:
                response?.testOrder?.display?.indexOf(":") > -1
                  ? response?.testOrder?.display?.split(":")[1]
                  : response?.testOrder?.display,
            },
          };
        });
      }),
      catchError((error) => of(error))
    );
  }

  createWorksheetDefinitions(data: any): Observable<any[]> {
    return this.httpClient.post(`lab/worksheetdefinitions`, data).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getWorksheetDefinitions(parameters?: any): Observable<any[]> {
    let qParameters = [];
    if (parameters?.startDate) {
      qParameters = [...qParameters, "expirationDate=" + parameters?.startDate];
    }
    if (parameters?.q) {
      qParameters = [...qParameters, "q=" + parameters?.q];
    }

    return this.httpClient
      .get(`lab/worksheetdefinitions?${qParameters.join("&")}`)
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }

  createWorksheetSamples(data: any): Observable<any> {
    return this.httpClient.post(`lab/worksheetsamples`, data).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getWorksheetSamples(): Observable<any[]> {
    return this.httpClient.get(`lab/worksheetsamples`).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getWorksheetDefinitionsByUuid(uuid: string): Observable<any> {
    return this.httpClient.get(`lab/worksheetdefinition?uuid=${uuid}`).pipe(
      map((response) => {
        let testAllocationAssociatedFieldsCount = 1;
        let associatedFieldsReference = [];
        const formattedWorksheetSamples = response?.worksheetSamples?.map(
          (worksheetSample) => {
            const testAllocationAssociatedFields =
              worksheetSample?.sample?.allocations[0]?.testAllocationAssociatedFields?.map(
                (assocField) => {
                  return {
                    ...assocField,
                    sample: worksheetSample?.sample,
                  };
                }
              );

            associatedFieldsReference = testAllocationAssociatedFields
              ? testAllocationAssociatedFields
              : associatedFieldsReference;
            if (
              testAllocationAssociatedFieldsCount <
              testAllocationAssociatedFields?.length
            ) {
              testAllocationAssociatedFieldsCount =
                testAllocationAssociatedFields?.length;
            }
            return {
              ...worksheetSample,
              searchText:
                worksheetSample?.sample?.display +
                " " +
                worksheetSample?.sample?.allocations
                  ?.map(
                    (allocation) =>
                      allocation?.concept?.display + " " + allocation?.label
                  )
                  ?.join(" "),
              allocationsCount: worksheetSample?.sample?.allocations.length,
              testAllocationAssociatedFieldsCount: 0,
              testAllocationAssociatedFields: testAllocationAssociatedFields,
              sample: {
                ...worksheetSample?.sample,
                allocations: worksheetSample?.sample?.allocations?.map(
                  (allocation) => new SampleAllocation(allocation).toJson()
                ),
                hasResults:
                  (
                    worksheetSample?.sample?.statuses?.filter(
                      (status) => status?.category === "HAS_RESULTS"
                    ) || []
                  )?.length > 0,
                authorizationStatuses:
                  worksheetSample?.sample?.statuses?.filter(
                    (status) => status?.category === "RESULT_AUTHORIZATION"
                  ) || [],
              },
            };
          }
        );
        const countOfWSSamples = formattedWorksheetSamples?.length;
        return {
          ...response,
          worksheetSamples: formattedWorksheetSamples,
          testAllocationAssociatedFieldsCount,
          associatedFieldsReference,
          groupedWorksheetSamples:
            countOfWSSamples > 1
              ? {
                  group1: formattedWorksheetSamples.slice(
                    0,
                    countOfWSSamples / 2
                  ),
                  group2: formattedWorksheetSamples.slice(
                    Number((countOfWSSamples / 2).toFixed(0)),
                    Number((2 * (countOfWSSamples / 2)).toFixed(0))
                  ),
                }
              : {
                  group1: formattedWorksheetSamples,
                },
        };
      }),
      catchError((error) => of(error))
    );
  }
}
