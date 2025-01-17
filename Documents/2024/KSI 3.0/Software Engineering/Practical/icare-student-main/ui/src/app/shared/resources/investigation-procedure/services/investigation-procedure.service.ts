import { Injectable } from "@angular/core";
import { Api, OrderCreate } from "../../openmrs";
import { Observable, from, zip, of } from "rxjs";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class InvestigationProcedureService {
  constructor(
    private api: Api,
    private httpClientService: OpenmrsHttpClientService,
    private store: Store<AppState>
  ) {}

  saveOrder(order): Observable<OrderCreate> {
    return from(this.api.order.createOrder(order));
  }

  saveManyOrders(orders): Observable<any[]> {
    return zip(
      ...(orders || []).map((order) => {
        return this.saveOrder(order).pipe(
          map((response) => {
            return response;
          })
        );
      })
    );
  }

  deleteOrder(uuid): Observable<any> {
    return from(this.httpClientService.delete("order/" + uuid));
  }

  discontinueOrder(order): Observable<any> {
    console.log(order);
    return this.httpClientService
      .post(`order/${order?.encounter?.uuid}`, {
        uuid: order?.encounter?.uuid,
        orders: [
          {
            uuid: order?.uuid,
            action: "DISCONTINUE",
            dateStopped: new Date(),
          },
        ],
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }

  saveOrdersUsingEncounter(data, encounterUuid): Observable<any> {
    const encounterId = encounterUuid
      ? encounterUuid
      : JSON.parse(localStorage.getItem("patientConsultation"))[
          "encounterUuid"
        ];
    return this.httpClientService.post(`encounter/${encounterId}`, data);
  }

  createEncounterWithOrders(data): Observable<any> {
    return this.httpClientService.post(`encounter`, data);
  }
}
