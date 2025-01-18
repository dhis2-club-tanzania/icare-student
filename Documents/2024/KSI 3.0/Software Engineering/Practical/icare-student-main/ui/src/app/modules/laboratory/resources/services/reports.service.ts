import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { Api, UserGet, UserGetFull } from 'src/app/shared/resources/openmrs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class LabReportsService {
  constructor(private api: Api, private httpClient: OpenmrsHttpClientService) {}

  runDataSet(dataSetId, selectionDates?: any): Observable<any> {
    return this.httpClient.get(
      `reportingrest/dataSet/${dataSetId}?startDate=${selectionDates?.startDate}&endDate=${selectionDates?.endDate}`
      ).pipe(
        map((response) => {
          let keys = _.map(response?.metadata?.columns, (col) => col?.name);

          return _.map(response?.rows, (row) => {
            let newRow = {};
            _.each(keys, (key) => {
              return (newRow[key] = row[key]);
            });

            return newRow;
          });
        }),
        catchError((error) => of(error))
      )
  }
}
