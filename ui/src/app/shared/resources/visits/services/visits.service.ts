import { query } from "@angular/animations";
import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { isArray, omit, orderBy, flatten, groupBy, keyBy } from "lodash";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BillingService } from "src/app/modules/billing/services/billing.service";
import { PaymentService } from "src/app/modules/billing/services/payment.service";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { ICARE_CONFIG } from "../../config";
import { Api } from "../../openmrs";
import { DrugOrder } from "../../order/models";
import { DrugOrdersService } from "../../order/services";
import {
  getDrugOrdersFromCurrentVisitEncounters,
  getOrdersFromCurrentVisitEncounters,
} from "../helpers";
import { Visit } from "../models/visit.model";

@Injectable({
  providedIn: "root",
})
export class VisitsService {
  constructor(
    private httpClient: OpenmrsHttpClientService,
    private api: Api,
    private billingService: BillingService,
    private paymentService: PaymentService,
    private domSanitizer: DomSanitizer,
    private drugOrderService: DrugOrdersService
  ) {}

  createVisit(visitPayload): Observable<any> {
    let url = "visit";
    return this.httpClient.post(url, visitPayload).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  getVisitEncounterDetailsByVisitUuid(parameters): Observable<any> {
    return from(
      this.api.visit.getVisit(parameters?.uuid, parameters?.query)
    ).pipe(
      map((response) => {
        return response.encounters.map((encounter: any) => {
          let formattedObs = [];
          const encounterProvider = encounter?.encounterProviders[0];
          formattedObs = [
            ...formattedObs,
            ...encounter?.obs.map((observation) => {
              return {
                ...observation,
                value: !observation?.value?.uuid
                  ? observation?.value
                  : {
                      ...observation?.value,
                      display:
                        observation?.value?.display?.indexOf(":") > -1
                          ? observation?.value?.display.split(":")[1]
                          : observation?.value?.display,
                    },
                encounterProvider: {
                  ...encounterProvider?.provider,
                  name:
                    encounterProvider?.provider &&
                    encounterProvider?.provider?.display?.indexOf(":") > -1
                      ? encounterProvider?.provider?.display?.split(":")[0]
                      : encounterProvider?.provider?.display?.split("- ")[1],
                },
                encounterType: encounter.encounterType,
                conceptUuid: observation?.concept?.uuid || observation?.uuid,
              };
            }),
          ];

          const groupedObsByConcept = groupBy(formattedObs, "conceptUuid");
          const obs = Object.keys(groupedObsByConcept).map((key) => {
            return {
              uuid: key,
              history: orderBy(
                groupedObsByConcept[key],
                ["obsDatetime"],
                ["asc"]
              ),
              latest: orderBy(
                groupedObsByConcept[key],
                ["obsDatetime"],
                ["desc"]
              )[0],
            };
          });

          return {
            ...encounter,
            attributes: response?.attributes,
            keyedObs: keyBy(obs, "uuid"),
          };
        });
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getVisitObservationsByVisitUuid(parameters): Observable<any> {
    return from(
      this.api.visit.getVisit(parameters?.uuid, parameters?.query)
    ).pipe(
      map((response) => {
        let formattedObs = [];
        response.encounters.map((encounter: any) => {
          const encounterProvider = encounter?.encounterProviders[0];
          formattedObs = [
            ...formattedObs,
            ...encounter?.obs.map((observation) => {
              return {
                ...observation,
                encounterProvider: {
                  ...encounterProvider?.provider,
                  name:
                    encounterProvider?.provider &&
                    encounterProvider?.provider?.display?.indexOf(":") > -1
                      ? encounterProvider?.provider?.display?.split(":")[0]
                      : encounterProvider?.provider?.display?.split("- ")[1],
                },
                encounterType: encounter.encounterType,
                conceptUuid: observation?.concept?.uuid || observation?.uuid,
              };
            }),
          ];
        });
        const groupedObsByConcept = groupBy(formattedObs, "conceptUuid");
        const obs = Object.keys(groupedObsByConcept).map((key) => {
          return {
            uuid: key,
            history: orderBy(
              groupedObsByConcept[key],
              ["obsDatetime"],
              ["asc"]
            ),
            latest: orderBy(
              groupedObsByConcept[key],
              ["obsDatetime"],
              ["desc"]
            )[0],
          };
        });
        return keyBy(obs, "uuid");
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getVisitDiagnosesByVisitUuid(parameters: any): Observable<any> {
    return from(
      this.api.visit.getVisit(parameters?.uuid, parameters?.query)
    ).pipe(
      map((response) => {
        let formattedDiagnoses = [];
        response.encounters.map((encounter: any) => {
          const encounterProvider = encounter?.encounterProviders[0];
          formattedDiagnoses = [
            ...formattedDiagnoses,
            ...encounter?.diagnoses.map((diagnosis) => {
              return {
                ...diagnosis,
                encounterProvider: {
                  ...encounterProvider?.provider,
                  name:
                    encounterProvider?.provider &&
                    encounterProvider?.provider?.display?.indexOf(":") > -1
                      ? encounterProvider?.provider?.display?.split(":")[0]
                      : encounterProvider?.provider?.display?.split("- ")[1],
                },
                encounterType: encounter.encounterType,
              };
            }),
          ];
        });
        return formattedDiagnoses;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  updateVisitExisting(visitPayload): Observable<any> {
    let url = `visit/${visitPayload?.uuid}`;

    return this.httpClient.post(url, visitPayload).pipe(
      map((response) => {
        return response;
      }),
      catchError((e) => of(e))
    );
  }

  getLabVisits(
    queryParams?: any,
    startIndex?: number,
    limit?: number
  ): Observable<Visit[]> {
    return this.httpClient
      .get(`lab/visit?startIndex=${startIndex}&limit=${limit}`)
      .pipe(
        map((visitResponse) => {
          const results = visitResponse?.results;
          return (flatten(results) || []).map((visitResult: any) => {
            const formattedResult = {
              pager: null,
              ...visitResult,
              paymentType:
                (
                  visitResult?.attributes.filter(
                    (attribute) =>
                      attribute &&
                      attribute.display &&
                      attribute.display ===
                        "00000101IIIIIIIIIIIIIIIIIIIIIIIIIIII"
                  ) || []
                ).length > 0
                  ? "Insurance"
                  : "Cash",
            };
            return new Visit(formattedResult);
          });
        }),
        catchError((error) => {
          return of(error);
        })
      );
  }
  getPatientsVisitsByEncounterType(
    encounterTypeUuid: string
  ): Observable<any[]> {
    return this.httpClient
      .get(
        `icare/visit?encounterTypeUuid=${encounterTypeUuid}&includeDeadPatients=true`
      )
      .pipe(
        map((visitResults: any) => {
          console;
          return visitResults?.results.map((result) => {
            return {
              ...result,
              locationUuid: result?.location?.uuid,
            };
          });
        }),
        catchError((error) => {
          return of(error);
        })
      );
  }

  getAdmittedPatientsVisits(locationUuids): Observable<any> {
    return zip(
      ...locationUuids.map((locationUuid) => {
        return from(
          this.api.visit.getAllVisits({
            includeInactive: false,
            location: locationUuid,
            v: "custom:(uuid,startDatetime,stopDatetime,location:(uuid,display),patient:(uuid,display,identifiers,person,voided)",
          } as any)
        ).pipe(
          map((visitResults: any) => {
            return visitResults?.results.map((result) => {
              return {
                ...result,
                locationUuid: result?.location?.uuid,
              };
            });
          }),
          catchError((error) => {
            return of(error);
          })
        );
      })
    ).pipe(
      map((responses) => {
        return keyBy(flatten(responses), "locationUuid");
      })
    );
  }

  getAllVisits(
    location?: string | string[],
    includeInactive?: boolean,
    onlyInsurance?: boolean,
    queryParam?: string,
    startIndex?: number,
    limit?: number,
    orderType?: string,
    orderStatus?: string,
    orderStatusCode?: string,
    orderBy?: string,
    orderByDirection?: string,
    filterBy?: string,
    encounterType?: string,
    sampleCategory?: string,
    excludedSampleCategories?: string[],
    includeDeadPatients?: boolean
  ): Observable<any> {
    const locationUuids: any = isArray(location)
      ? location
      : location
      ? [location]
      : [];

    // Parameters for sorting
    let parametersString = "";
    if (orderBy) {
      parametersString += `&OrderBy=${orderBy}`;
    }
    if (orderStatus) {
      parametersString += `&fulfillerStatus=${orderStatus}`;
    }
    if (orderByDirection) {
      parametersString += `&orderByDirection=${orderByDirection}`;
    }
    if (orderStatusCode) {
      parametersString += `&orderStatusCode=${orderStatusCode}`;
    }
    if (orderType) {
      parametersString += `&orderTypeUuid=${orderType}`;
    }
    if (queryParam) {
      parametersString += `&q=${queryParam}`;
    }

    if (sampleCategory) {
      parametersString += `&sampleCategory=${sampleCategory}`;
    }
    if (filterBy) {
      parametersString += filterBy;
    }

    if (encounterType) {
      parametersString += `&encounterTypeUuid=${encounterType}`;
    }

    if (excludedSampleCategories && excludedSampleCategories?.length > 0) {
      parametersString += `&exclude=${excludedSampleCategories.join(",")}`;
    }
    if (includeDeadPatients && includeDeadPatients === true) {
      parametersString += `&includeDeadPatients=true`;
    }
    if (includeInactive && includeInactive === true) {
      parametersString += `&includeInactive=true`;
    }
    //
    // console.log("url fired  ...",`icare/visit?${parametersString.replace("&","" )}&startIndex=${startIndex}&limit=${limit}`);
    return (
      locationUuids?.length > 0
        ? zip(
            ...locationUuids.map((locationUuid) => {
              const locationParameter = `locationUuid=${locationUuid}`;
              return this.httpClient.get(
                `icare/visit?${locationParameter}${parametersString}&startIndex=${startIndex}&limit=${limit}`
              );
            })
          )
        : this.httpClient.get(
            `icare/visit?${parametersString.replace(
              "&",
              ""
            )}&startIndex=${startIndex}&limit=${limit}`
          )
    ).pipe(
      map((visitResponse: any) => {
        const results =
          locationUuids?.length > 0
            ? flatten(visitResponse.map((visitData) => visitData?.results))
            : visitResponse?.results;
        // TODO: Softcode Insurance attribute value (Concept UUID) - 00000101IIIIIIIIIIIIIIIIIIIIIIIIIIII
        return (
          (flatten(results) || [])
            .map((visitResult: any) => {
              const formattedResult = {
                pager:
                  locationUuids?.length > 0
                    ? visitResponse[0].links
                    : visitResponse?.links,
                ...visitResult,
                paymentType:
                  (
                    visitResult?.attributes.filter(
                      (attribute) =>
                        attribute &&
                        attribute?.display &&
                        attribute?.display ===
                          "00000101IIIIIIIIIIIIIIIIIIIIIIIIIIII"
                    ) || []
                  ).length > 0
                    ? "Insurance"
                    : "Cash",
              };
              return new Visit(formattedResult);
            })
            .filter((visit) =>
              !onlyInsurance ? visit : visit?.paymentType === "Insurance"
            ) || []
        );
      }),
      catchError((error) => {
        return of(error);
      })
    );
    // }
    return (
      locationUuids?.length > 0
        ? zip(
            ...locationUuids.map((locationUuid) => {
              return from(
                this.api.visit.getAllVisits({
                  includeInactive:
                    includeInactive === undefined ? false : includeInactive,
                  location: locationUuid,
                  v: "custom:(uuid,visitType,startDatetime,encounters:(uuid,diagnoses,encounterDatetime,encounterType,location,obs,orders),stopDatetime,attributes:(uuid,display),location:(uuid,display,tags,parentLocation:(uuid,display)),patient:(uuid,display,identifiers,person,voided)",
                  q: queryParam,
                  limit: limit ? limit : 100,
                  startIndex: startIndex ? startIndex : 0,
                } as any)
              ).pipe(
                map((result: any) => {
                  return result;
                })
              );
            })
          )
        : from(
            this.api.visit.getAllVisits({
              includeInactive:
                includeInactive === undefined ? false : includeInactive,
              v: "custom:(uuid,visitType,startDatetime,encounters:(uuid,diagnoses,encounterDatetime,encounterType,location,obs,orders),stopDatetime,attributes:(uuid,display),location:(uuid,display,tags,parentLocation:(uuid,display)),patient:(uuid,display,identifiers,person,voided)",
              q: queryParam,
              limit: limit ? limit : 100,
              startIndex: startIndex ? startIndex : 0,
            } as any)
          ).pipe(
            map((result: any) => {
              return result;
            })
          )
    ).pipe(
      map((visitResponse: any) => {
        const results =
          locationUuids?.length > 0
            ? flatten(visitResponse.map((visitData) => visitData?.results))
            : visitResponse?.results;
        return (
          (flatten(results) || [])
            .map((visitResult: any) => {
              const formattedResult = {
                pager:
                  locationUuids?.length > 0
                    ? visitResponse[0]?.links
                    : visitResponse?.links,
                ...visitResult,
                paymentType:
                  (
                    visitResult?.attributes.filter(
                      (attribute) =>
                        attribute &&
                        attribute.display &&
                        attribute.display?.indexOf("Insurance ID") > -1
                    ) || []
                  ).length > 0
                    ? "Insurance"
                    : "Cash",
              };
              return new Visit(formattedResult);
            })
            .filter((visit) =>
              !onlyInsurance ? visit : visit.paymentType === "Insurance"
            ) || []
        );
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  // getAllVisits(
  //   location?: string | string[],
  //   includeInactive?: boolean,
  //   onlyInsurance?: boolean,
  //   queryParam?: string,
  //   startIndex?: number,
  //   limit?: number,
  //   orderType?: string,
  //   orderStatus?: string,
  //   orderStatusCode?: string,
  //   orderBy?: string,
  //   orderByDirection?: string,
  //   filterBy?: string
  // ): Observable<Visit[]> {
  //   const locationUuids: any = isArray(location) ? location : [location];

  //   // Parameters for sorting
  //   const orderByParameter = orderBy ? `&OrderBy=${orderBy}` : "";
  //   const orderDirectionParameter = orderByDirection
  //     ? `&orderByDirection=${orderByDirection}`
  //     : "";
  //   const sortingParameters =
  //     orderByParameter || orderDirectionParameter
  //       ? orderByParameter + orderDirectionParameter
  //       : "";

  //   if (orderType) {
  //     const orderStatusParameter = orderStatus
  //       ? `&fulfillerStatus=${orderStatus}`
  //       : "";
  //     const orderStatusCodeParameter = orderStatusCode
  //       ? `&orderStatusCode=${orderStatusCode}`
  //       : "";
  //     const locationParameter = location ? `locationUuid=${location}&` : "";
  //     const orderTypeParameter = orderType ? `&orderTypeUuid=${orderType}` : "";

  //     return this.httpClient
  //       .get(
  //         `icare/visit?${locationParameter}${orderTypeParameter}${orderStatusParameter}${orderStatusCodeParameter}${sortingParameters}${filterBy}&startIndex=${startIndex}&limit=${limit}`
  //       )
  //       .pipe(
  //         map((visitResponse) => {
  //           const results = visitResponse?.results;
  //           return (flatten(results) || []).map((visitResult: any) => {
  //             const formattedResult = {
  //               pager: null,
  //               ...visitResult,
  //               paymentType:
  //                 (
  //                   visitResult?.attributes.filter(
  //                     (attribute) =>
  //                       attribute &&
  //                       attribute.display &&
  //                       attribute.display ===
  //                         "00000101IIIIIIIIIIIIIIIIIIIIIIIIIIII"
  //                   ) || []
  //                 ).length > 0
  //                   ? "Insurance"
  //                   : "Cash",
  //             };
  //             return new Visit(formattedResult);
  //           });
  //         })
  //       );
  //   }

  //   return zip(
  //     ...locationUuids.map((locationUuid) => {
  //       return from(
  //         this.api.visit.getAllVisits({
  //           includeInactive:
  //             includeInactive === undefined ? false : includeInactive,
  //           location: locationUuid,
  //           v: "custom:(uuid,visitType,startDatetime,encounters:(uuid,diagnoses,encounterDatetime,encounterType,location,obs,orders),stopDatetime,attributes:(uuid,display),location:(uuid,display,tags,parentLocation:(uuid,display)),patient:(uuid,display,identifiers,person,voided)",
  //           q: queryParam,
  //           limit: limit ? limit : 100,
  //           startIndex: startIndex ? startIndex : 0,
  //         } as any)
  //       ).pipe(
  //         map((result: any) => {
  //           return result;
  //         })
  //       );
  //     })
  //   ).pipe(
  //     map((visitResponse: any) => {
  //       const results = flatten(
  //         visitResponse.map((visitData) => visitData?.results)
  //       );
  //       return (
  //         (flatten(results) || [])
  //           .map((visitResult: any) => {
  //             const formattedResult = {
  //               pager: visitResponse[0].links,
  //               ...visitResult,
  //               paymentType:
  //                 (
  //                   visitResult?.attributes.filter(
  //                     (attribute) =>
  //                       attribute &&
  //                       attribute.display &&
  //                       attribute.display?.indexOf("Insurance ID") > -1
  //                   ) || []
  //                 ).length > 0
  //                   ? "Insurance"
  //                   : "Cash",
  //             };
  //             return new Visit(formattedResult);
  //           })
  //           .filter((visit) =>
  //             !onlyInsurance ? visit : visit.paymentType === "Insurance"
  //           ) || []
  //       );
  //     })
  //   );
  // }

  getPatientLoadByLocation(): Observable<{ [uuid: string]: number }> {
    return this.getAllVisits().pipe(
      map((visits) => {
        const patientLoad = {};

        (visits || []).forEach((visit) => {
          const locationUuid = visit?.location?.uuid;
          const availableLoad = patientLoad[locationUuid];

          patientLoad[locationUuid] = availableLoad ? availableLoad + 1 : 1;
        });

        return patientLoad;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  updateVisit(uuid, data): Observable<any> {
    return from(this.api.visit.updateVisit(uuid, data)).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  deleteVisit(uuid, purge: boolean = false): Observable<any> {
    return from(this.api.visit.deleteVisit(uuid, { purge: purge })).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  getVisitClaim(visitUuid) {
    return this.httpClient.get(`icare/visit/${visitUuid}/claimForm`).pipe(
      map((response) => {
        return {
          claimFile: this.domSanitizer.bypassSecurityTrustHtml(`<embed
              src="data:application/pdf;base64,${response?.claimFile}"
              type="application/pdf"
              width="100%"
              height="550px"
            />`),
          patientFile: this.domSanitizer.bypassSecurityTrustHtml(`<embed
            src="data:application/pdf;base64,${response?.patientFile}"
            type="application/pdf"
            width="100%"
            height="550px"
          />`),
        };
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  submitClaim(visitUuid): Observable<any> {
    return this.httpClient.get(`icare/visit/${visitUuid}/claim`).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  addVisitAttribute(data, visitUuid): Observable<any> {
    return this.httpClient.post(`visit/${visitUuid}`, data).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getVisitDetailsByVisitUuid(uuid: string, params?: any): Observable<any> {
    return from(this.api.visit.getVisit(uuid, params)).pipe(
      map((response) => {
        return new Visit(response);
      }),
      catchError((error) => of(error))
    );
  }

  getLastPatientVisit(
    patientUuid,
    shouldIncludeEncounter?: boolean
  ): Observable<any> {
    const encounters = shouldIncludeEncounter
      ? "encounters:(display,diagnoses,obs,orders,encounterDatetime,encounterType,location),"
      : "";
    return from(
      this.api.visit.getAllVisits({
        includeInactive: true,
        patient: patientUuid,
        v: `custom:(uuid,visitType,startDatetime,${encounters}attributes,stopDatetime,patient:(uuid,display,identifiers,person:(uuid,age,birthdate,gender,dead,preferredAddress:(cityVillage)),voided))`,
        limit: 2,
        startIndex: 0,
      } as any)
    ).pipe(
      map((visitResponse) => {
        return (
          visitResponse?.results.filter(
            (result: any) =>
              (result?.stopDatetime && visitResponse?.results?.length > 1) ||
              visitResponse?.results.length == 1
          ) || []
        )
          .map((visitResult: any) => new Visit(visitResult, null, null))
          .filter((visit) => visit)
          .map((response: any) => {
            const encounters = response?.visit?.encounters;
            // TODO: Find a way to set attributes to display on configurations
            const attributesToDisplay = [
              {
                name: "Insurance Id",
                uuid: "INSURANCEIDIIIIIIIIIIIIIIIIIIIIATYPE",
              },
              {
                name: "Authorization No.",
                uuid: "INSURANCEAUTHNOIIIIIIIIIIIIIIIIATYPE",
              },
              {
                name: "VOTE NO. or Company",
                uuid: "370e6cf0-539f-46f1-87a2-43446d8b17b0",
              },
            ];
            return {
              ...response,
              visit: {
                ...response?.visit,
                attributesToDisplay: response?.visit?.attributes.filter(
                  (attribute) =>
                    (
                      attributesToDisplay.filter(
                        (attributeToDisplay) =>
                          attributeToDisplay?.uuid ===
                          attribute?.attributeType?.uuid
                      ) || []
                    )?.length > 0
                ),
              },
            };
          });
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getAllPatientVisits(
    patient: string,
    includeInactive: boolean,
    omitCurrentVisit?: boolean
  ): Observable<any> {
    return zip(
      from(
        this.api.visit.getAllVisits({
          includeInactive: includeInactive,
          patient: patient,
          v: `custom:(uuid,visitType,location:(uuid,display,tags,parentLocation:(uuid,display)),startDatetime,attributes,stopDatetime,patient:(uuid,display,identifiers,person,voided),encounters:(uuid,form,location,obs:(accessionNumber,obsDatetime,comment,concept:(uuid,display,units,lowNormal,hiNormal),display,encounter,groupMembers,order,person,uuid,value,valueCodedName,valueModifier,voided),orders,diagnoses,encounterProviders,encounterDatetime,encounterType))`,
        } as any)
      )
    ).pipe(
      map((response: any[]) => {
        const visitResponse = response[0];

        const visits = (visitResponse?.results || [])
          .map((visitResult: any) => new Visit(visitResult, null, null))
          .filter((visit) => visit);
        return includeInactive && omitCurrentVisit
          ? orderBy(
              visits.filter(
                (visitDetails) => visitDetails?.visit?.stopDatetime
              ) || [],
              ["startDatetime"],
              ["desc"]
            )
          : includeInactive && !omitCurrentVisit
          ? visits
          : visits[0];
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  isThisFirstVisit(patient): Observable<boolean> {
    return from(
      this.api.visit.getAllVisits({
        includeInactive: true,
        patient,
        v: `custom:(uuid)`,
        limit: 2,
      } as any)
    ).pipe(
      map((response) => {
        return response?.results?.length > 1 ? false : true;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getCountOfPatientVisits(
    patient: string,
    includeInactive: boolean
  ): Observable<number> {
    return from(
      this.api.visit.getAllVisits({
        includeInactive: includeInactive,
        patient,
        v: `custom:(uuid)`,
      } as any)
    ).pipe(
      map((response) => {
        return response?.results?.length;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getActiveVisit(
    patient: string,
    includeInactive: boolean,
    omitCurrentVisit?: boolean,
    shouldNotLoadNonVisitItems?: boolean
  ): Observable<any> {
    // TODO Load order separately to allow inclusion of more attributes
    // https://icare.dhis2udsm.org/openmrs/ws/rest/v1/order?patient=${patient}&v=full
    return zip(
      from(
        this.api.visit.getAllVisits({
          includeInactive: includeInactive,
          patient,
          v: `custom:(uuid,visitType,location:(uuid,display,tags,parentLocation:(uuid,display)),startDatetime,attributes,stopDatetime,patient:(uuid,display,identifiers,person,voided),encounters:(uuid,form,location,obs:(accessionNumber,obsDatetime,comment,concept:(uuid,display,units,lowNormal,hiNormal,setMembers:(uuid,display,units,lowNormal,hiNormal)),display,encounter,groupMembers,order,person,uuid,value,valueCodedName,valueModifier,voided),orders,diagnoses,encounterProviders,encounterDatetime,encounterType,voided,voidReason))`,
        } as any)
      ),
      shouldNotLoadNonVisitItems
        ? of([])
        : this.billingService.getPatientBills(patient),
      shouldNotLoadNonVisitItems
        ? of([])
        : this.paymentService.getPatientPayments(patient)
    ).pipe(
      map((response: any[]) => {
        const visitResponse = response[0];
        const patientBills = response[1];
        const patientPayments = response[2];

        const visits = (visitResponse?.results || [])
          .map(
            (visitResult: any) =>
              new Visit(visitResult, patientBills, patientPayments)
          )
          .filter((visit) => visit);
        return includeInactive && omitCurrentVisit
          ? visits.filter(
              (visitDetails) => visitDetails?.visit?.stopDatetime
            ) || []
          : includeInactive && !omitCurrentVisit
          ? visits
          : visits[0];
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  async getActiveVisitDetails(patientUuid: string, fields): Promise<any> {
    const visitDetails = await this.api.visit.getAllVisits({
      includeInactive: false,
      patient: patientUuid,
      v: fields,
    } as any);
    const visit = (visitDetails?.results || [])[0];
    return getDrugOrdersFromCurrentVisitEncounters(visit);
  }

  getActiveVisitProcedures(
    uuid: string,
    fields: any,
    bills?: any,
    isEnsured?: boolean
  ): Observable<any> {
    return from(
      this.api.visit.getVisit(uuid, {
        v: fields,
      })
    ).pipe(
      map((response) => {
        return getOrdersFromCurrentVisitEncounters(
          response,
          "procedure",
          bills,
          isEnsured
        );
      }),
      catchError((error) => of(error))
    );
  }

  getActiveVisitRadiologyOrders(uuid: string, fields: any): Observable<any> {
    return from(
      this.api.visit.getVisit(uuid, {
        v: fields,
      })
    ).pipe(
      map((response) => {
        return getOrdersFromCurrentVisitEncounters(response, "radiology");
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  /**TODO: Move to admission shared service */

  admitPatient(data): Observable<any> {
    // console.log("data", data);
    let encounterData: any = {
      ...data,
      encounterProviders: [
        {
          provider: data?.provider,
          encounterRole: ICARE_CONFIG.encounterRole.uuid,
        },
      ],
    };
    encounterData = omit(encounterData, "provider");
    encounterData = omit(encounterData, "visitLocation");
    return from(this.api.encounter.createEncounter(encounterData)).pipe(
      map((response) => response),
      catchError((err) => of(err))
    );
  }
  // this.store.dispatch(updateVisit({ details: visitDetails, visitUuid }));
  dischargePatient(data): Observable<any> {
    let encounterData: any = {
      ...data,
      encounterProviders: [
        {
          provider: data?.provider,
          encounterRole: ICARE_CONFIG.encounterRole.uuid,
        },
      ],
    };
    encounterData = omit(encounterData, "provider");
    return from(this.api.encounter.createEncounter(encounterData)).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  createBedOrder(data): Observable<any> {
    let encounterData: any = {
      ...data,
      encounterProviders: [
        {
          provider: data?.provider,
          encounterRole: ICARE_CONFIG.encounterRole.uuid,
        },
      ],
    };
    encounterData = omit(encounterData, "provider");
    return from(this.api.encounter.createEncounter(encounterData)).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  transferPatient(data): Observable<any> {
    const encounterData: any = {
      obs: data?.obs,
      orders: data?.orders,
      patient: data?.patient,
      encounterType: !data?.encounterType
        ? ICARE_CONFIG.transfer.encounterTypeUuid
        : data?.encounterType,
      location: data.location,
      visit: data?.visit,
      form: data?.form,
      encounterProviders: [
        {
          provider: data?.provider,
          encounterRole: ICARE_CONFIG.encounterRole.uuid,
        },
      ],
    };
    return from(this.api.encounter.createEncounter(encounterData)).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getVisitsTypes(): Observable<any> {
    return from(
      this.api.visittype.getAllVisitTypes({
        v: "custom:(uuid,name,display)",
      } as any)
    ).pipe(
      map((response) => {
        return response?.results;
      }),
      catchError((error) => of(error))
    );
  }

  createVisitAttribute(visitUuid: string, visitAttribute): Observable<any> {
    return from(
      this.api.visit.createVisitAttribute(visitUuid, visitAttribute)
    ).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  getSamplesByVisitUuid(visitUuid: string, parameters: any): Observable<any[]> {
    let queryParams = [];
    Object.keys(parameters)?.map((key) => {
      queryParams = [...queryParams, key + "=" + parameters[key]];
    });
    return this.httpClient
      .get("lab/samples?visit=" + visitUuid + "&" + queryParams.join("&"))
      ?.pipe(
        map((response) => {
          return (response?.results ? response?.results : response)?.map(
            (sample) => {
              return {
                ...sample,
                accepted:
                  (
                    sample?.statuses?.filter(
                      (status) => status?.category?.toLowerCase() === "accepted"
                    ) || []
                  )?.length > 0,
                rejected:
                  (
                    sample?.statuses?.filter(
                      (status) => status?.category?.toLowerCase() === "rejected"
                    ) || []
                  )?.length > 0,
                hasResults:
                  (
                    sample?.statuses?.filter(
                      (status) =>
                        status?.category?.toLowerCase() === "has_results"
                    ) || []
                  )?.length > 0,
                authorized:
                  (
                    sample?.statuses?.filter(
                      (status) => status?.status?.toLowerCase() === "authorized"
                    ) || []
                  )?.length > 0,
                approved:
                  (
                    sample?.statuses?.filter(
                      (status) => status?.status?.toLowerCase() === "approved"
                    ) || []
                  )?.length > 0,
              };
            }
          );
        })
      );
  }
}