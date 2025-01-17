import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { flatten } from "lodash";
import { catchError, map } from "rxjs/operators";
import { BASE_URL } from "src/app/shared/constants/constants.constants";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api } from "src/app/shared/resources/openmrs";
import { ProviderAttributeModel } from "src/app/modules/maintenance/models/provider-attribute.model";

@Injectable({
  providedIn: "root",
})
export class CurrentUserService {
  constructor(private httpClient: OpenmrsHttpClientService, private api: Api) {}

  get(uuid: string): Observable<any> {
    return zip(
      this.httpClient.get(`user/${uuid}`),
      this.httpClient.get("session")
    ).pipe(
      map((responses: any[]) => {
        return {
          ...responses[0],
          privileges: responses[1]?.user?.privileges,
        };
      })
    );
  }

  getProviderByUserDetails(userUuid: string): Observable<any> {
    return this.httpClient
      .get(
        `provider?user=${userUuid}&v=custom:(uuid,display,person:(uuid,display))`
      )
      .pipe(
        map((response) =>
          response?.results[0]
            ? {
                ...response?.results[0],
                signature:
                  response?.results[0]?.attributes?.length > 0
                    ? (
                        response?.results[0]?.attributes.filter(
                          (attribute) =>
                            attribute?.attributeType?.uuid ===
                            "ecc4e84e-823c-4a1e-94dc-c349b9c64cca"
                        ) || []
                      )?.length > 0
                      ? (response?.results[0]?.attributes.filter(
                          (attribute) =>
                            attribute?.attributeType?.uuid ===
                            "ecc4e84e-823c-4a1e-94dc-c349b9c64cca"
                        ) || [])[0]?.value
                      : null
                    : null,
              }
            : {}
        ),
        catchError((error) => of(error))
      );
  }

  getSessionDetails(): Observable<any> {
    return this.httpClient.get("session");
  }

  createProviderAttribute(parentUuid: string, data: any): Observable<any> {
    return from(
      this.api.provider.createProviderAttribute(parentUuid, data)
    ).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getRolesDetails(): Observable<any> {
    // TODO: Find a way to dynamically load all roles by pagination
    return zip(
      ...[0, 100].map((pageIndex) =>
        this.httpClient
          .get(
            `role?startIndex=${pageIndex}&limit=100&v=custom:(uuid,name,privileges:(uuid,name))`
          )
          .pipe(
            map((response) => {
              return response?.results;
            }),
            catchError((error) => of([]))
          )
      )
    ).pipe(
      map((response: any) => {
        return flatten(response);
      })
    );
  }

  getProviderAttributes(): Observable<ProviderAttributeModel[]> {
    return this.httpClient.get("providerattributetype").pipe(
      map((response) => {
        const attributes = response?.results;
        return attributes.map((attribute) => {
          return {
            uuid: attribute?.uuid,
            name: attribute?.display,
          };
        });
      })
    );
  }
}
