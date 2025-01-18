import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { loadReport } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getDHIS2LoadedReportsById,
  getDhis2ReportLoadingError,
  getDhis2ReportLoadingState,
  getDHIS2ReportsLoadedState,
} from "src/app/store/selectors/dhis2-reports.selectors";
import { DataHistoryModalComponent } from "../data-history-modal/data-history-modal.component";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit, OnChanges {
  @Input() period: any;
  @Input() reportConfigs: any;
  reportLoadedState$: Observable<boolean>;
  reportLoadingState$: Observable<boolean>;
  reportErrorState$: Observable<any>;
  report$: Observable<any>;
  @Output() sendingEventObject: EventEmitter<any> = new EventEmitter<any>();
  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.reportLoadedState$ = this.store.select(getDHIS2ReportsLoadedState);
    this.reportErrorState$ = this.store.select(getDhis2ReportLoadingError);
    this.reportLoadingState$ = this.store.select(getDhis2ReportLoadingState);
    this.report$ = this.store.select(getDHIS2LoadedReportsById, {
      id: this.reportConfigs?.id,
      periodId: this.period?.id,
    });
  }

  ngOnChanges() {
    //TODO :: fix period id on individual date
  }

  onOpenChangesModal(e, dataChangesDetails, elementHeader) {
    e.stopPropagation();
    this.dialog.open(DataHistoryModalComponent, {
      data: {
        dataChangesDetails: dataChangesDetails,
        elementHeader: elementHeader,
      },
      minHeight: "180px",
      maxHeight: "220px",
      width: "400px",
      panelClass: "custom-dialog-container",
      disableClose: false,
    });
  }

  onSendEventData(eventData) {
    // console.log(eventData);
    this.sendingEventObject.emit({
      eventData,
      reportConfigs: this.reportConfigs,
      mrn: eventData?.response?.identifier,
      eventDate: eventData?.eventDate,
    });
  }
}
