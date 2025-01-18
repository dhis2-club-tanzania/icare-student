import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, zip } from 'rxjs';
import { BASE_URL } from '../constants/constants.constants';

@Injectable({
  providedIn: 'root',
})
export class LabOrdersBillingService {
  constructor(private httpClient: HttpClient) {}

  getLabOrdersBillingInfo(parameters): Observable<any> {
    //TODO: The billing api should be changed
    let indeces = [0];
    return zip(
      ...indeces.map((index) => {
        return from(
          this.httpClient.get(
            BASE_URL +
              'billing/quotation/read/dates/indexed?endDate=' +
              parameters.endDate +
              '&endIndex=' +
              (Number(index) + 100) +
              '&isAscending=false&startDate=' +
              parameters.startDate +
              '&startIndex=' +
              (Number(index) + 1)
          )
        );
      })
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
        'billing/order/read/patient/identifier?endDate=' +
        visitsParameters?.endDate +
        '&isAscending=false&patientMRN=' +
        mrn +
        '&startDate=' +
        visitsParameters?.startDate
    );
  }
}
