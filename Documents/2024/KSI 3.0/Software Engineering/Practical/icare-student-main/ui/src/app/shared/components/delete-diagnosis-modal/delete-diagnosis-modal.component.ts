import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { deleteDiagnosis } from 'src/app/store/actions/diagnosis.actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-delete-diagnosis-modal',
  templateUrl: './delete-diagnosis-modal.component.html',
  styleUrls: ['./delete-diagnosis-modal.component.scss'],
})
export class DeleteDiagnosisModalComponent implements OnInit {
  diagnosis: any;
  constructor(
    private dialogRef: MatDialogRef<DeleteDiagnosisModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<AppState>
  ) {
    this.diagnosis = data?.diagnosis;
  }

  ngOnInit(): void {}

  onConfirmDelete(event: Event, diagnosis): void {
    event.stopPropagation();
    this.store.dispatch(deleteDiagnosis({ uuid: diagnosis?.uuid }));
    this.dialogRef.close();
  }
}
