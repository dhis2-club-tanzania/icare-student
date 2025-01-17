import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-dialog',
  template: `
    <h2 mat-dialog-title>Notification</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
      <p *ngIf="data.details"><strong>Details:</strong> {{ data.details }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      h2 {
        font-size: 20px;
        margin: 0;
      }
      mat-dialog-content {
        font-size: 16px;
      }
      mat-dialog-actions {
        justify-content: flex-end;
      }
    `,
  ],
})
export class NotificationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}



