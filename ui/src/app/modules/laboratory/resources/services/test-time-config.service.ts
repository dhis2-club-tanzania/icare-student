import { EventEmitter, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Injectable({
  providedIn: "root",
})
export class TestTimeConfigService {

  
  constructor(private httpClient: OpenmrsHttpClientService) {}

  testTimeToEdit = new EventEmitter<any>();

  savedOrEditedData = new EventEmitter<any>();

  createTestTimeConfig(data: any): Observable<any> {
    return this.httpClient.post(`lab/testtime`, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  editTestTimeConfig(data: any) : Observable<any>{
    return this.httpClient.post(`lab/testtime/${data?.uuid}`,data).pipe(
      map((response) =>{
        return response;
      }),
      catchError((error) => of(error))
    )
  }

  getTestTimeConfig(parameters: any): Observable<any> {
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

    return this.httpClient.get(`lab/testtime?${queryParams}`).pipe(
      map((response) => {
        return response.map(item => {
          if (item?.concept && typeof item.concept.display === 'string') {
            item.concept.display = item.concept.display.replace('TEST_ORDERS:', '');
          }
          return item;
        });
      }),
      catchError((error) => of(error))
    );
  }

  deleteTestTimeConfig(uuid: any) {
    return this.httpClient.delete(`lab/testtime/${uuid}`).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );

    this.getTestTimeConfig(null);
  }

  
}
