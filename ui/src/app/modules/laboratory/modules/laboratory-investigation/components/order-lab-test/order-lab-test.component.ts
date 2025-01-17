import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FormConfig } from 'src/app/shared/modules/form/models/form-config.model';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { BillableItemsService } from 'src/app/shared/resources/billable-items/services/billable-items.service';
import { ICARE_CONFIG } from 'src/app/shared/resources/config';
import {
  createDiagnosticEncounter,
  loadCurrentPatient,
  loadForms,
  startConsultation,
} from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import { getConsultationActiveVisit } from 'src/app/store/selectors';
import { getCurrentPatient } from 'src/app/store/selectors/current-patient.selectors';
import { getProviderDetails } from 'src/app/store/selectors/current-user.selectors';
import {
  getFormEntitiesByNames,
  getFormsLoadingState,
} from 'src/app/store/selectors/form.selectors';
import { getActiveVisit } from 'src/app/store/selectors/visit.selectors';
const CONSULTATION_FORM_CONFIGS: FormConfig[] = [
  { name: 'All orderables', formLevel: 5 },
];
@Component({
  selector: 'app-order-lab-test',
  templateUrl: './order-lab-test.component.html',
  styleUrls: ['./order-lab-test.component.scss'],
})
export class OrderLabTestComponent implements OnInit {
  billableItems$: Observable<any>;
  consultationForms$: Observable<any>;
  activeVisit$: Observable<any>;
  currentPatient$: Observable<any>;
  loadingForms$: Observable<boolean>;
  provider$: Observable<any>;
  encounterResponse$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private billableItemsService: BillableItemsService,
    private httpClientService: OpenmrsHttpClientService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.params['patientId'];
    this.store.dispatch(loadCurrentPatient({ uuid: patientId }));
    this.loadingForms$ = this.store.pipe(select(getFormsLoadingState));
    this.billableItems$ = this.billableItemsService.getItemsWithPrices();
    this.store.dispatch(
      loadForms({ formConfigs: ICARE_CONFIG?.consultation?.forms })
    );
    this.consultationForms$ = this.store.pipe(
      select(getFormEntitiesByNames(CONSULTATION_FORM_CONFIGS))
    );
    this.provider$ = this.store.select(getProviderDetails);
    this.activeVisit$ = this.store.pipe(select(getActiveVisit));
    this.currentPatient$ = this.store.pipe(select(getCurrentPatient));

    this.currentPatient$.subscribe((patient) => {
      this.activeVisit$.subscribe((visit) => {
        if (visit && patient) {
          this.store.dispatch(createDiagnosticEncounter());
        }
      });
    });
  }
}
