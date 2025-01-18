import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class LabOrdersService {
  constructor(
    private api: Api,
    private openMRSHttpClient: OpenmrsHttpClientService
  ) {}

  updateLabOrders(ordersToUpdate): Observable<any> {
    return zip(
      ...ordersToUpdate.map((order) =>
        this.openMRSHttpClient
          .post(`encounter/${order?.encounter}`, {
            uuid: order?.encounter,
            orders: [order],
          })
          .pipe(
            map((response) => {
              return {
                ...order,
                ...response,
              };
            }),
            catchError((error) => of(error))
          )
      )
    );
  }

  createLabOrdersViaEncounter(encounterData: any): Observable<any> {
    return from(this.api.encounter.createEncounter(encounterData)).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }
}
