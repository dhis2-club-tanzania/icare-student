import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { resultsComponents } from "src/app/modules/laboratory/modules/sample-results/components";
import { getGroupedItems } from "src/app/modules/maintenance/helpers/get-grouped-items.helper";
import { ItemPrice } from "src/app/modules/maintenance/models/item-price.model";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api, ConceptCreate } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class ItemPriceService {
  constructor(private httpClient: OpenmrsHttpClientService, private api: Api) {}

  getItemPrices(paymentSchemes): Observable<any[]> {
    return this.httpClient.get("icare/itemprice?limit=20&startIndex=0").pipe(
      map((result) =>
        getGroupedItems(
          result.map((resultItem) => new ItemPrice(resultItem)),
          paymentSchemes
        )
      )
    );
  }

  getItemPrice(pricePayload: { visitUuid: string; drugUuid: string }): Observable<any[]> {
    return this.httpClient
      .get(
        `icare/itemprice?visitUuid=${pricePayload?.visitUuid}&drugUuid=${pricePayload?.drugUuid}`
      )
      .pipe(
        map((response) => {
          return response?.results;
        }),
        catchError((err) => {
          return err
        })
      );
  }

  createItem(item: any, paymentSchemes: any[]): Observable<any> {
    // create concept drug if it is drug item
    if (item.isDrug) {
      return of(item);
    }

    // return this.httpClient.post('/care/item', item);
    const concept: ConceptCreate = {
      names: [{ name: item?.name, locale: "en" }],
      datatype: "N/A",
      conceptClass: item?.class,
    };

    return from(this.api.concept.createConcept(concept)).pipe(
      switchMap((res) => {
        return this.httpClient
          .post("icare/item", {
            concept: {
              uuid: res.uuid,
            },
            unit: "Session",
          })
          .pipe(
            map((itemRes: any) => {
              const priceItems: ItemPrice[] = paymentSchemes.map(
                (paymentScheme) =>
                  new ItemPrice({
                    item: {
                      uuid: itemRes?.uuid,
                      display: itemRes?.display || item?.name,
                    },
                    paymentType: paymentScheme.paymentType,
                    paymentScheme,
                  })
              );

              return getGroupedItems(priceItems, paymentSchemes);
            })
          );
      })
    );
  }

  updateItemPrice(itemPrice: any): Observable<any> {
    return this.httpClient.post("icare/itemprice", itemPrice);
  }

  updateItemPrices(itemPrices: any[]): Observable<any[]> {
    return zip(...itemPrices.map(this.updateItemPrice));
  }

  // TODO: Move this method to appropriate location
  getPaymentTypes() {
    const conceptUuids = [
      "00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
      // '00000105IIIIIIIIIIIIIIIIIIIIIIIIIIII',
      // '00000106IIIIIIIIIIIIIIIIIIIIIIIIIIII',
      // '00000107IIIIIIIIIIIIIIIIIIIIIIIIIIII',
    ];
    return zip(
      ...conceptUuids.map((concept) =>
        this.httpClient.get(`concept/${concept}`)
      )
    );
  }

  // TODO:Move this logic somewhere else

  getConceptClasses() {
    return this.httpClient.get("conceptclass").pipe(map((res) => res.results));
  }

  getDepartmentsByMappingSearchQuery(q: string): Observable<any> {
    return this.httpClient
      .get(`concept?q=${q}&v=custom:(uuid,display,setMembers:(uuid,display))`)
      .pipe(
        map((response) =>
          response?.results && response?.results?.length > 0
            ? response?.results[0]?.setMembers
            : []
        ),
        catchError((error) => of(error))
      );
    }
    
  getItem(
    q?: string,
    ){
    return this.httpClient
      .get(`icare/item?q=${q}`)
      .pipe(
        map((response) =>
          response?.results && response?.results?.length > 0
            ? response?.results
            : []
        ),
        catchError((error) => of(error))
      );

  }
}
