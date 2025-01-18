import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { getSamplesLoadedState, getSamplesLoadingState, getAllCollectedLabSamples } from 'src/app/store/selectors';

@Component({
  selector: 'app-summary-sample-collected',
  templateUrl: './summary-sample-collected.component.html',
  styleUrls: ['./summary-sample-collected.component.scss'],
})
export class SummarySampleCollectedComponent implements OnInit {
  samplesCollected$: Observable<any[]>;
  samplesLoaded$: Observable<boolean>;
  samplesLoading$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.samplesLoaded$ = this.store.select(getSamplesLoadedState);
    this.samplesLoading$ = this.store.select(getSamplesLoadingState);
    this.samplesCollected$ = this.store.select(getAllCollectedLabSamples);
  }
}
