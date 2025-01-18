import { Injectable } from "@angular/core";
import { Observable, of, zip } from "rxjs";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { SampleAllocation } from "../models/allocation.model";

import { groupBy, flatten, keyBy, uniqBy } from "lodash";
import { catchError, map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Injectable({
  providedIn: "root",
})
export class SampleAllocationService {
  constructor(
    private httpClient: OpenmrsHttpClientService,
    private systemSettingsService: SystemSettingsService
  ) {}

  getAllocationsBySampleUuid(uuid: string): Observable<any[]> {
    return zip(
      this.systemSettingsService
        .getSystemSettingsByKey(`iCare.laboratory.resultApprovalConfiguration`)
        .pipe(
          map((response) => response),
          catchError((error) => of(error))
        ),
      this.systemSettingsService
        .getSystemSettingsByKey(
          `iCare.lis.testParameterRelationship.conceptSourceUuid`
        )
        .pipe(
          map((response) => response),
          catchError((error) => of(error))
        ),
      this.httpClient.get(`lab/allocationsbysample?uuid=${uuid}`)
    ).pipe(
      map((responses) => {
        let allSampleAllocations: any = [];
        let countOfAuthorizationRequired = Number(responses[0]);
        const groupedAllocations = groupBy(
          responses[2]?.map((allocation) => {
            const alloc: any = new SampleAllocation({
              ...allocation,
              resultApprovalConfiguration: responses[0],
              testRelationshipConceptSourceUuid: responses[1],
            }).toJson();
            allSampleAllocations = [...allSampleAllocations, alloc];
            return alloc;
          }),
          "orderUuid"
        );
        return Object.keys(groupedAllocations).map((key) => {
          const withResults =
            flatten(
              uniqBy(groupedAllocations[key], "allocationUuid")?.map(
                (allocation) => {
                  if (
                    !allocation?.finalResult?.groups &&
                    allocation?.finalResult?.value
                  ) {
                    return allocation?.finalResult;
                  } else {
                    const results = allocation?.finalResult?.groups?.map(
                      (group) => {
                        return group?.results.map((res) => {
                          return {
                            ...res,
                            authorizationIsReady: group?.authorizationIsReady,
                          };
                        });
                      }
                    );
                    return flatten(results);
                  }
                }
              )
            )?.filter((result) => result) || [];

          const authorizationIsReady =
            (
              flatten(
                uniqBy(groupedAllocations[key], "allocationUuid")?.map(
                  (allocation) => {
                    if (
                      !allocation?.finalResult?.groups &&
                      allocation?.finalResult?.value
                    ) {
                      return allocation?.finalResult;
                    } else {
                      const results = allocation?.finalResult?.groups?.map(
                        (group) => {
                          return group?.results.map((res) => {
                            return {
                              ...res,
                              authorizationIsReady: group?.authorizationIsReady,
                            };
                          });
                        }
                      );
                      return flatten(results);
                    }
                  }
                )
              )?.filter((result) => result?.authorizationIsReady) || []
            )?.length === withResults?.length && withResults?.length > 0;
          const allocationsKeyedByParametersUuid = keyBy(
            allSampleAllocations?.map((allocation) => {
              return {
                ...allocation,
                parameterUuid: allocation?.parameter?.uuid,
              };
            }),
            "parameterUuid"
          );
          const parametersWithDefinedRelationship =
            groupedAllocations[key]?.filter(
              (allocation) => allocation?.parameter?.relatedTo
            ) || [];
          const finalResults = flatten(
            groupedAllocations[key]?.map(
              (allocation) => allocation?.finalResult || []
            )
          );
          const finalResultsFedBy =
            finalResults[0]?.groups &&
            finalResults[0]?.groups?.length > 0 &&
            finalResults[0]?.groups[0]?.results &&
            finalResults[0]?.groups[0]?.results?.length > 0
              ? finalResults[0]?.groups[0]?.results[0]?.creator
              : finalResults[0]?.result?.creator;
          return {
            ...{
              ...groupedAllocations[key][0]?.order,
              parametersWithDefinedRelationship:
                (
                  parametersWithDefinedRelationship?.filter(
                    (allocation) =>
                      allocationsKeyedByParametersUuid[
                        allocation?.parameter?.relatedTo?.code
                      ]
                  ) || []
                )?.map((allocation) => {
                  return {
                    ...allocation,
                    relatedAllocation: new SampleAllocation(
                      allocationsKeyedByParametersUuid[
                        allocation?.parameter?.relatedTo?.code
                      ]
                    ).toJson(),
                    formattedAllocation: new SampleAllocation(
                      allocation
                    ).toJson(),
                  };
                }) || [],
              concept: {
                ...groupedAllocations[key][0]?.order?.concept,
                display:
                  groupedAllocations[key][0]?.order?.concept?.display?.indexOf(
                    ":"
                  ) > -1
                    ? groupedAllocations[
                        key
                      ][0]?.order?.concept?.display?.split(":")[1]
                    : groupedAllocations[key][0]?.order?.concept?.display,
              },
            },
            authorizationStatuses: flatten(
              groupedAllocations[key]?.map(
                (allocation) =>
                  allocation?.finalResult?.authorizationStatuses || []
              )
            ),
            authorizationIsReady,
            finalResults: finalResults,
            savedOnce:
              (
                finalResults?.filter(
                  (finalResult: any) => finalResult?.savedOnce
                ) || []
              )?.length > 0,
            finalResultsFedBy: finalResultsFedBy?.uuid
              ? finalResultsFedBy
              : finalResults && finalResults?.length > 0
              ? finalResults[0]?.creator
              : null,
            allocations: groupedAllocations[key]?.map((allocation) => {
              return new SampleAllocation(allocation).toJson();
            }),
          };
        });
      })
    );
  }

  saveResultsViaAllocations(results: any): Observable<any> {
    return this.httpClient.post(`lab/multipleresults`, results).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  saveAllocationStatuses(allocationStatuses): Observable<any> {
    return this.httpClient
      .post(`lab/allocationstatuses`, allocationStatuses)
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }

  createTestAllocation(data: any): Observable<any> {
    return this.httpClient.post(`lab/allocation`, data).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  voidResults(data: any): Observable<any> {
    return this.httpClient.put(`lab/voidmultipleresults`, data).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
