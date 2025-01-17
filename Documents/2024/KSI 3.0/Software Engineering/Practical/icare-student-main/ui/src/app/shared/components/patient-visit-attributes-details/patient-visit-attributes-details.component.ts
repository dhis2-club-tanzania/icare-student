import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { from, Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { loadConceptByUuid } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import { OpenmrsHttpClientService } from '../../modules/openmrs-http-client/services/openmrs-http-client.service';

@Component({
  selector: 'app-patient-visit-attributes-details',
  templateUrl: './patient-visit-attributes-details.component.html',
  styleUrls: ['./patient-visit-attributes-details.component.scss'],
})
export class PatientVisitAttributesDetailsComponent implements OnInit {
  @Input() attributes: { uuid: string; attributeType: any; value: string }[];
  @Input() forRegistration: boolean;
  attributeValues: string[];
  attributesDetails$: Observable<any[]>;
  constructor(
    private store: Store<AppState>,
    private openMRSHttpClient: OpenmrsHttpClientService
  ) {}

  ngOnInit(): void {
    if (!this.forRegistration) {
      this.attributeValues = this.attributes.map((attribute) => {
        this.store.dispatch(
          loadConceptByUuid({
            uuid: attribute?.value,
            fields: 'custom:(uuid,display)',
          })
        );
        return attribute?.value;
      });
      this.attributesDetails$ = this.getVisitAttributesDetails(this.attributes);
    }
  }

  getVisitAttributesDetails(attributes): Observable<any> {
    return zip(
      ...attributes.map((attribute) =>
        this.openMRSHttpClient
          .get(
            `concept/${attribute?.value}?v=custom:(uuid,display,names:(display,conceptNameType))`
          )
          .pipe(
            map((response) => {
              const shortNameDetails = (response.names.filter(
                (name) => name.conceptNameType === 'SHORT'
              ) || [])[0];
              const fullSpecifiedNameDetails = (response.names.filter(
                (name) => name.conceptNameType === 'FULLY_SPECIFIED'
              ) || [])[0];
              return {
                ...(shortNameDetails
                  ? shortNameDetails
                  : fullSpecifiedNameDetails),
                ...attribute,
              };
            }),
            catchError((error) =>
              of({ ...attribute, display: attribute?.value })
            )
          )
      )
    );
  }
}
