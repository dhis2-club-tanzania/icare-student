import { Injectable } from "@angular/core";

import * as _ from "lodash";
import { HttpClient } from "@angular/common/http";
import { from, Observable, of, zip } from "rxjs";
import { BASE_URL } from "../constants/constants.constants";
import { catchError, delay, map } from "rxjs/operators";
import {
  LabSample,
  SampleObject,
} from "src/app/modules/laboratory/resources/models";
import { formatSample } from "../helpers/lab-samples.helper";
import { OpenmrsHttpClientService } from "../modules/openmrs-http-client/services/openmrs-http-client.service";

@Injectable({
  providedIn: "root",
})
export class SamplesService {
  constructor(
    private httpClient: HttpClient,
    private opeMRSHttpClientService: OpenmrsHttpClientService
  ) {}

  getLabSamplesByCollectionDates(
    dates: any,
    category?: string,
    hasStatus?: string,
    excludeAllocations?: boolean,
    tabType?:string,
    excludedSampleCategories?: string[],
    pagerInfo?: any,
    otherParams?: {
      departments: any[];
      specimenSources: any[];
      codedRejectionReasons: any[];
    },
    acceptedBy?: string,
    q?: string,
    department?: string,
    testUuid?: string,
    instrument?: string,
    specimenUuid?: string,
    locationUuid?: string
  ): Observable<any> {
    let parameters = [];
    if (pagerInfo) {
      parameters = [...parameters, "page=" + pagerInfo?.page];
      parameters = [...parameters, "pageSize=" + pagerInfo?.pageSize];
    } else {
      parameters = [...parameters, "paging=false"];
    }

    if (dates && dates?.startDate && dates?.endDate) {
      parameters = [...parameters, "startDate=" + dates?.startDate];
      parameters = [...parameters, "endDate=" + dates?.endDate];
    }

    if (category) {
      parameters = [...parameters, "sampleCategory=" + category];
    }

    if (hasStatus) {
      parameters = [...parameters, "hasStatus=" + hasStatus];
    }

    if (acceptedBy) {
      parameters = [...parameters, "acceptedBy=" + acceptedBy];
    }

    if(excludedSampleCategories && tabType === 'result-entry'){
      excludedSampleCategories = ['RESULT_AUTHORIZATION'];
      parameters = [...parameters,"excludeStatus=" +excludedSampleCategories]
    }

    if (q) {
      parameters = [...parameters, "q=" + q];
    }

    if (department) {
      parameters = [...parameters, "department=" + department];
    }

    if (testUuid) {
      parameters = [...parameters, "test=" + testUuid];
    }

    if (instrument) {
      parameters = [...parameters, "instrument=" + instrument];
    }

    if (specimenUuid) {
      parameters = [...parameters, "specimen=" + specimenUuid];
    }

    // if (locationUuid) {
    //   parameters = [...parameters, "location=" + locationUuid];
    // }

    if (excludeAllocations) {
      parameters = [...parameters, "excludeAllocations=true"];
    } else {
      parameters = [...parameters, "excludeAllocations=true"];
    }
    return this.httpClient
      .get(
        BASE_URL +
          `lab/samples?${parameters?.length > 0 ? parameters?.join("&") : ""}`
      )
      .pipe(
        map((response: any) => {
          return {
            pager: response?.pager,
            results: response?.results?.map((result) =>
              new LabSample(
                result,
                otherParams?.departments,
                otherParams?.specimenSources,
                otherParams?.codedRejectionReasons
              ).toJSon()
            ),
          };
        })
      );
  }

  getSampleByUuid(uuid: string): Observable<any> {
    return this.opeMRSHttpClientService.get(`lab/sample/${uuid}`).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getFormattedSampleByUuid(
    uuid: string,
    departments: any[],
    specimenSources: any[],
    codedRejectedReasons: any[]
  ): Observable<any> {
    return this.opeMRSHttpClientService.get(`lab/sample/${uuid}`).pipe(
      map((response) =>
        new LabSample(
          response,
          departments,
          specimenSources,
          codedRejectedReasons
        ).toJSon()
      ),
      catchError((error) => of(error))
    );
  }

  saveSampleStatus(data: any): Observable<any> {
    return this.opeMRSHttpClientService.post("lab/samplestatus", data).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getSampleLabel(): Observable<string> {
    return this.httpClient.get(`${BASE_URL}lab/samplelable`).pipe(
      map((response: { label: number }) => {
        return response?.label;
      }),
      catchError((error) => of(error))
    );
  }

  getIncreamentalSampleLabel(): Observable<string> {
    return this.opeMRSHttpClientService.get(`lab/sampleidgen`).pipe(
      map((response) => {
        return response?.label.toString();
      }),
      catchError((error) => of(error))
    );
  }

  createLabSample(sample: any): Observable<SampleObject> {
    return this.httpClient.post(BASE_URL + "lab/sample", sample).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
    // return of(sample);
  }

  createSampleOrder(sampleOrder): Observable<any> {
    return this.httpClient.post(BASE_URL + "lab/sampleorder", sampleOrder).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  getTestTimeSettings(conceptUuid: string) {
    return this.httpClient.get(
      `${BASE_URL}lab/testtime?concept=${conceptUuid}`
    );
  }

  getSampleByVisit(visit) {
    return this.httpClient.get(BASE_URL + `lab/sample?visit=${visit}`).pipe(
      map((response: any) => response?.results),
      catchError((error) => of(error))
    );
  }

  getSampleByStatusCategory(
    sampleCategory?: string,
    testCategory?: string,
    startDate?: any,
    endDate?: any,
    formattingInfo?: any,
    paging?: boolean,
    page?: number,
    pageSize?: number
  ) {
    let queryParams = [];
    if (sampleCategory) {
      queryParams = [...queryParams, `sampleCategory=${sampleCategory}`];
    }

    if (testCategory) {
      queryParams = [...queryParams, `testCategory=${testCategory}`];
    }

    if (startDate) {
      queryParams = [...queryParams, `startDate=${startDate}`];
    }

    if (endDate) {
      queryParams = [...queryParams, `endDate=${endDate}`];
    }

    if (paging) {
      queryParams = [...queryParams, `paging=${paging}`];
    } else {
      queryParams = [...queryParams, `paging=false`];
    }

    if (page) {
      queryParams = [...queryParams, `page=${page}`];
    }

    if (pageSize) {
      queryParams = [...queryParams, `pageSize=${pageSize}`];
    }
    return this.httpClient
      .get(BASE_URL + `lab/sample?${queryParams.join("&")}`)
      .pipe(
        map((response: any) => {
          return _.map(response, (sample) => {
            return formatSample(sample, formattingInfo);
          });
        }),
        catchError((error) => of(error))
      );
  }

  collectSample(data): Observable<any> {
    return this.httpClient.post(BASE_URL + "lab/sample", data);
  }

  getSamplesByPaginationDetails(
    paginationParameters: { page: number; pageSize: number },
    dates?: { startDate: string; endDate: string },
    searchText?: string,
    departments?: any[],
    specimenSources?: any[],
    codedSampleRejectionReasons?: any[],
    excludeAllocations?: boolean
  ): Observable<{ pager: any; results: any[] }> {
    let queryParams = [];
    if (paginationParameters && paginationParameters?.page) {
      queryParams = [...queryParams, `page=${paginationParameters?.page}`];
    }

    if (paginationParameters && paginationParameters?.pageSize) {
      queryParams = [
        ...queryParams,
        `pageSize=${paginationParameters?.pageSize}`,
      ];
    }

    if (searchText && searchText.length > 0) {
      queryParams = [...queryParams, `q=${searchText}`];
    }
    if (dates && dates?.startDate) {
      queryParams = [...queryParams, `startDate=${dates?.startDate}`];
    }

    if (dates && dates?.endDate) {
      queryParams = [...queryParams, `endDate=${dates?.endDate}`];
    }

    if (excludeAllocations) {
      queryParams = [...queryParams, "excludeAllocations=true"];
    } else {
      queryParams = [...queryParams, "excludeAllocations=true"];
    }
    return this.httpClient
      .get(BASE_URL + `lab/samples?${queryParams?.join("&")}`)
      .pipe(
        map((response: any) => {
          return {
            ...response,
            results: response?.results?.map((result) => {
              return new LabSample(
                result,
                departments,
                specimenSources,
                codedSampleRejectionReasons
              ).toJSon();
            }),
          };
        }),
        catchError((error) => of(error))
      );
  }

  getCollectedSamplesByPaginationDetails(
    paginationParameters: { page: number; pageSize: number },
    dates?: { startDate: string; endDate: string },
    excludeAllocations?: boolean
  ): Observable<{ pager: any; results: any[] }> {
    let queryParams = [];
    if (paginationParameters && paginationParameters?.page) {
      queryParams = [...queryParams, `page=${paginationParameters?.page}`];
    }

    if (paginationParameters && paginationParameters?.pageSize) {
      queryParams = [
        ...queryParams,
        `pageSize=${paginationParameters?.pageSize}`,
      ];
    }

    if (dates && dates?.startDate) {
      queryParams = [...queryParams, `startDate=${dates?.startDate}`];
    }

    if (dates && dates?.endDate) {
      queryParams = [...queryParams, `endDate=${dates?.endDate}`];
    }

    if (excludeAllocations) {
      queryParams = [...queryParams, "excludeAllocations=true"];
    } else {
      queryParams = [...queryParams, "excludeAllocations=true"];
    }
    return this.httpClient
      .get(BASE_URL + `lab/samples?${queryParams?.join("&")}`)
      .pipe(
        map((response: any) => response),
        catchError((error) => of(error))
      );
  }

  setMultipleSampleStatuses(statuses: any[]): Observable<any> {
    if (statuses) {
      return zip(
        ...statuses.map((status) => {
          return this.httpClient.post(BASE_URL + "lab/samplestatus", status);
        })
      ).pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
    } else {
      return from([null]);
    }
  }

  saveSampleStatuses(statusesData): Observable<any> {
    if (statusesData) {
      return zip(
        ...statusesData.map((status) => {
          return this.httpClient.post(BASE_URL + "lab/samplestatus", status);
        })
      ).pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
    } else {
      return from([null]);
    }
  }

  setSampleStatus(data): Observable<any> {
    if (data) {
      return this.httpClient.post(BASE_URL + "lab/samplestatus", data).pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
    } else {
      return from([null]);
    }
  }

  acceptSampleAndCreateAllocations(statusWithAllocations: {
    status?: any;
    allocations?: any[];
  }): Observable<any> {
    return this.httpClient.post(
      BASE_URL + "lab/sampleaccept",
      statusWithAllocations
    );
  }

  saveTestContainerAllocation(orders, configs): Observable<any> {
    /** TODO: Find a way to handle lab tests missing containers */
    let newOrdersForReference = [];
    let allocations = [];
    _.each(orders, (order) => {
      if (order?.order?.concept?.setMembers?.length === 0) {
        newOrdersForReference = [...newOrdersForReference, order];
        allocations = [
          ...allocations,
          {
            order: {
              uuid: order?.order?.uuid,
            },
            container: {
              uuid: order?.containerDetails
                ? order?.containerDetails?.uuid
                : configs["otherContainer"]?.uuid,
            },
            sample: {
              uuid: order?.sample?.uuid,
            },
            concept: {
              uuid: order?.order?.concept?.uuid,
            },
            label: order?.order?.orderNumber,
          },
        ];
      } else {
        _.each(order?.order?.concept?.setMembers, (setMember) => {
          newOrdersForReference = [...newOrdersForReference, order];
          allocations = [
            ...allocations,
            {
              order: {
                uuid: order?.order?.uuid,
              },
              container: {
                uuid: order?.containerDetails
                  ? order?.containerDetails?.uuid
                  : configs["otherContainer"]?.uuid,
              },
              sample: {
                uuid: order?.sample?.uuid,
              },
              concept: {
                uuid: setMember?.uuid,
              },
              label: order?.order?.orderNumber,
            },
          ];
        });
      }
    });

    return zip(
      ...allocations.map((data, index) => {
        return this.httpClient.post(BASE_URL + "lab/allocation", data).pipe(
          map((response: any) => {
            return {
              ...newOrdersForReference[index],
              allocations: [
                {
                  ...response,
                  allocationUuid: response?.uuid,
                  results: [],
                },
              ],
            };
          })
        );
      })
    );
  }

  saveLabResult(result): Observable<any> {
    return this.httpClient.post(BASE_URL + "lab/results", result);
  }

  saveLabResults(results): Observable<any> {
    return zip(
      ...results?.map((result) => {
        return this.httpClient.post(BASE_URL + "lab/results", result);
      }),
      catchError((error) => of(error))
    );
  }

  saveLabResultStatus(resultStatus): Observable<any> {
    return this.httpClient.post(
      BASE_URL + "lab/allocationstatus",
      resultStatus
    );
  }

  saveLabResultStatuses(resultStatuses): Observable<any> {
    return zip(
      ...resultStatuses?.map((resultStatus) => {
        return this.httpClient.post(
          BASE_URL + "lab/allocationstatus",
          resultStatus
        );
      })
    );
  }

  async getData(id) {
    return await this.httpClient
      .get(
        BASE_URL +
          "visit/" +
          id +
          "?v=custom:(uuid,display,encounters:(uuid,display,obs,orders,patient,location,encounterType),patient,location,visitType)"
      )
      .pipe(delay(1000))
      .toPromise();
  }

  getVisitsDetailsFromBilling2(): Observable<any> {
    const data = new Observable((observer) => {
      this.httpClient
        .get(
          BASE_URL +
            "billing/quotation/read/dates/indexed?endDate=2020-09-26&endIndex=10&isAscending=false&startDate=2020-09-18&startIndex=1"
        )
        .subscribe(
          (patientsBillingInfos: any) => {
            if (patientsBillingInfos) {
              let idsLoaded = {};
              let allVisitsData = [];
              _.each(patientsBillingInfos, (billingInfo) => {
                idsLoaded[billingInfo.visit.uuid]
                  ? ""
                  : this.getData(billingInfo.visit.uuid).then((data) => {
                      allVisitsData = [...allVisitsData, data];
                      observer.next(allVisitsData);
                    });
                idsLoaded[billingInfo.visit.uuid] = billingInfo.visit.uuid;
              });
            }
          },
          (error) => {
            observer.error(error);
          }
        );
    });
    return data;
  }

  getTodaysSampleLabels(): Observable<any> {
    return this.httpClient
      .get(BASE_URL + "bahmnicore/sql?q=laboratory.sqlGet.todaysSampleLabels")
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((e) => {
          return of(e);
        })
      );
  }

  createBatchsets(batchset: any): Observable<any> {
    return this.httpClient.post(BASE_URL + "lab/batchsets", batchset).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return err;
      })
    );
  }

  getBatchsets(): Observable<any> {
    return this.httpClient.get(BASE_URL + "lab/batchsets").pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return err;
      })
    );
  }

  createBatch(batch: any): Observable<any> {
    return this.httpClient.post(BASE_URL + "lab/batches", batch).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return err;
      })
    );
  }

  getBatchDetailsByUuid(uuid: string): Observable<any> {
    return this.opeMRSHttpClientService.get(`lab/batches?uuid=${uuid}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getBatchSamplesByUuid(uuid: string): Observable<any> {
    return this.opeMRSHttpClientService
      .get(`lab/batchSample?uuid=${uuid}`)
      .pipe(
        map((response: any) => {
          return {
            ...response,
            samples: response?.samples?.map((sample: any) => {
              return {
                ...sample,
                orders: sample?.orders?.map((order) => {
                  const orderDetails = {
                    ...order,
                    order: {
                      ...order?.order,
                      concept: {
                        ...order?.order?.concept,
                        display:
                          order?.order?.concept?.display?.indexOf(":") > -1
                            ? order?.order?.concept?.display?.split(":")[1]
                            : order?.order?.concept?.display,
                      },
                    },
                  };
                  return orderDetails;
                }),
              };
            }),
          };
        })
      );
  }

  getBatches(
    startDate?: string,
    endDate?: string,
    q?: string
  ): Observable<any> {
    let startDateParam = startDate?.length ? `?startDate=${startDate}` : "";
    let endDateParam =
      endDate?.length && startDateParam.length
        ? `&endDate=${endDate}`
        : endDate?.length
        ? `&endDate=${endDate}`
        : "";
    let qParam =
      q?.length && (startDateParam.length || endDateParam.length)
        ? `&q=${q}`
        : q?.length
        ? `?q=${q}`
        : "";
    const queryParams = startDateParam + endDateParam + qParam;
    return this.httpClient.get(BASE_URL + "lab/batches" + queryParams).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return err;
      })
    );
  }

  getBatchSamples(
    batchUuid?: string,
    startDate?: string,
    endDate?: string,
    q?: string
  ): Observable<any> {
    let startDateParam = startDate?.length ? `?startDate=${startDate}` : "";
    let endDateParam =
      endDate?.length && startDateParam.length
        ? `&endDate=${endDate}`
        : endDate?.length
        ? `&endDate=${endDate}`
        : "";
    let qParam =
      q?.length && (startDateParam.length || endDateParam.length)
        ? `&q=${q}`
        : q?.length
        ? `?q=${q}`
        : "";
    let batchParam =
      q || endDate || startDate
        ? `&batchUuid=${batchUuid}`
        : `?batchUuid=${batchUuid}`;
    const queryParams = startDateParam + endDateParam + qParam + batchParam;
    return this.httpClient
      .get(BASE_URL + "lab/batchsamples" + queryParams)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          return err;
        })
      );
  }

  createBatchSample(batchSampleObject): Observable<any> {
    return this.httpClient
      .post(BASE_URL + "lab/batchsamples", batchSampleObject)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          return err;
        })
      );
  }

  getSampledOrdersByVisit(visitUuid: string): Observable<any[]> {
    return this.opeMRSHttpClientService
      .get(`lab/sampledorders/${visitUuid}`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          return err;
        })
      );
  }
}
