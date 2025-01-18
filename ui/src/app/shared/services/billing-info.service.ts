import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { BASE_URL } from "../constants/constants.constants";
import { SoldItemsAmount } from "../models/sold-items-amount.model";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class GeneralBillingService {
  constructor(private httpClient: HttpClient) {}

  getLabOrdersBillingInfo(parameters): Observable<any> {
    //TODO: The billing api should be changed
    let indeces = [0];
    return zip(
      ...indeces.map((index) => {
        return from(
          this.httpClient.get(
            BASE_URL +
              "billing/quotation/read/dates/indexed?endDate=" +
              parameters.endDate +
              "&endIndex=" +
              (Number(index) + 100) +
              "&isAscending=false&startDate=" +
              parameters.startDate +
              "&startIndex=" +
              (Number(index) + 1)
          )
        );
      })
    ).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => of(error))
    );
    // .pipe(
    //   map((visitResponse: any) => {
    //     return (flatten(visitResponse) || [])
    //       .map((visitResult: any) => new Visit(visitResult))
    //       .filter((visit) => visit);
    //   })
    // );
    // return this.httpClient.get(
    //   BASE_URL +
    //     'billing/quotation/read/dates/indexed?endDate=' +
    //     parameters.endDate +
    //     '&endIndex=100&isAscending=true&startDate=' +
    //     parameters.startDate +
    //     '&startIndex=1'
    // );
  }

  // billingInfoByVisit(uuid) {
  //   return this.httpClient.get(
  //     BASE_URL +
  //       'bahmnicore/sql?q=laboratory.sqlGet.laboratory_billing_status&visit_uuids=' +
  //       uuid
  //   );
  // }

  billingInfoBymRN(mrn, visitsParameters) {
    return this.httpClient.get(
      BASE_URL +
        "billing/order/read/patient/identifier?endDate=" +
        visitsParameters?.endDate +
        "&isAscending=false&patientMRN=" +
        mrn +
        "&startDate=" +
        visitsParameters?.startDate
    );
  }

  loadSoldItemsGeneratedAmount(
    parameters?: string[]
  ): Observable<SoldItemsAmount[]> {
    return this.httpClient
      .get<SoldItemsAmount>(
        BASE_URL +
          `icare/totalinvoiceamountbyitems?${
            parameters?.length > 0 ? parameters.join("&") : ""
          }`
      )
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: any) => of(error))
      );
  }
}
