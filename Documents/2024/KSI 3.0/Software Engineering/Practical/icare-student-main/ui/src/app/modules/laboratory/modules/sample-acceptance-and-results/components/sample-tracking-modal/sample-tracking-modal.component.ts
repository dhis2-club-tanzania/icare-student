import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { AppState } from 'src/app/store/reducers';
import { getSampledOrdersToTrackBySampleIndentifier } from 'src/app/store/selectors';

@Component({
  selector: 'app-sample-tracking-modal',
  templateUrl: './sample-tracking-modal.component.html',
  styleUrls: ['./sample-tracking-modal.component.scss'],
})
export class SampleTrackingModalComponent implements OnInit {
  testOrders$: Observable<any[]>;
  sample: any;
  constructor(
    private dialogRef: MatDialogRef<SampleTrackingModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<AppState>
  ) {
    this.sample = data;
  }

  ngOnInit(): void {
    this.testOrders$ = this.store.select(
      getSampledOrdersToTrackBySampleIndentifier,
      {
        sampleIdentifier: this.sample?.sampleIdentifier,
      }
    );
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }
}
