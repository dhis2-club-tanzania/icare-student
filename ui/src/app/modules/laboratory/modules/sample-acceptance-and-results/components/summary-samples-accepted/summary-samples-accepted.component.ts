import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { getSamplesLoadedState, getSamplesLoadingState, getAllAcceptedLabSamples } from 'src/app/store/selectors';

@Component({
  selector: 'app-summary-samples-accepted',
  templateUrl: './summary-samples-accepted.component.html',
  styleUrls: ['./summary-samples-accepted.component.scss'],
})
export class SummarySamplesAcceptedComponent implements OnInit {
  samplesAccepted$: Observable<any[]>;
  samplesLoaded$: Observable<boolean>;
  samplesLoading$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.samplesLoaded$ = this.store.select(getSamplesLoadedState);
    this.samplesLoading$ = this.store.select(getSamplesLoadingState);
    this.samplesAccepted$ = this.store.select(getAllAcceptedLabSamples);
  }
}
