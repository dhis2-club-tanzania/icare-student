import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { groupBy } from "lodash";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class BillableItemsService {
  constructor(private httpClientService: OpenmrsHttpClientService) {}

  createBillableItem(payload: any): Observable<any> {
    return this.httpClientService.post("icare/item", payload).pipe(
      map((response: any) => response),
      catchError((error) => of(error))
    );
  }

  createPrice(payload: any): Observable<any> {
    return this.httpClientService.post("icare/itemprice", payload).pipe(
      map((response: any) => response),
      catchError((error) => of(error))
    );
  }

  getItemsWithPrices(): Observable<any[]> {
    return this.httpClientService.get("icare/itemprice").pipe(
      map((response) => {
        return groupBy(
          response?.results
            ? response?.results.map((itemPrice) => {
                return {
                  itemId: itemPrice?.item?.uuid,
                  name: itemPrice?.item?.display,
                  ...itemPrice,
                };
              })
            : [] || [],
          "name"
        );
      })
    );
  }

  getControlNumber(): Observable<string>{
    let number = new Date().getMilliseconds();
    console.log(number)
    return of(number.toString())
  }
}
