import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadActiveVisitsForSampleManagement } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import {
  getAllAcceptedLabSamples,
  getAllCollectedLabSamples,
  getAllLabSamples,
  getAllLabSamplesWaitingAcceptanceNotGrouped,
  getAllSamplesToCollect,
  getSamplesLoadedState,
  getSamplesLoadingState,
  getSamplesWithResults,
} from 'src/app/store/selectors';

@Component({
  selector: 'app-sample-status-summary-for-home',
  templateUrl: './sample-status-summary-for-home.component.html',
  styleUrls: ['./sample-status-summary-for-home.component.scss'],
})
export class SampleStatusSummaryForHomeComponent implements OnInit {
  @Input() visitsDetails: any;
  @Input() sampleTypes: any;
  @Input() visitsParameters: any;

  samplesCollected$: Observable<any[]>;
  samplesLoaded$: Observable<boolean>;
  samplesLoading$: Observable<boolean>;
  samplesWaitingAcceptance$: Observable<any>;
  samplesAccepted$: Observable<any>;
  samplesRejected$: Observable<any>;
  samplesToCollect$: Observable<any>;
  completedSamples$: Observable<any>;
  patientsWithActiveVisits$: Observable<any>;
  allLabSamples$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    if (this.visitsDetails && this.sampleTypes)
      this.store.dispatch(
        loadActiveVisitsForSampleManagement({
          visits: this.visitsDetails,
          sampleTypes: this.sampleTypes,
          billingInfo: null,
        })
      );

    this.samplesLoaded$ = this.store.select(getSamplesLoadedState);
    this.samplesLoading$ = this.store.select(getSamplesLoadingState);
    this.samplesCollected$ = this.store.select(getAllCollectedLabSamples);

    this.samplesWaitingAcceptance$ = this.store.select(
      getAllLabSamplesWaitingAcceptanceNotGrouped
    );

    this.samplesAccepted$ = this.store.select(getAllAcceptedLabSamples);

    this.samplesToCollect$ = this.store.select(getAllSamplesToCollect);

    this.completedSamples$ = this.store.select(getSamplesWithResults);

    this.allLabSamples$ = this.store.select(getAllLabSamples);
  }
}
