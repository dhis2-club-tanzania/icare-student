import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import { getVisitsLoadedState, getAllLabSamples, getAllSamplesToCollect } from 'src/app/store/selectors';


@Component({
  selector: 'app-summary-sample-status-dashboard',
  templateUrl: './summary-sample-status-dashboard.component.html',
  styleUrls: ['./summary-sample-status-dashboard.component.scss'],
})
export class SummarySampleStatusDashboardComponent implements OnInit {
  @Input() visits: any;
  @Input() sampleTypes: any;
  @Input() labOrdersBillingInfo: any;
  @Input() labConfigs: any;
  @Input() samples: any[];
  samplesToCollect$: Observable<any[]>;
  samplesWaitingAcceptance$: Observable<any[]>;
  samplesAccepted$: Observable<any[]>;
  samplesRejected$: Observable<any[]>;
  samplesWithResults$: Observable<any[]>;
  visitsLoadedState$: Observable<any>;
  samples$: Observable<any[]>;
  samplesLoadedState$: Observable<boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // this.store.dispatch(loadActiveVisitsForSampleManagement());
    this.visitsLoadedState$ = this.store.select(getVisitsLoadedState);
    this.samples$ = this.store.select(getAllLabSamples);
    this.samplesToCollect$ = this.store.select(getAllSamplesToCollect);
  }
}
