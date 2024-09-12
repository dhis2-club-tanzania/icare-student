import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ManageReportsModalComponent } from "../../dialogs/manage-reports-modal/manage-reports-modal.component";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-shared-reports-list",
  templateUrl: "./shared-reports-list.component.html",
  styleUrls: ["./shared-reports-list.component.scss"],
})
export class SharedReportsListComponent implements OnInit {
  reports$: Observable<any[]>;
  @Input() currentUser: any;
  searchingText: string;
  selectedReport: any;
  deleting: boolean = false;
  @Output() shouldReload: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private dialog: MatDialog,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.loadStandardReport();
  }

  loadStandardReport(): void {
    this.reports$ = this.systemSettingsService.getSystemSettingsMatchingAKey(
      `iCare.reports.standardReports`
    );
  }

  onSearchReport(event: KeyboardEvent): void {
    this.searchingText = (event?.target as HTMLInputElement)?.value;
  }

  onViewReport(event: Event, report: any): void {
    event.stopPropagation();
    this.selectedReport = report;
  }

  getBackToReportsList(backToList: boolean): void {
    if (backToList) {
      this.selectedReport = null;
    }
  }

  onAddNew(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(ManageReportsModalComponent, {
        minWidth: "60%",
        data: {
          currentUser: this.currentUser,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.loadStandardReport();
      });
  }

  onDelete(event: Event, report: any): void {
    event.stopPropagation();
    this.deleting = true;
    this.systemSettingsService
      .deleteSystemSettingByUuid(report?.uuid)
      .subscribe((response) => {
        if (response) {
          this.deleting = false;
          this.loadStandardReport();
        }
      });
  }
}
