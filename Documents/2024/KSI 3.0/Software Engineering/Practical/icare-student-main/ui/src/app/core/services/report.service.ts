import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getReport(reportParams) {
    return this.httpClient
      .get(
        `reportingrest/${reportParams.reportGroup}/${
          reportParams.reportId
        }?${reportParams.params.join('&')}`
      )
      .pipe(
        map((response) => {
          return reportParams.reportGroup === 'dataSet'
            ? { dataSets: [response] }
            : response;
        })
      );
  }

  searchConcept(searchTerm: string): Observable<any> {
    return of(searchTerm).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.getDataConceptBySearchTerm(term))
    );
  }

  getDataConceptByFullySpecifiedName(conceptName: string) {
    return this.httpClient.get(`concept?name=${conceptName}&v=full`);
  }

  getDataConceptBySearchTerm(conceptName: string) {
    return this.httpClient.get(`concept?q=${conceptName}`);
  }

  sendDhisData(dhis2Payload) {
    return this.httpClient.post(`report/dhis2`, dhis2Payload);
  }

  searchDataElement(searchTerm: string): Observable<any> {
    return of(searchTerm).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchDataElementList(term))
    );
  }

  searchDataElementList(dataElementSearchString) {
    return this.httpClient.get(
      `report/dhis2/dataElements?q=${dataElementSearchString}`
    );
  }

  searchConceptReferenceTerm(codeOrName) {
    return this.httpClient.get(`conceptreferenceterm?codeOrName=${codeOrName}`);
  }

  createConceptReferenceTerm(referencePayload) {
    return this.httpClient.post(`conceptreferenceterm`, referencePayload);
  }

  createMappingConcept(conceptPayload) {
    return this.httpClient.post(`concept`, conceptPayload);
  }
}
