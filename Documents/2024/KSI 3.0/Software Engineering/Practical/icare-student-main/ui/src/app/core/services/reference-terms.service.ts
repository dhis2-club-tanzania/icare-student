import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  Api,
  ConceptreferencetermCreate,
  ConceptreferencetermGet,
} from "src/app/shared/resources/openmrs";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Injectable({
  providedIn: "root",
})
export class ReferenceTermsService {
  constructor(private api: Api, private httpClient: OpenmrsHttpClientService) {}

  createReferenceTerm(
    data: ConceptreferencetermCreate
  ): Observable<ConceptreferencetermCreate> {
    return from(
      this.api.conceptreferenceterm.createConceptReferenceTerm(data)
    ).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
  getConceptReferenceTermsByParameters(parameters: any): Observable<any> {
    let queryParams = "";
    if (parameters?.q) {
      queryParams = "q=" + parameters?.q;
    }
    if (parameters?.limit) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") + "limit=" + parameters?.limit;
    }

    if (parameters?.startIndex) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") +
        "startIndex=" +
        parameters?.startIndex;
    }

    if (parameters?.source) {
      queryParams +=
        (queryParams?.length > 0 ? "&" : "") + "source=" + parameters?.source;
    }

    return this.httpClient
      .get(`icare/conceptreferenceterm?${queryParams}`)
      .pipe(
        map((response) => {
          return response?.results;
        }),
        catchError((error) => {
          return of(error);
        })
      );
  }

  getConceptReferenceTermByUuids(
    uuids: string[]
  ): Observable<ConceptreferencetermGet[]> {
    return uuids.length > 0
      ? zip(
          ...uuids.map((uuid) =>
            from(
              this.api.conceptreferenceterm.getConceptReferenceTerm(uuid)
            ).pipe(
              map((response) => {
                return response;
              }),
              catchError((error) => {
                return of(error);
              })
            )
          )
        )
      : of([]);
  }

  getReferenceTerms(parameters: {
    page?: number;
    pageSize?: number;
    searchingText?: string;
    source?: string;
  }): Observable<ConceptreferencetermGet[]> {
    let query = {};
    if (parameters?.searchingText) {
      query["q"] = parameters?.searchingText;
    }

    if (parameters?.page && parameters?.pageSize) {
      query["startIndex"] = (parameters?.page - 1) * parameters?.pageSize;
    }

    if (parameters?.pageSize) {
      query["limit"] = parameters?.pageSize;
    }

    if (parameters?.source) {
      query["source"] = parameters?.source;
    }
    return from(
      this.api.conceptreferenceterm.getAllConceptReferenceTerms(query)
    ).pipe(
      map((response) => {
        return response?.results.map((result) => {
          return {
            ...result,
            display: result?.display?.split(": ")[1],
          };
        });
      }),
      catchError((error) => of(error))
    );
  }

  getReferenceTermsBySource(
    source: string
  ): Observable<ConceptreferencetermGet[]> {
    return from(
      this.api.conceptreferenceterm.getAllConceptReferenceTerms({
        source: source,
      })
    ).pipe(
      map((response) =>
        response?.results.map((result) => {
          return {
            ...result,
            display: result?.display.split(": ")[1],
          };
        })
      ),
      catchError((error) => of(error))
    );
  }

  deleteConceptReferenceTerm(uuid: string): Observable<any> {
    return from(
      this.api.conceptreferenceterm.deleteConceptReferenceTerm(uuid)
    ).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }
}
