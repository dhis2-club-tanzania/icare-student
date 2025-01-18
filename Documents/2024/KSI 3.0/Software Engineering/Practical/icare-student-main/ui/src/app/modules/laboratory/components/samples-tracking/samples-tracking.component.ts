import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { Observable, of } from 'rxjs';
import { SampleObject } from '../../resources/models';
import {
  getAllLabSamples,
  getLabSamplesGroupedBymrNo,
} from '../../store/selectors/samples.selectors';
import { MatDialog } from '@angular/material/dialog';
import { TrackedSampleModalComponent } from '../../components/tracked-sample-modal/tracked-sample-modal.component';
import { loadAllLabSamples } from '../../store/actions';

@Component({
  selector: 'app-samples-tracking',
  templateUrl: './samples-tracking.component.html',
  styleUrls: ['./samples-tracking.component.scss'],
})
export class SamplesTrackingComponent implements OnInit {
  samplesGroupedBymrNo$: Observable<SampleObject[]>;
  expandedRow: number;
  currentSample$: Observable<SampleObject>;
  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(loadAllLabSamples());
    this.samplesGroupedBymrNo$ = this.store.select(getLabSamplesGroupedBymrNo);
  }

  viewSampleTrackingInfo(e, sample) {
    e.stopPropagation();
    this.dialog.open(TrackedSampleModalComponent, {
      width: '60%',
      height: '450px',
      disableClose: false,
      data: sample,
      panelClass: 'custom-dialog-container',
    });
  }
}
