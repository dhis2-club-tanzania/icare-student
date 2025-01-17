import { Injectable } from "@angular/core";
import { orderBy, omit } from "lodash";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import {
  IssueInput,
  IssueStatusInput,
  Issuing,
  IssuingObject,
} from "../models/issuing.model";

@Injectable({
  providedIn: "root",
})
export class IssuingService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getIssuings(
    locationUuid?: string,
    requestingLocationUuid?: string,
    page?: number,
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
      .get(
        `store/requests?${
          requestingLocationUuid
            ? "requestedLocationUuid=" + requestingLocationUuid
            : "requestedLocationUuid=" + locationUuid
        }${pagingArgs}`
      )
      .pipe(
        map((issueResponse: any) => {
          return {
            ...omit(issueResponse, "results"),
            issuings: issueResponse?.results
          };
        })
      );
  }

  getAllIssuings(
    locationUuid?: string,
    requestingLocationUuid?: string
  ): Observable<IssuingObject[]> {
    return this.httpClient
      .get(
        `store/requests?${
          requestingLocationUuid
            ? "requestingLocationUuid=" + requestingLocationUuid
            : "requestedLocationUuid=" + locationUuid
        }`
      )
      .pipe(
        map((issueResponse: any) => {
          return (orderBy(issueResponse, ["created"], ["desc"]) || []).map(
            (issueItem) => new Issuing(issueItem).toJson()
          );
        })
      );
  }

  issueItems(issueInput: any): Observable<any> {
    const issueObject = Issuing.createIssue(issueInput);
    return this.httpClient.post("store/issue", issueObject).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
  
  issueRequest(issueInput: IssueInput): Observable<any> {
    if (!issueInput) {
      return throwError({ message: "You have provided incorrect parameters" });
    }
    const issueObject = Issuing.createIssue(issueInput);
    return this.httpClient.post("store/issue", issueObject).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  saveIssueStatus(issueStatusInput: IssueStatusInput): Observable<any> {
    const issueStatus = Issuing.createIssueStatusObject(issueStatusInput);
    return this.httpClient.post("store/issuestatus", issueStatus);
  }
}
