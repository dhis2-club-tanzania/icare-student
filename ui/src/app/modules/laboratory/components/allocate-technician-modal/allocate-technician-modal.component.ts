import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SampleObject } from '../../resources/models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import {
  getLabSampleById,
  getAllLabSamples,
} from '../../store/selectors/samples.selectors';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { allocateTechnicianToLabTest, loadUsers } from '../../store/actions';
import { UserGet } from 'src/app/shared/resources/openmrs';
import { getAllUsers } from '../../store/selectors/users.selectors';

@Component({
  selector: 'app-allocate-technician-modal',
  templateUrl: './allocate-technician-modal.component.html',
  styleUrls: ['./allocate-technician-modal.component.scss'],
})
export class AllocateTechnicianModalComponent implements OnInit {
  technician: any;
  currentSample$: Observable<SampleObject>;
  users$: Observable<UserGet[]>;
  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<AllocateTechnicianModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.currentSample$ = this.store.select(getLabSampleById, { id: data?.id });
  }

  ngOnInit(): void {
    this.store.dispatch(loadUsers());
    this.users$ = this.store.select(getAllUsers);
  }

  getValue(val) {
    this.technician = val;
  }

  saveTestAllocation(e, testOrder, sample) {
    e.stopPropagation();

    this.store.dispatch(
      allocateTechnicianToLabTest({
        sample,
        orderWithAssignedPerson: {
          ...testOrder,
          technician: this.technician,
        },
      })
    );
  }

  onCloseDialog(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }
}
