import { Injectable } from '@angular/core';
import { omit } from 'lodash';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { RequisitionInput } from '../models/requisition-input.model';
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import {
  Requisition,
  RequisitionIssueInput,
  RequisitionObject,
  RequisitionStatus,
} from "../models/requisition.model";
import { orderBy } from "lodash";


@Injectable({
  providedIn: "root",
})
export class RequisitionService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getRequisitions(
    locationUuid?: string,
    page?: Number,
    pageSize?: number,
    status?: string,
    orderByDirection?: string,
    otherParameters?: {
      q: string;
      startDate: Date;
      endDate: Date;
    }
  ): Observable<any> {
    const pageNumber = page ? `&page=${page}` : ``;
    const pageSizeNumber = pageSize ? `&pageSize=${pageSize}` : ``;
    const filterStatus = status ? `&status=${status}` : ``;
    const orderByDirectionArg = orderByDirection
      ? `&orderByDirection=${orderByDirection}`
      : ``;
    let pagingArgs =
      pageNumber + pageSizeNumber + filterStatus + orderByDirectionArg;

      if (otherParameters?.q) {
        pagingArgs += `&q=${otherParameters?.q}`;
      }
      if (otherParameters?.startDate) {
        pagingArgs += `&startDate=${formatDateToYYMMDD(
          otherParameters?.startDate
        )}`;
      }
      if (otherParameters?.endDate) {
        pagingArgs += `&endDate=${formatDateToYYMMDD(otherParameters?.endDate)}`;
      }  
    return this.httpClient
      .get(`store/requests?requestingLocationUuid=${locationUuid}${pagingArgs}`)
      .pipe(
        map((requestResponse) => {
          return {
            ...omit(requestResponse, "results"),
            requisitions: requestResponse?.results,
          };
        })
      );
  }

  getRequisitionByUuid(uuid: string): Observable<any> {
    return this.httpClient.get(`store/request/${uuid}`).pipe(
      map((requestResponse) => {
        return requestResponse;
      }),
      catchError((error) => error)
    );
  }

  getAllRequisitions(locationUuid?: string): Observable<RequisitionObject[]> {
    return this.httpClient
      .get(`store/requests?requestingLocationUuid=${locationUuid}`)
      .pipe(
        map((requestResponse) =>
          orderBy(requestResponse || [], ["created"], ["desc"])
            .map((requestItem) => {
              const requisitionInstance = new Requisition(requestItem);

              if (requisitionInstance.status === "CANCELLED") {
                return null;
              }

              return requisitionInstance.toJson();
            })
            .filter((requisition) => requisition)
        )
      );
  }

  createRequisition(requisitionInput: any): Observable<any> {
    return this.httpClient.post("store/request", requisitionInput).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => error)
    );
  }

  updateRequisition(uuid: string, requisitionInput: any): Observable<any> {
    return this.httpClient.post(`store/request/${uuid}`, requisitionInput).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => error)
    );
  }

  deleteRequisition(uuid: string): Observable<any>{
    return this.httpClient
    .delete(`store/request/${uuid}`)
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => error)
    );
  }

  createRequest(
    requisitionInput: RequisitionInput
  ): Observable<RequisitionObject | any> {
    const request = Requisition.createRequisition(requisitionInput);

    if (!request) {
      return throwError({
        message: "Incorrect parameters supplied",
      });
    }

    return this.httpClient.post("store/request", request).pipe(
      map((response) => {
        return new Requisition(response).toJson();
      }),
      catchError((error) => error)
    );
  }

  createRequisitionItem(requisitionItem: any): Observable<any> {
    return this.httpClient.post("store/requestitem", requisitionItem).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => error)
    );
  }

  updateRequisitionItem(uuid: string, requisitionItem: any): Observable<any> {
    return this.httpClient
      .post(`store/requestitem/${uuid}`, requisitionItem)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => error)
      );
  }

  deleteRequisitionItem(uuid: string): Observable<any>{
    return this.httpClient
    .delete(`store/requestitem/${uuid}`)
    .pipe(
      map((response) =>{
        return response;
      }),
      catchError((error) => error)
    );
  }

  receiveIssueItem(requisitionObject: any): Observable<any> {
    return this.httpClient.post("store/receive", requisitionObject).pipe(
      map((response) => {
        return {
          ...requisitionObject,
          status: "RECEIVED",
          crudOperationStatus: null,
        };
      }),
      catchError((err) => err)
    );
  }

  createIssueItemStatus(issueItem: any): Observable<any> {
    // console.log("itemIssue body....................................................",issueItem)
    return this.httpClient
      .post(`store/issueitemstatus/`, issueItem)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => error)
      );
   }

  receiveRequisition(
    requisitionObject: RequisitionObject
  ): Observable<RequisitionObject> {
    const receipt =
      Requisition.createRequisitionReceiptObject(requisitionObject);

    if (!receipt) {
      return throwError({
        message: "Incorrect parameters supplied",
      });
    }

    return this.httpClient.post("store/receive", receipt).pipe(
      map(() => {
        return {
          ...requisitionObject,
          status: "RECEIVED",
          crudOperationStatus: null,
        };
      })
    );
  }

  acceptRequisitionIssue(
    requisitionIssueInput: RequisitionIssueInput
  ): Observable<string> {
    if (!requisitionIssueInput) {
      return throwError({ message: "You have provided incorrect parameters" });
    }

    const requisitionIssueObject = Requisition.createRequisitionIssue(
      requisitionIssueInput
    );

    return this.httpClient.post("store/receive", requisitionIssueObject).pipe(
      map((response) => {
        return null;
      })
    );
  }

  saveRequisitionStatus(
    requisitionId: string,
    reason: string,
    status: RequisitionStatus
  ): Observable<string> {
    const requisitionStatus = Requisition.createRequisitionStatusObject(
      requisitionId,
      reason,
      status
    );
    return this.httpClient
      .post("store/requeststatus", requisitionStatus)
      .pipe(map(() => requisitionId));
  }
}
