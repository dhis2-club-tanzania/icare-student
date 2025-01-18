import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ManageSystemSettingComponent } from "../../../../shared/dialogs/manage-system-setting/manage-system-setting.component";

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
    private dialog: MatDialog
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
        width: "40%",
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

  onDelete(event: Event, systemSettingUid: string): void {
    event.stopPropagation();
    this.saving = true;
    this.systemSettingsService
      .deleteSystemSettingByUuid(systemSettingUid)
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

  onClose(event: Event): void {
    event.stopPropagation();
    this.error = null;
  }
}
