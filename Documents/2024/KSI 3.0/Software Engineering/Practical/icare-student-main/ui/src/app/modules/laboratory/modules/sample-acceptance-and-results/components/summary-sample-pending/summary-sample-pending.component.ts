import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { getSamplesLoadedState, getSamplesLoadingState, getAllLabSamplesWaitingAcceptanceNotGrouped } from 'src/app/store/selectors';

@Component({
  selector: 'app-summary-sample-pending',
  templateUrl: './summary-sample-pending.component.html',
  styleUrls: ['./summary-sample-pending.component.scss'],
})
export class SummarySamplePendingComponent implements OnInit {
  samplesWaitingAcceptance$: Observable<any[]>;
  samplesLoaded$: Observable<boolean>;
  samplesLoading$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.samplesLoaded$ = this.store.select(getSamplesLoadedState);
    this.samplesLoading$ = this.store.select(getSamplesLoadingState);
    this.samplesWaitingAcceptance$ = this.store.select(
      getAllLabSamplesWaitingAcceptanceNotGrouped
    );
  }
}
