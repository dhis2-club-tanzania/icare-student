import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ItemPrice } from "src/app/modules/maintenance/models/item-price.model";
import { PricingItem } from "src/app/modules/maintenance/models/pricing-item.model";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { HttpClient } from "@angular/common/http"; // Add this import

@Injectable({
  providedIn: "root",
})
export class PricingService {
  private apiUrl = "YOUR_BACKEND_API_URL"; // Add this line

  constructor(
    private httpClient: OpenmrsHttpClientService,
    private http: HttpClient // Add this
  ) {}

  getItems(filterInfo): Observable<PricingItem[]> {
    return this.httpClient
      .get(
        `icare/item?limit=${filterInfo?.limit}&startIndex=${
          filterInfo?.limit * filterInfo?.startIndex
        }${filterInfo?.searchTerm ? "&q=" + filterInfo?.searchTerm : ""}${
          filterInfo?.conceptSet && !filterInfo?.isDrug
            ? "&department=" + filterInfo?.conceptSet
            : ""
        }${filterInfo?.isDrug ? "&type=DRUG" : ""}`
      )
      .pipe(
        map((itemsResponse) =>
          itemsResponse?.results.map((item) => {
            return new PricingItem(item).toJson();
          })
        )
      );
  }

  getItemPrices(): Observable<any[]> {
    return this.httpClient.get("icare/itemprice").pipe(
      map((result) => {
        return (result || []).map((resultItem) =>
          new ItemPrice(resultItem).toJson()
        );
      })
    );
  }

  saveItemPrice(itemPrice: any): Observable<any> {
    return this.httpClient
      .post("icare/itemprice", itemPrice)
      .pipe(map((itemPriceResult) => itemPriceResult));
  }

  createPricingItem(concept: any, drug: any): Observable<any> {
    const pricingItem = concept
      ? {
          concept: {
            uuid: concept.uuid,
          },
          unit: "Session",
        }
      : { drug: { uuid: drug.uuid }, unit: "Drug" };
    return this.httpClient.post("icare/item", pricingItem).pipe(
      map((res) => new PricingItem(res).toJson()),
      catchError((error) => of(error))
    );
  }

  // Add this method at the end of the class
  uploadPriceList(data: any[]): Observable<any> {
    return this.http.post(${this.apiUrl}/price-list/upload, data);
  }
}
