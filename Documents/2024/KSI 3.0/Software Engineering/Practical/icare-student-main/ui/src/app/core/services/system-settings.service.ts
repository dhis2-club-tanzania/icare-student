import { Injectable } from "@angular/core";
import { from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { SystemSettingsWithKeyDetails } from "../models/system-settings.model";
import { capitalize } from "lodash";
import { Api } from "src/app/shared/resources/openmrs";
import { sanitizeSystemSettingsValue } from "../helpers";

@Injectable({
  providedIn: "root",
})
export class SystemSettingsService {
  constructor(private httpClient: OpenmrsHttpClientService, private api: Api) {}

  getFormPrivilegesConfigs(): Observable<any> {
    return this.httpClient
      .get(`systemsetting?q=iCare.privilegesAndFormsMappings&v=full`)
      .pipe(
        map((response) => {
          return JSON.parse(response?.results[0]?.value);
        }),
        catchError((error) => of(error))
      );
  }

  getSystemSettingsByKey(key: string): Observable<any> {
    return this.httpClient.get(`systemsetting?q=${key}&v=full`).pipe(
      map((response) => {
        return response?.results && response?.results[0]
          ? response?.results[0]?.value.indexOf("{") > -1 ||
            response?.results[0]?.value.indexOf("[") > -1
            ? JSON.parse(response?.results[0]?.value)
            : response?.results[0]?.value
          : "none";
      }),
      catchError((error) => of(error))
    );
  }
  getSystemSettingsByUuid(uuid: string): Observable<any> {
    return from(this.api.systemsetting.getSystemSetting(uuid)).pipe(
      map((response) => {
        return response && response
          ? response?.value.indexOf("{") > -1 ||
            response?.value.indexOf("[") > -1
            ? JSON.parse(response?.value)
            : response?.value
          : "none";
      }),
      catchError((error) => of(error))
    );
  }

  deleteSystemSettingByUuid(uuid: string): Observable<any> {
    return from(this.api.systemsetting.deleteSystemSetting(uuid)).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getSystemSettingsMatchingAKey(
    key: string,
    parameters?: { startIndex: number; limit: number }
  ): Observable<SystemSettingsWithKeyDetails[]> {
    // lis.attributes.referringDoctor
    return this.httpClient
      .get(
        `systemsetting?q=${key}&v=full${
          parameters?.startIndex ? "&startIndex=" + parameters?.startIndex : ""
        }${parameters?.limit ? "&limit=" + parameters?.limit : ""}`
      )
      .pipe(
        map((response) => {
          return response?.results && response?.results?.length > 0
            ? response?.results.map((result) => {
                return result?.value.indexOf("{") > -1 ||
                  result?.value.indexOf("[") > -1
                  ? {
                      uuid: result?.uuid,
                      name: result?.property
                        .split(".")
                        [result?.property.split(".").length - 1]?.toUpperCase(),
                      referenceKeyPart:
                        result?.property.split(".")[
                          result?.property.split(".").length - 1
                        ],
                      property: result?.property,
                      description: result?.description,
                      value: result?.value,
                      order: Number(
                        result?.property.split(".")[
                          result?.property.split(".").length - 1
                        ]
                      )
                        ? Number(
                            result?.property.split(".")[
                              result?.property.split(".").length - 1
                            ]
                          )
                        : null,
                    }
                  : {
                      uuid: result?.uuid,
                      name: capitalize(
                        result?.property.split(".")[
                          result?.property.split(".").length - 1
                        ]
                      ),
                      referenceKeyPart:
                        result?.property.split(".")[
                          result?.property.split(".").length - 1
                        ],
                      property: result?.property,
                      description: result?.description,
                      value: result?.value,
                      order: Number(
                        result?.property.split(".")[
                          result?.property.split(".").length - 1
                        ]
                      )
                        ? Number(
                            result?.property.split(".")[
                              result?.property.split(".").length - 1
                            ]
                          )
                        : null,
                    };
              })
            : [];
        }),
        catchError((error) => of(error))
      );
  }

  getSystemSettingsDetailsByKey(key: string): Observable<any> {
    return this.httpClient.get(`systemsetting?q=${key}&v=full`).pipe(
      map((response) => {
        return {
          uuid: response?.results[0]?.uuid,
          description: response?.results[0]?.description,
          key,
          value:
            response?.results && response?.results[0]
              ? response?.results[0]?.value.indexOf("{") === 0 ||
                response?.results[0]?.value.indexOf("[") === 0
                ? JSON.parse(response?.results[0]?.value)
                : response?.results[0]?.value
              : "",
        };
      }),
      catchError((error) => of(error))
    );
  }

  updateSystemSettings(data): Observable<any> {
    return this.httpClient
      .post(`systemsetting/${data?.uuid ? data?.uuid : ""}`, data)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }

  getiCareServicesConfigurations(): Observable<any[]> {
    return this.httpClient
      .get(`systemsetting?q=iCare.Serives.Configurations&v=full`)
      .pipe(
        map((response) => {
          return JSON.parse(response?.results[0]?.value);
        })
      );
  }
}
