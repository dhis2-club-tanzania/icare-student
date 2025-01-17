import { Injectable } from "@angular/core";
import { flatten } from "lodash";
import { Observable, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { SupplierObject } from "../models/suppler.model";

@Injectable({
  providedIn: "root",
})
export class SupplierService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  createSuppliers(suppliers: any[]): Observable<any> {
    return this.httpClient.post(`store/suppliers`, suppliers).pipe(
      map((supplierResponse: any) => {
        return supplierResponse;
      }),
      catchError((error: any) => error)
    );
  }

  updateSupplier(
    supplierUuid: string,
    supplierObject: any
  ): Observable<any> {
    return this.httpClient
      .post(`store/supplier/${supplierUuid}`, supplierObject)
      .pipe(
        map((supplierResponse: any) => {
          return supplierResponse;
        }),
        catchError((error: any) => error)
      );
  }

  getSuppliers(): Observable<any> {
    return this.httpClient.get(`store/suppliers`).pipe(
      map((supplierResponse: any) => {
        return supplierResponse;
      }),
      catchError((error: any) => error)
    );
  }
}
