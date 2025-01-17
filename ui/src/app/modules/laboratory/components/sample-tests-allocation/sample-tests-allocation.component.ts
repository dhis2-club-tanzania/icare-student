import { Component, OnInit, Input } from '@angular/core';
import { SampleObject } from '../../resources/models';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getLabSamplesGroupedBymrNoAndFilteredByStatus } from '../../store/selectors/samples.selectors';
import { AllocateTechnicianModalComponent } from '../allocate-technician-modal/allocate-technician-modal.component';
import { MatDialog } from '@angular/material/dialog';
import {
  allocateTechnicianToLabTest,
  loadAllLabSamples,
} from '../../store/actions';

@Component({
  selector: 'app-sample-tests-allocation',
  templateUrl: './sample-tests-allocation.component.html',
  styleUrls: ['./sample-tests-allocation.component.scss'],
})
export class SampleTestsAllocationComponent implements OnInit {
  samplesGroupedBymrNo$: Observable<SampleObject[]>;
  currentSample$: Observable<SampleObject>;
  expandedRow: number;
  samplesAllocationObject = {};
  savingStatus = {};
  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(loadAllLabSamples());
    this.samplesGroupedBymrNo$ = this.store.select(
      getLabSamplesGroupedBymrNoAndFilteredByStatus,
      { status: 'ACCEPTED' }
    );
  }

  onToggleExpand(sample, rowNumber) {
    this.currentSample$ = of(sample);
  }

  getValue(technician, sampleId) {
    this.samplesAllocationObject[sampleId] = technician;
  }

  allocateTechnician(e, sample) {
    e.stopPropagation();
    this.dialog.open(AllocateTechnicianModalComponent, {
      width: '60%',
      height: '450px',
      disableClose: false,
      data: sample,
      panelClass: 'custom-dialog-container',
    });
  }
}
