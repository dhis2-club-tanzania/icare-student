import { Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { forkJoin, Observable, zip } from "rxjs";
import { AppState } from "src/app/store/reducers";
import {
  getCountOfCurrentReportSubmittedToDHIS2,
  getDHIS2ReportsConfigsById,
  getDHIS2ReportsLoadedState,
  getParentLocationTree,
} from "src/app/store/selectors";
import { ReportGroup } from "../../models/report-group.model";
import { Report } from "../../models/report.model";
import * as _ from "lodash";
import {
  clearSendingDataStatus,
  loadAllLocations,
  loadDHIS2ReportsConfigs,
  loadReport,
  loadReportLogs,
  loadReportLogsByReportId,
  setCurrentPeriod,
} from "src/app/store/actions";
import { SendToDhis2ModalComponent } from "../../components/send-to-dhis2-modal/send-to-dhis2-modal.component";
import { SendingStatusModalComponent } from "../../components/sending-status-modal/sending-status-modal.component";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ExportDataService } from "src/app/core/services/export-data.service";
import { Dhis2ReportsSentSummaryComponent } from "../../components/dhis2-reports-sent-summary/dhis2-reports-sent-summary.component";
import { ReportParamsService } from "src/app/core/services/report-params.service";
import { ReportService } from "src/app/core/services/report.service";

@Component({
  selector: "app-reports-generator",
  templateUrl: "./reports-generator.component.html",
  styleUrls: ["./reports-generator.component.scss"],
})
export class ReportsGeneratorComponent implements OnInit {
  @Input() reportsAccessConfigurations: any;
  @Input() userPrivileges: any;
  @Input() reportsCategoriesConfigurations: any;
  @Input() reportsExtraParams: any;
  @Input() reportGroups: ReportGroup[];
  @Input() reportsParametersConfigurations: any;
  @Input() standardReports: any[];
  reportConfigs$: Observable<any>;
  reportLoaded$: Observable<boolean>;
  loadingReportGroup: boolean;
  locations$: Observable<any>;
  searchText: string = "";
  dhisReport: boolean;
  reportCategories: any[];
  currentReportGroup: ReportGroup;
  currentReport: any;
  reportCategory;
  reports: any[] = [];
  reportFromSelectedGroup: any[] = [];
  selectedReportGroup: any;
  period: any;
  reportSelectionParams: any = null;
  countOfReportsSent$: Observable<any>;
  renderDhisReport: boolean;
  showReportArea: boolean;
  loadingReport: boolean;
  currentVisualization: string;
  currentLocation: string;

  reportData: any;
  reportError: any;
  hasError: boolean;
  showFullReportRenderingArea: boolean = false;
  isQuickPivotSet: boolean = false;
  count: number = 1;

  selectedReportParameters: {
    order?: string;
    id: string;
    type: string;
    name: string;
    label: string;
    options?: any[];
  }[];
  countOfSelectedParams: number;
  keyedReportsExtraParameters: any = {};
  useDefaultDatesParametersConfigs: boolean = true;
  standardReportIsReady: boolean = false;
  constructor(
    private reportParamsService: ReportParamsService,
    private reportService: ReportService,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private exportDataService: ExportDataService
  ) {}

  ngOnInit(): void {
    this.standardReports = this.standardReports
      ? this.standardReports?.map((report) => {
          return {
            ...report,
            dataSetUuid: JSON.parse(report?.value)?.id,
            value: JSON.parse(report?.value),
          };
        })
      : [];

    const allReports = _.flatten(
      this.reportGroups?.map((reportCategory) => {
        return reportCategory?.reports?.map((report) => {
          return {
            ...report,
            category: reportCategory,
            group:
              reportCategory?.name?.toLowerCase() !== "reports"
                ? report?.name?.split(" ")[0]
                : "Reports",
          };
        });
      })
    );
    const reportsKeyedByGroup = _.keyBy(allReports, "group");
    const formattedReportGroups = Object.keys(reportsKeyedByGroup).map(
      (key) => {
        return {
          id: key,
          name: key,
          label: key,
          reports: reportsKeyedByGroup[key],
        };
      }
    );
    this.reportCategories = formattedReportGroups
      .map((formattedReportGroup) => {
        const reportCategoryAccesses =
          this.reportsAccessConfigurations.filter(
            (acessConfig) => acessConfig?.id === formattedReportGroup?.id
          ) || [];
        const formattedReportCategory = {
          ...formattedReportGroup,
          currentUserCanAccess:
            (
              reportCategoryAccesses.filter(
                (reportCategoryAccess) =>
                  this.userPrivileges[reportCategoryAccess?.privilege]
              ) || []
            )?.length > 0
              ? true
              : this.userPrivileges["REPORT_ALL"] || this.userPrivileges["ALL"]
              ? true
              : false,
        };
        return formattedReportCategory;
      })
      .filter((reportCategory) => reportCategory?.currentUserCanAccess);

    let extraParamsArray =
      this.reportsExtraParams?.results?.length > 0
        ? _.filter(this.reportsExtraParams?.results, (res) => {
            return res?.property == "dhis.reportsConfigs" ? true : false;
          })
        : [];
    this.reportsExtraParams =
      extraParamsArray?.length > 0
        ? JSON.parse(extraParamsArray[0]?.value)
        : [];

    this.keyedReportsExtraParameters = _.keyBy(this.reportsExtraParams, "id");

    _.each(this.reportGroups, (reportGroup) => {
      this.reports = _.concat(
        this.reports,
        _.map(reportGroup?.reports, (report) => {
          return {
            ...report,
            reportGroup: reportGroup?.id,
            fieldName: report?.name,
          };
        })
      );
    });

    this.store.dispatch(loadDHIS2ReportsConfigs());
    this.currentVisualization = "TABLE";
    this.loadingReportGroup = true;

    this.reportLoaded$ = this.store.select(getDHIS2ReportsLoadedState);

    this.locations$ = this.store.pipe(select(getParentLocationTree));
  }

  onSelectPeriod(period) {
    this.period = {
      ...period,
      id: period?.periodId ? period?.periodId : period?.id,
    };
    this.store.dispatch(setCurrentPeriod({ period }));
    if (period?.id && this.currentReport?.id) {
      this.store.dispatch(
        loadReportLogs({
          reportId: this.currentReport?.id,
          periodId: period?.id,
        })
      );
    }
  }

  toggleReportArea(event: Event): void {
    event.stopPropagation();
    this.showFullReportRenderingArea = !this.showFullReportRenderingArea;
  }

  setReportCategory(reportCategory) {
    this.selectedReportGroup = reportCategory;
    this.selectedReportParameters = null;
    this.reportSelectionParams = null;
    this.showReportArea = false;
    this.reportFromSelectedGroup = _.map(
      _.filter(this.reports, (report) => {
        return report?.name
          ?.toLowerCase()
          .startsWith(reportCategory.toLowerCase());
      }),
      (reportSelected) => {
        return {
          ...reportSelected,
          name: reportSelected?.name?.slice(
            reportCategory?.length,
            reportSelected?.name?.length
          ),
        };
      }
    ).filter((report) => {
      if (
        (
          this.reportsAccessConfigurations.filter(
            (reportAccessConfig) =>
              reportAccessConfig?.id === report?.id &&
              this.userPrivileges[reportAccessConfig?.privilege]
          ) || []
        )?.length > 0 ||
        this.userPrivileges["REPORT_ALL"] ||
        this.userPrivileges["ALL"]
      ) {
        return report;
      }
    });
  }

  onSelectReport(e: Event, report: any, standardReports: any[]) {
    e.stopPropagation();
    this.store.dispatch(loadReportLogsByReportId({ reportId: report?.id }));
    // this.store.dispatch(clearReportSelections());

    this.reportConfigs$ = this.store.select(getDHIS2ReportsConfigsById, {
      id: report?.id,
    });

    this.countOfReportsSent$ = this.store.select(
      getCountOfCurrentReportSubmittedToDHIS2
    );
    this.currentReport = {
      ...report,
      standardReport: (standardReports?.filter(
        (standardReport) => standardReport?.value?.id === report?.id
      ) || [])[0],
    };

    const matchedReportWithParametersConfigs =
      (this.reportsParametersConfigurations.filter(
        (reportConfigs) => reportConfigs?.id === this.currentReport?.id
      ) || [])[0];
    this.useDefaultDatesParametersConfigs =
      matchedReportWithParametersConfigs?.hasNonDefaultDatesConfigs
        ? false
        : true;
    this.selectedReportParameters = (
      matchedReportWithParametersConfigs
        ? matchedReportWithParametersConfigs?.parameters
        : report?.parameters
    ).map((param) => {
      return {
        ...param,
        name: this.sanitizeParameter(param?.lable ? param.lable : param?.name),
        type: param?.type === "DATETIME" ? "DATE" : param?.type,
      };
    });
    this.reportSelectionParams = null;
    this.reportData = null;
    this.reportError = null;
    this.hasError = false;
    this.dhisReport = false;
  }

  onLocationUpdate(location) {
    this.currentLocation = location.uuid;
    this.onSetParameterValue({ location: location.uuid });
  }

  onSetParameterValue(paramValue: any, itemsType?: string) {
    this.reportSelectionParams = !this.reportSelectionParams
      ? {}
      : this.reportSelectionParams;
    this.reportSelectionParams = !itemsType
      ? {
          ...this.reportSelectionParams,
          ...paramValue,
        }
      : paramValue;
    this.countOfSelectedParams = Object.keys(this.reportSelectionParams).filter(
      (keyItem) => this.reportSelectionParams[keyItem] !== undefined
    ).length;
  }

  getDHIS2ReportsSent(event: Event): void {
    event.stopPropagation();
    this.dialog.open(Dhis2ReportsSentSummaryComponent, {
      width: "70%",
    });
  }

  onSendToDHIS2(e, reportConfigs, currentReport): void {
    if (e) {
      e.stopPropagation();
    }

    this.dialog
      .open(SendToDhis2ModalComponent, {
        data: {
          reportId: currentReport?.id,
          configs: reportConfigs,
          period: this.period,
          report: currentReport,
        },
        minHeight: "180px",
        maxHeight: "200px",
        width: "400px",
        panelClass: "custom-dialog-container",
        disableClose: false,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((shouldOPenStatusModal) => {
        if (shouldOPenStatusModal) {
          this.dialog
            .open(SendingStatusModalComponent, {
              data: {
                reportId: currentReport?.id,
                configs: reportConfigs,
                period: this.period,
                report: currentReport,
              },
              minHeight: "310px",
              maxHeight: "310px",
              width: "380px",
              panelClass: "custom-dialog-container",
              disableClose: false,
            })
            .afterClosed()
            .subscribe(() => {
              this.store.dispatch(clearSendingDataStatus());
            });
        }
      });
  }

  onRunReport(e: Event, dhisConfigs?: any, period?: any, reportConfigs?: any) {
    e.stopPropagation();

    this.renderDhisReport = false;
    this.standardReportIsReady = false;

    setTimeout(() => {
      if (dhisConfigs) {
        this.showReportArea = false;

        const params =
          this.period?.startDate && this.period?.endDate
            ? {
                startDate: period?.startDate,
                endDate: period?.endDate,
                reportId: reportConfigs?.id,
                reportGroup: reportConfigs?.reportGroup,
                reportName: reportConfigs?.name,
                periodId: period?.id ? period?.id : period.periodId,
                configs: reportConfigs,
                params: [
                  `startDate=${period?.startDate}`,
                  `endDate=${period?.endDate}`,
                ],
              }
            : {
                reportName: "dhis2.sqlGet." + reportConfigs?.id,
                date: period?.date,
                periodId: period?.id ? period?.id : period.periodId,
                configs: reportConfigs,
              };

        // console.log('params before the dispatch : ', params);

        this.store.dispatch(loadReport({ params }));

        setTimeout(() => {
          this.showReportArea = true;
        }, 200);
      } else if (!this.currentReport?.standardReport) {
        this.loadingReport = true;
        this.reportData = null;
        this.reportError = null;
        this.hasError = false;
        this.dhisReport = false;
        this.reportService
          .getReport({
            reportGroup: this.currentReport?.reportGroup,
            reportId: this.currentReport?.id,
            params: ((this.selectedReportParameters as any) || []).map(
              (param) => `${param.id}=${this.reportSelectionParams[param.id]}`
            ),
          })
          .subscribe(
            (res) => {
              this.loadingReport = false;
              this.showReportArea = true;
              this.reportData = res;

              this.dhisReport = this.isDhisReport(this.reportData);
            },
            (error) => {
              this.reportError = error;
              this.hasError = true;
              this.loadingReport = false;
            }
          );
      } else {
        this.showReportArea = true;
        this.standardReportIsReady = true;
      }
    }, 50);
  }

  sendDhisReport() {
    this.reportService.sendDhisData(this.reportData).subscribe(
      (res) => {
        //console.log(res);
      },
      (error) => {
        // console.log("error :: ", error);
      }
    );
  }

  onDateChange(e, dateType) {
    this.reportSelectionParams[dateType] = new Date(e.value).toISOString();
  }

  onSelectLocation(e, node) {
    e.stopPropagation();
    //console.log(node);
  }

  isDhisReport(repData) {
    let existsDataSetWithDXConcept = false;

    _.each(repData?.dataSets, (dataSet) => {
      if (
        _.filter(dataSet?.metadata?.columns, (metadataColumn) => {
          return (
            metadataColumn?.name && metadataColumn?.name.startsWith("DXConcept")
          );
        })?.length > 0
      ) {
        existsDataSetWithDXConcept = true;
      }
    });

    return existsDataSetWithDXConcept;
  }

  downloadToExcel(event: Event, dataToDownload, currentReport): void {
    event.stopPropagation();
    this.exportDataService.exportAsExcelFile(
      dataToDownload?.dataSets[0]?.rows,
      currentReport?.name
    );
  }

  exportData(
    event: Event,
    id: string,
    reportName: string,
    isIframe?: boolean
  ): void {
    const fileName =
      "Report for " + reportName + new Date().toLocaleDateString();
    event.stopPropagation();
    let htmlTable;
    if (isIframe) {
      const iframe: any = document.getElementById(id);
      const iWindow = iframe.contentWindow;
      const iDocument = iWindow.document;

      // accessing the element
      htmlTable = iDocument.getElementsByTagName("body")[0].outerHTML;
    } else {
      htmlTable = document.getElementById(id).outerHTML;
    }
    if (htmlTable) {
      const uri = "data:application/vnd.ms-excel;base64,",
        template =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:' +
          'office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
          "<x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>" +
          "</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->" +
          '</head><body><table border="1">{table}</table><br /><table border="1">{table}</table></body></html>',
        base64 = (s) => window.btoa(unescape(encodeURIComponent(s))),
        format = (s, c) => s.replace(/{(\w+)}/g, (m, p) => c[p]);

      const ctx = { worksheet: "Data", filename: fileName };
      let str =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office' +
        ':excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
        "<x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>" +
        "</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>";
      ctx["div"] = htmlTable;

      str += "{div}</body></html>";
      const link = document.createElement("a");
      link.download = fileName + ".xlsx";
      link.href = uri + base64(format(str, ctx));
      link.click();
    }
  }

  setQuickPivot(event: Event): void {
    event.stopPropagation;
    setTimeout(() => {
      this.isQuickPivotSet = !this.isQuickPivotSet;
    }, 100);
  }

  sanitizeParameter(text) {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
