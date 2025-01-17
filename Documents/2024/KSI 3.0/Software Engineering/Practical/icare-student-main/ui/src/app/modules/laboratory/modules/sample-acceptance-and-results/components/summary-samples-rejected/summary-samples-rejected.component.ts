import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import { getSamplesLoadedState, getSamplesLoadingState, getAllRejectedLabSamples } from 'src/app/store/selectors';

@Component({
  selector: 'app-summary-samples-rejected',
  templateUrl: './summary-samples-rejected.component.html',
  styleUrls: ['./summary-samples-rejected.component.scss'],
})
export class SummarySamplesRejectedComponent implements OnInit {
  samplesRejected$: Observable<any[]>;
  samplesLoading$: Observable<boolean>;
  samplesLoaded$: Observable<boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.samplesLoaded$ = this.store.select(getSamplesLoadedState);
    this.samplesLoading$ = this.store.select(getSamplesLoadingState);
    this.samplesRejected$ = this.store.select(getAllRejectedLabSamples, {
      searchingText: '',
    });
  }
}
