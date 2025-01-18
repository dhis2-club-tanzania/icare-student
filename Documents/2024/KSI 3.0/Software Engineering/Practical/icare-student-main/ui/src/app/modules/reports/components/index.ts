import { ParameterFieldComponent } from "./parameter-field/parameter-field.component";
import { ReportTableComponent } from "./report-table/report-table.component";
import { ChartComponent } from "./chart/chart.component";
import { LocationTreeComponent } from "./location-tree/location-tree.component";
import { ConceptEditComponent } from "./concept-edit/concept-edit.component";
import { ReportPeriodFilterComponent } from "./report-period-filter/report-period-filter.component";
import { ReportComponent } from "./report/report.component";
import { SendingStatusModalComponent } from "./sending-status-modal/sending-status-modal.component";
import { SendToDhis2ModalComponent } from "./send-to-dhis2-modal/send-to-dhis2-modal.component";
import { ImportDetailsComponent } from "./import-details/import-details.component";
import { EventsDataComponent } from "./events-data/events-data.component";
import { DataHistoryModalComponent } from "./data-history-modal/data-history-modal.component";
import { ReportSentHistoryModalComponent } from "./report-sent-history-modal/report-sent-history-modal.component";
import { PivotHeaderComponent } from "./pivot-header/pivot-header.component";
import { PivotLayoutModelComponent } from "./pivot-layout-model/pivot-layout-model.component";
import { Dhis2ReportsSentSummaryComponent } from "./dhis2-reports-sent-summary/dhis2-reports-sent-summary.component";

export const reportComponents: any[] = [
  ParameterFieldComponent,
  ReportTableComponent,
  ChartComponent,
  LocationTreeComponent,
  ConceptEditComponent,
  ReportPeriodFilterComponent,
  ReportComponent,
  SendingStatusModalComponent,
  SendToDhis2ModalComponent,
  ImportDetailsComponent,
  EventsDataComponent,
  DataHistoryModalComponent,
  ReportSentHistoryModalComponent,
  PivotHeaderComponent,
  PivotLayoutModelComponent,
  Dhis2ReportsSentSummaryComponent,
];

export const entryReportsComponents: any[] = [
  PivotLayoutModelComponent,
  Dhis2ReportsSentSummaryComponent,
];
