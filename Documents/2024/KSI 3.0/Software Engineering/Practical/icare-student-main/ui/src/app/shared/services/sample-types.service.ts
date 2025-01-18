import { Injectable } from "@angular/core";

import * as _ from "lodash";
import { HttpClient } from "@angular/common/http";
import { Observable, pipe, from, of, zip } from "rxjs";
import { BASE_URL } from "../constants/constants.constants";
import { delay, mergeMap, map } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { ConceptsService } from "../resources/concepts/services/concepts.service";

@Injectable({
  providedIn: "root",
})
export class SampleTypesService {
  constructor(
    private httpClient: HttpClient,
    private store: Store,
    private conceptsService: ConceptsService
  ) {}

  getSampleTypeUuid() {
    return this.httpClient.get(
      BASE_URL + "systemsetting?q=iCare.laboratory.configurations&v=full"
    );
  }

  getLabConfigurations(): Observable<any> {
    return from(
      this.httpClient
        .get(
          BASE_URL + "systemsetting?q=iCare.laboratory.configurations&v=full"
        )
        .pipe(delay(1000))
        .toPromise()
    );
  }

  getCodedRejectionReasons(): Observable<any> {
    return zip(
      this.httpClient
        .get(
          BASE_URL + "systemsetting?q=iCare.laboratory.configurations&v=full"
        )
        .pipe(map((response: any) => response?.results[0])),
      this.httpClient
        .get(BASE_URL + "systemsetting?q=iCare.LIS&v=full")
        .pipe(map((response: any) => response?.results[0]))
    ).pipe(
      mergeMap((configs: any) => {
        let parsedConfigs = configs[0]
          ? JSON.parse(configs[0]?.value) || {}
          : {};

        const isLIS = configs[1] && configs[1]?.value === "true" ? true : false;

        return parsedConfigs?.sampleRejectionReasonsCoded && !isLIS
          ? this.httpClient
              .get(
                BASE_URL +
                  "concept/" +
                  configs?.sampleRejectionReasonsCoded +
                  "?v=custom:(uuid,display,answers:(uuid,display))"
              )
              .pipe(map((response: any) => response?.answers || []))
          : this.conceptsService.getConceptsBySearchTerm(
              "SAMPLE_REJECTION_REASONS"
            );
      })
    );
  }

  async loadSampleTypes(id) {
    return await this.httpClient
      .get(BASE_URL + id)
      .pipe(delay(1000))
      .toPromise();
  }

  getSampleTypes(): Observable<any> {
    return zip(
      this.httpClient
        .get(
          BASE_URL + "systemsetting?q=iCare.laboratory.configurations&v=full"
        )
        .pipe(map((response: any) => response?.results[0])),
      this.httpClient
        .get(BASE_URL + "systemsetting?q=iCare.LIS&v=full")
        .pipe(map((response: any) => response?.results[0]))
    ).pipe(
      mergeMap((configs: any) => {
        let parsedConfigs = configs[0]
          ? JSON.parse(configs[0]?.value) || {}
          : {};

        const isLIS = configs[1] && configs[1]?.value === "true" ? true : false;
        return parsedConfigs?.sampleTypes &&
          parsedConfigs?.sampleTypes?.id &&
          !isLIS
          ? this.httpClient
              .get(
                BASE_URL +
                  "concept/" +
                  parsedConfigs["sampleTypes"].id +
                  "?v=custom:(uuid,display,setMembers:(uuid,display,answers:(uuid,display),setMembers:(uuid,display,answers:(uuid,display),setMembers:(uuid,display,conceptClass,datatype,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units,numeric,descriptions,allowDecimal,displayPrecision,attributes:(uuid,display,value,attributeType:(uuid,display)),answers:(uuid,display)))))"
              )
              .pipe(map((sampleTypes) => sampleTypes["setMembers"]))
          : this.conceptsService.getConceptsBySearchTerm("SPECIMEN_SOURCE");
      })
    );
  }

  getLabDepartments(): Observable<any> {
    return zip(
      this.httpClient
        .get(
          BASE_URL + "systemsetting?q=iCare.laboratory.configurations&v=full"
        )
        .pipe(map((response: any) => response?.results[0])),
      this.httpClient
        .get(BASE_URL + "systemsetting?q=iCare.LIS&v=full")
        .pipe(map((response: any) => response?.results[0]))
    ).pipe(
      mergeMap((configs: any) => {
        let parsedConfigs = configs[0]
          ? JSON.parse(configs[0]?.value) || {}
          : {};
        const isLIS = configs[1] && configs[1]?.value === "true" ? true : false;
        return parsedConfigs?.labDepartments && !isLIS
          ? this.httpClient
              .get(
                BASE_URL +
                  "concept/" +
                  parsedConfigs["labDepartments"] +
                  "?v=custom:(uuid,display,setMembers:(uuid,display,answers:(uuid,display),setMembers:(uuid,display,answers:(uuid,display),setMembers:(uuid,display,conceptClass,datatype,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units,numeric,descriptions,allowDecimal,displayPrecision,attributes:(uuid,display,value,attributeType:(uuid,display)),answers:(uuid,display)))))"
              )
              .pipe(
                map((departments: any) => {
                  const excludedDepartmentsKeyedById = _.keyBy(
                    parsedConfigs?.excludedDepartments,
                    "id"
                  );
                  return {
                    ...departments,
                    setMembers: departments?.setMembers.filter(
                      (member) => !excludedDepartmentsKeyedById[member?.uuid]
                    ),
                  };
                })
              )
          : this.conceptsService.getConceptsBySearchTerm("LAB_DEPARTMENT");
      })
    );
  }

  testSave(data) {
    this.httpClient
      .post(BASE_URL + "bahmnicore/bahmniencounter", data)
      .subscribe((response) => {});
  }
}
