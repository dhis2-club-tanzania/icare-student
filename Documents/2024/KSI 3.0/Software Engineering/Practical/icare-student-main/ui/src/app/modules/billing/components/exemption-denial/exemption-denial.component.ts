import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exemption-denial',
  templateUrl: './exemption-denial.component.html',
  styleUrls: ['./exemption-denial.component.scss'],
})
export class ExemptionDenialComponent implements OnInit {
  reason: any;
  constructor(
    private matDialogRef: MatDialogRef<ExemptionDenialComponent>
  ) {}

  ngOnInit() {}

  onCancel(e): void {
    e.stopPropagation();
    this.matDialogRef.close();
  }

  onConfirm(e): void {
    e.stopPropagation();
    this.matDialogRef.close({ confirmed: true, reason: this.reason });
  }
}
