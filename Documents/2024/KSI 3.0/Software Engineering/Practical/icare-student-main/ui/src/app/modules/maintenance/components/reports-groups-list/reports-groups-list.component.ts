import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { flatten, keyBy, groupBy } from "lodash";
import { ManageReportModalComponent } from "../../modals/manage-report-modal/manage-report-modal.component";
import { ReportAccessAndConfisSettingsModalComponent } from "../../modals/report-access-and-confis-settings-modal/report-access-and-confis-settings-modal.component";

@Component({
  selector: "app-reports-groups-list",
  templateUrl: "./reports-groups-list.component.html",
  styleUrls: ["./reports-groups-list.component.scss"],
})
export class ReportsGroupsListComponent implements OnInit {
  @Input() accessConfigs: any[];
  @Input() userRoles: any[];
  @Input() reports: any[];
  @Input() standardReports: any[];
  @Input() reportsParametersConfigurations: any;
  formattedReportGroups: any[];
  privileges: any = {};
  @Output() reloadList: EventEmitter<any> = new EventEmitter<any>();
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const keyedParametersConfigs = keyBy(
      this.reportsParametersConfigurations?.value,
      "id"
    );
    this.standardReports = this.standardReports
      ? this.standardReports?.map((report) => {
          return {
            ...report,
            dataSetUuid: JSON.parse(report?.value)?.id,
            value: JSON.parse(report?.value),
          };
        })
      : [];
    this.privileges = keyBy(
      flatten(
        this.userRoles?.map((userRole) => {
          return userRole?.privileges?.map((priv) => {
            return {
              ...priv,
              role: userRole,
            };
          });
        })
      ),
      "uuid"
    );
    const accessConfigsKeyedByReportOrReportGroup = keyBy(
      this.accessConfigs,
      "id"
    );
    const groupedReports = groupBy(
      this.reports?.map((report) => {
        return {
          ...report,
          privilege:
            this.privileges[
              accessConfigsKeyedByReportOrReportGroup[report?.id]?.privilege
            ],
        };
      }),
      "group"
    );
    this.formattedReportGroups = Object.keys(groupedReports).map((key) => {
      return {
        group: {
          name: key,
          privilege:
            this.privileges[
              accessConfigsKeyedByReportOrReportGroup[key]?.privilege
            ],
        },
        reports: groupedReports[key]?.map((report) => {
          return {
            ...report,
            parametersConfigurations:
              keyedParametersConfigs[report?.id]?.parameters,
            standardDefinition:
              this.standardReports?.length > 0
                ? keyBy(this.standardReports, "dataSetUuid")[report?.id]
                : null,
            group: {
              name: key,
              privilege:
                this.privileges[
                  accessConfigsKeyedByReportOrReportGroup[key]?.privilege
                ],
            },
          };
        }),
      };
    });
  }

  onDelete(report: any): void {
    // console.log(report);
  }

  onOpenSettings(report: any): void {
    this.dialog
      .open(ReportAccessAndConfisSettingsModalComponent, {
        data: {
          ...report,
          reportsParametersConfigurations: this.reportsParametersConfigurations,
        },
        width: "60%",
      })
      .afterClosed()
      .subscribe(() => {
        this.reloadList.emit(true);
      });
  }

  onEdit(report: any): void {
    this.dialog
      .open(ManageReportModalComponent, {
        data: report,
        width: "60%",
      })
      .afterClosed()
      .subscribe(() => {
        this.reloadList.emit(true);
      });
  }
}
