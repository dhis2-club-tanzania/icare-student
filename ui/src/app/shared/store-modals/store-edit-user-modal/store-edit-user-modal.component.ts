import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-store-edit-user-modal",
  templateUrl: "./store-edit-user-modal.component.html",
  styleUrls: ["./store-edit-user-modal.component.scss"],
})
export class StoreEditUserModalComponent implements OnInit {
  securitySystemSettings$: Observable<any>;
  constructor(
    private dialogRef: MatDialogRef<StoreEditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.securitySystemSettings$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey("security.");
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onCancel(shouldClose: boolean): void {
    if (shouldClose) {
      this.dialogRef.close();
    }
  }
}
