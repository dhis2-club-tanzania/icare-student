import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reject-answer-modal',
  templateUrl: './reject-answer-modal.component.html',
  styleUrls: ['./reject-answer-modal.component.scss'],
})
export class RejectAnswerModalComponent implements OnInit {
  reason: string = null;
  constructor(private dialogRef: MatDialogRef<RejectAnswerModalComponent>) {}

  ngOnInit(): void {}

  setReasonValue(reason) {
    this.reason = reason;
  }

  onSave(e) {
    e.stopPropagation();
    this.dialogRef.close(this.reason);
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close('');
  }
}
