import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { AppState } from 'src/app/store/reducers';
import { getSamplesLoadedState, getSamplesLoadingState, getAllFullCompletedLabSamples } from 'src/app/store/selectors';

@Component({
  selector: 'app-summary-samples-with-results',
  templateUrl: './summary-samples-with-results.component.html',
  styleUrls: ['./summary-samples-with-results.component.scss'],
})
export class SummarySamplesWithResultsComponent implements OnInit {
  samplesFullCompleted$: Observable<any[]>;
  samplesLoaded$: Observable<boolean>;
  samplesLoading$: Observable<boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.samplesLoaded$ = this.store.select(getSamplesLoadedState);
    this.samplesLoading$ = this.store.select(getSamplesLoadingState);

    this.samplesFullCompleted$ = this.store.select(
      getAllFullCompletedLabSamples,
      {
        searchingText: '',
      }
    );
  }
}
