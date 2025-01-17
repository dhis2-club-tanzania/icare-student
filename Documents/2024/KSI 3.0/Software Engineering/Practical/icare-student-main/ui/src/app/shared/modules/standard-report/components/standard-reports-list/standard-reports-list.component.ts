import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "lib-standard-reports-list",
  templateUrl: "./standard-reports-list.component.html",
  styleUrls: ["./standard-reports-list.component.scss"],
})
export class StandardReportsListComponent implements OnInit {
  reports$: Observable<any[]>;
  @Output() selectedReport: EventEmitter<any> = new EventEmitter<any>();
  constructor(private systemSettingsService: SystemSettingsService) {}

  ngOnInit(): void {
    this.reports$ = this.systemSettingsService.getSystemSettingsMatchingAKey(
      `iCare.reports.standardReports`
    );
  }

  onEdit(report: any): void {
    this.selectedReport.emit(report);
  }
}
