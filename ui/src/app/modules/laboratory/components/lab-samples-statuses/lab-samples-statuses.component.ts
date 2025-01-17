import { Component, OnInit } from '@angular/core';
import { SampleObject } from '../../resources/models';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import {
  getAllLabSamples,
  getLabSamplesFilteredByStatus,
} from '../../store/selectors/samples.selectors';

@Component({
  selector: 'app-lab-samples-statuses',
  templateUrl: './lab-samples-statuses.component.html',
  styleUrls: ['./lab-samples-statuses.component.scss'],
})
export class LabSamplesStatusesComponent implements OnInit {
  collectedSamples$: Observable<SampleObject[]>;
  rejectedSamples$: Observable<SampleObject[]>;
  acceptedSamples$: Observable<SampleObject[]>;
  samplesWaitingApproval$: Observable<SampleObject[]>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.collectedSamples$ = this.store.select(getAllLabSamples);
    this.rejectedSamples$ = this.store.select(getLabSamplesFilteredByStatus, {
      status: 'REJECTED',
    });
    this.acceptedSamples$ = this.store.select(getLabSamplesFilteredByStatus, {
      status: 'ACCEPTED',
    });
  }
}
