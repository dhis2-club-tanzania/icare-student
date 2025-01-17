import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { getSamplesLoadedState, getSamplesLoadingState, getAllCollectedLabSamples, getAllLabSamples } from 'src/app/store/selectors';

@Component({
  selector: 'app-summary-samples-to-collect',
  templateUrl: './summary-samples-to-collect.component.html',
  styleUrls: ['./summary-samples-to-collect.component.scss'],
})
export class SummarySamplesToCollectComponent implements OnInit {
  @Input() samples: any[];
  @Input() samplesToCollect: any[];
  samplesCollected$: Observable<any[]>;
  samplesLoaded$: any;
  samplesLoading$: any;
  allLabSamples$: Observable<any>;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.samplesLoaded$ = this.store.select(getSamplesLoadedState);
    this.samplesLoading$ = this.store.select(getSamplesLoadingState);
    this.samplesCollected$ = this.store.select(getAllCollectedLabSamples);
    this.allLabSamples$ = this.store.select(getAllLabSamples);
  }
}
