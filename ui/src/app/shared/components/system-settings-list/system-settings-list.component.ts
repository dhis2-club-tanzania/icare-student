import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ManageSystemSettingComponent } from "../../dialogs/manage-system-setting/manage-system-setting.component";
import { SharedConfirmationDialogComponent } from "../shared-confirmation-dialog/shared-confirmation-dialog.component";
import { SharedConfirmationComponent } from "../shared-confirmation/shared-confirmation.component";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";

@Component({
  selector: "app-system-settings-list",
  templateUrl: "./system-settings-list.component.html",
  styleUrls: ["./system-settings-list.component.scss"],
})
export class SystemSettingsListComponent implements OnInit {
  systemSettings$: Observable<any>;
  page: number = 1;
  pageSize: number = 10;
  @Input() key: string;
  error: any;

  saving: boolean = false;
  constructor(
    private systemSettingsService: SystemSettingsService,
    private dialog: MatDialog,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.getSystemSettings();
  }

  getSystemSettings(): void {
    this.systemSettings$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey(this.key, {
        startIndex: (this.page - 1) * this.pageSize,
        limit: this.pageSize,
      });
  }

  openModal(event: Event, data: any, isNew?: boolean): void {
    event.stopPropagation();
    this.dialog
      .open(ManageSystemSettingComponent, {
        minWidth: "40%",
        data: {
          ...(!isNew ? data : {}),
          key: this.key,
          isNew: isNew,
        },
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.getSystemSettings();
        }
      });
      this.trackActionForAnalytics(`Add New System Settings: Open`);
  }


  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }

  getItems(event: Event, action: string): void {
    event.stopPropagation();
    this.page = action === "next" ? this.page + 1 : this.page - 1;
    this.systemSettings$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey(this.key, {
        startIndex: (this.page - 1) * this.pageSize,
        limit: this.pageSize,
      });
  }

  onDelete(event: Event, systemSetting: any): void {
    event.stopPropagation();
    // console.log(systemSetting);
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        minWidth: "30%",
        data: {
          header: `<b style="margin-botton: 16px;">Delete system setting</b>`,
          message: `Are you sure to delete system setting at ${systemSetting?.property}`,
          color: "warn",
        },
        disableClose: false,
        panelClass: "custom-dialog-container",
      })
      .afterClosed()
      .subscribe((confirmed?: boolean) => {
        if (confirmed) {
          this.saving = true;
          this.systemSettingsService
            .deleteSystemSettingByUuid(systemSetting?.uuid)
            .subscribe((response) => {
              if (response && !response?.error) {
                this.error = null;
                this.saving = false;
                this.getSystemSettings();
              } else if (response && response?.error) {
                this.saving = false;
                this.error = response?.error;
              }
            });
        }
      });
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.error = null;
  }
}
