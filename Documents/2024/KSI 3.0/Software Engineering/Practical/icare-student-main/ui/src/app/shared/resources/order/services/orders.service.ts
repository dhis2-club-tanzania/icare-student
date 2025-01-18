import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "../../../modules/openmrs-http-client/services/openmrs-http-client.service";
import { omit } from "lodash";
import { Api, EncounterCreate, OrderGetFull } from "../../openmrs";
import { HttpErrorResponse } from "@angular/common/http";
import { getDrugOrderPaymentStatus } from "../helpers/getDrugOrderPaymentStatus.helper";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  constructor(
    private openMRSHttpClient: OpenmrsHttpClientService,
    private API: Api
  ) {}

  getOrdersByUuids(orderUuids: any): Observable<any[]> {
    return zip(
      ...orderUuids.map((orderUuid) => {
        return this.openMRSHttpClient.get(
          `order/${orderUuid}?v=custom:(uuid,orderNumber,encounter,concept:(uuid,display,setMembers:(uuid,display)))`
        );
      })
    ).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getOrderByUuid(uuid): Observable<OrderGetFull> {
    return from(this.API.order.getOrder(uuid)).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  updateOrdersViaEncounter(ordersToUpdate): Observable<any> {
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

  updateOrderStatus(order): Observable<any> {
    return this.openMRSHttpClient.put(`order/${order?.uuid}`, order).pipe(
      map((response) => {
        return {
          ...order,
          ...response,
        };
      }),
      catchError((error) => of(error))
    );
  }

  getOrdersByVisitAndOrderType({ visit, orderType }): Observable<any> {
    return this.openMRSHttpClient
      .get(`icare/order?visitUuid=${visit}&orderTypeUuid=${orderType}`)
      .pipe(
        map((response) => {
          return response?.results.map((orderDetails) => {
            return {
              ...orderDetails,
              paid: getDrugOrderPaymentStatus(orderDetails, visit),
            };
          });
        })
      );
  }

  deleteOrder(uuid): Observable<any> {
    return this.openMRSHttpClient.delete(`order/${uuid}`);
  }

  voidOrderWithReason(order: {
    uuid: string;
    voidReason: string;
  }): Observable<any> {
    const voidReason =
      order?.voidReason.length > 0 ? order?.voidReason : "No reason";
    return from(
      this.openMRSHttpClient.post(`icare/voidorder`, {
        uuid: order?.uuid,
        voidReason: voidReason,
      })
    ).pipe(
      map((order) => {
        return order;
      }),
      catchError((err) => {
        return of(err);
      })
    );
  }

  createOrdersViaCreatingEncounter(encounter): Observable<any> {
    return this.openMRSHttpClient.post(`encounter`, encounter).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  createStandardEncounterWithObservations(
    encounter: any,
    obs: any
  ): Observable<any> {
    return from(this.API.encounter.createEncounter(encounter)).pipe(
      map((response) => {
        return zip(
          ...obs.map((ob) => {
            this.openMRSHttpClient
              .post(`encounter/${response?.uuid}`, {
                uuid: response?.uuid,
                obs: [ob],
              })
              .pipe(
                map((response) => {
                  return {
                    ...ob,
                    ...response,
                  };
                }),
                catchError((error) => of(error))
              );
          })
        );
      }),
      catchError((error) => of(error))
    );
  }

  createOrdersViaEncounter(orders): Observable<any> {
    const encounterUuid = orders[0]?.encounter;
    const data = {
      uuid: orders[0]?.encounter,
      orders: orders.map((order) => {
        const formattedOrder = omit(order, "encounter");
        return formattedOrder;
      }),
    };
    return this.openMRSHttpClient.post(`encounter/${encounterUuid}`, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of(errorResponse?.error);
      })
    );
  }

  createOrder(order): Observable<any> {
    return from(this.API.order.createOrder(order)).pipe(
      map((order) => order),
      catchError((error) => of(error))
    );
  }

  getOrdersFrequencies() {
    return from(
      this.API.orderfrequency.getAllOrderFrequencies({ v: "full" })
    ).pipe(
      map((response) => response?.results),
      catchError((error) => of(error))
    );
  }
}
