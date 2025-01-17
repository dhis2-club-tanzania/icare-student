import { Injectable } from "@angular/core";

import * as _ from "lodash";
import { HttpClient } from "@angular/common/http";
import { forkJoin, from, Observable, of, zip } from "rxjs";
import { BASE_URL } from "../constants/constants.constants";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class VisitsService {
  constructor(private httpClient: HttpClient) {}

  getActiveVisitDetails(uuids): Observable<any> {
    return zip(
      ...uuids.map((uuid) => {
        return from(
          this.httpClient.get(
            BASE_URL +
              "visit/" +
              uuid +
              "?v=custom:(uuid,startDatetime,display,patient,encounters:(uuid,location:(uuid,display),encounterType,display,patient,visit,encounterProviders,encounterDatetime,voided,voidReason,obs,orders:(uuid,display,orderer,dateActivated,orderNumber,concept:(uuid,display,conceptClass,datatype,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units,numeric,descriptions,allowDecimal,displayPrecision,answers,setMembers:(uuid,display),answers:(uuid,display)),display)),voided,attributes,visitType)"
          )
        );
      })
    );

    return from(uuids).pipe(
      mergeMap((uuid) =>
        this.httpClient.get(
          BASE_URL +
            "visit/" +
            uuid +
            "?v=custom:(uuid,startDatetime,display,patient,encounters:(uuid,location:(uuid,display),encounterType,display,patient,visit,encounterProviders,encounterDatetime,voided,obs,orders:(uuid,display,orderer,dateActivated,orderNumber,concept:(uuid,display,conceptClass,datatype,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units,numeric,descriptions,allowDecimal,displayPrecision,answers,setMembers:(uuid,display),answers:(uuid,display)),display)),voided,attributes,visitType)"
        )
      )
    );
  }

  getActiveVisitsByStartDate(startDate, endDate): Observable<any> {
    // console.log(new Date(startDate))
    // console.log(new Date(endDate))
    return this.httpClient.get(
      BASE_URL +
        "bahmnicore/sql?q=laboratory.sqlGet.patientsWithLabOrdersByCollectionStatus&visitStartDate=" +
        startDate +
        "&visitEndDate=" +
        endDate +
        "T23:59:59"
    );
  }

  getLabOrdersDetailsByVisitsDates(startDate, endDate): Observable<any> {
    return this.httpClient.get(
      BASE_URL +
        "bahmnicore/sql?q=laboratory.sqlGet.labOrdersDetailsByVisitsDates&visitStartDate=" +
        startDate +
        "&visitEndDate=" +
        endDate +
        "T23:59:59"
    );
  }

  getLabOrdersPaymentDetails(startDate, endDate): Observable<any> {
    return this.httpClient.get(
      BASE_URL +
        "bahmnicore/sql?q=laboratory.sqlGet.labOrdersPaymentDetails&visitStartDate=" +
        startDate +
        "&visitEndDate=" +
        endDate +
        "T23:59:59"
    );
  }

  getPatientsEncounteredForLabService(startDate, endDate): Observable<any> {
    return this.httpClient.get(
      BASE_URL +
        "bahmnicore/sql?q=laboratory.sqlGet.patientsEncounteredForLabServices&visitStartDate=" +
        startDate +
        "&visitEndDate=" +
        endDate +
        "T23:59:59"
    );
  }

  getLabVisitsWithOrdersInformation(startDate, endDate): Observable<any> {
    return forkJoin(
      this.httpClient.get(
        BASE_URL +
          "bahmnicore/sql?q=laboratory.sqlGet.patientsEncounteredForLabServices&visitStartDate=" +
          startDate +
          "&visitEndDate=" +
          endDate +
          "T23:59:59"
      ),
      this.httpClient.get(
        BASE_URL +
          "bahmnicore/sql?q=laboratory.sqlGet.labOrdersPaymentDetails&visitStartDate=" +
          startDate +
          "&visitEndDate=" +
          endDate +
          "T23:59:59"
      ),
      this.httpClient.get(
        BASE_URL +
          "bahmnicore/sql?q=laboratory.sqlGet.labOrdersDetailsByVisitsDates&visitStartDate=" +
          startDate +
          "&visitEndDate=" +
          endDate +
          "T23:59:59"
      ),
      this.httpClient.get(
        BASE_URL +
          "bahmnicore/sql?q=laboratory.sqlGet.labOrdersSampleDetailsByVisitsDates&visitStartDate=" +
          startDate +
          "&visitEndDate=" +
          endDate +
          "T23:59:59"
      )
    );
  }

  getEmppty(): Observable<any> {
    return from(["empty"]);
  }

  saveObservation(data): Observable<any> {
    return this.httpClient.post(BASE_URL + "obs", data);
  }

  updateObservation(data): Observable<any> {
    return this.httpClient.post(BASE_URL + "obs/" + data["uuid"], data);
  }

  getPatientsVisitsNotes(patientUuid, conceptUuid) {
    let url =
      BASE_URL +
      `obs?patient=${patientUuid}&v=custom:(encounter:(visit,location:(uuid,display),obs:(uuid,display,obsDatetime,concept:(display),groupMembers:(uuid,display,concept,value,groupMembers:(uuid,concept:(display),value,voided,voidReason)))))&concept=${conceptUuid}`;

    return this.httpClient.get(url).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getLabOrdersMetadataDependencies(configs): Observable<any> {
    return forkJoin(
      configs?.testContainers
        ? this.httpClient.get(
            BASE_URL +
              "concept/" +
              configs["testContainers"] +
              "?v=custom:(uuid,display,setMembers:(uuid,display,setMembers:(uuid,display)))"
          )
        : of([]),
      configs?.sampleRejectionReasonsCoded
        ? this.httpClient.get(
            BASE_URL +
              "concept/" +
              configs["sampleRejectionReasonsCoded"] +
              "?v=custom:(uuid,display,answers:(uuid,display))"
          )
        : of([]),
      configs?.labDepartments
        ? this.httpClient.get(
            BASE_URL +
              "concept/" +
              configs["labDepartments"] +
              "?v=custom:(uuid,display,setMembers:(uuid,display,setMembers:(uuid,display,setMembers:(uuid,display,conceptClass,datatype,hiNormal,hiAbsolute,hiCritical,lowNormal,lowAbsolute,lowCritical,units,numeric,descriptions,allowDecimal,displayPrecision,answers:(uuid,display)))))"
          )
        : of([])
    );
  }

  getLabOrdersAndPatientsByVisitStartAndEndDate(
    visitStartDate,
    endDate,
    configs
  ): Observable<any> {
    // 378f0a01-a68e-4b90-82ea-844efa7132a8
    return forkJoin(
      this.httpClient.get(
        BASE_URL +
          "bahmnicore/sql?q=laboratory.sqlGet.patient_lab_orders_by_visit_start_date&visitStartDate=" +
          visitStartDate +
          "&visitEndDate=" +
          endDate +
          "T23:59:59"
      ),
      this.httpClient.get(
        BASE_URL +
          "bahmnicore/sql?q=laboratory.sqlGet.patients_with_lab_orders&visitStartDate=" +
          visitStartDate +
          "&visitEndDate=" +
          endDate +
          "T23:59:59"
      ),
      this.httpClient.get(BASE_URL + "lab/samples").pipe(
        map((response: any) => response?.results),
        catchError((error) => of(error))
      )
    );
  }

  getPatientOrdersByPatientId(startDate, endDate, patientId): Observable<any> {
    return this.httpClient.get(
      BASE_URL +
        "bahmnicore/sql?q=laboratory.sqlGet.patientLabOrders&startDate=" +
        startDate +
        "&endDate=" +
        endDate +
        "T23:59:59&patientId=" +
        patientId
    );
  }
}

export function formatDateToYYMMDD(dateValue) {
  return (
    dateValue.getFullYear() +
    "-" +
    formatMonthOrDate(dateValue.getMonth() + 1, "m") +
    "-" +
    formatMonthOrDate(dateValue.getDate(), "d")
  );
}

function formatMonthOrDate(value, type) {
  if (type == "m" && value.toString().length == 1) {
    return "0" + value;
  } else if (type == "d" && value.toString().length == 1) {
    return "0" + value;
  } else {
    return value;
  }
}
