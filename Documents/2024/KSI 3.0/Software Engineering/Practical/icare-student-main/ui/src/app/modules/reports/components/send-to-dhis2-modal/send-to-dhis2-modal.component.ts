import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { createDHIS2Object } from 'src/app/shared/helpers/format-report.helper';
import { ConfigsService } from 'src/app/shared/services/configs.service';
import { sendDataToDHIS2, sendEventData } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import {
  getCurrentReportLogs,
  getDHIS2LoadedReportsById,
  getErrorSendingDataToDHIS2,
  getSendingDataToDHIS2HasError,
  getSendToDHIS2LOadingState,
  getSendToDHIS2SuccessState,
} from 'src/app/store/selectors/dhis2-reports.selectors';
import * as _ from 'lodash';

@Component({
  selector: 'app-send-to-dhis2-modal',
  templateUrl: './send-to-dhis2-modal.component.html',
  styleUrls: ['./send-to-dhis2-modal.component.scss'],
})
export class SendToDhis2ModalComponent implements OnInit {
  reportId: string;
  reportConfigs: any;
  period: any;
  currentReport: any;
  report$: Observable<any>;
  sendingToDHIS2State$: Observable<boolean>;
  sendingDataToDHIS2HasErrorState$: Observable<boolean>;
  sendingDataToDHIS2Error$: Observable<any>;
  sentDataSuccessState$: Observable<boolean>;
  facilityConfigs$: Observable<any>;
  currentReportLogs$: Observable<any[]>;
  constructor(
    private matDialogRef: MatDialogRef<SendToDhis2ModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<AppState>,
    private configsService: ConfigsService
  ) {
    this.reportId = data?.reportId;
    this.reportConfigs = data?.configs;
    this.currentReport = data?.report;
    this.period = data?.period;
  }

  ngOnInit(): void {
    if (this.reportConfigs?.reportingFrequency !== 'Range') {
      this.report$ = this.store.select(getDHIS2LoadedReportsById, {
        id: this.reportConfigs.id,
        periodId: this.period.id,
      });
    }

    this.currentReportLogs$ = this.store.select(getCurrentReportLogs, {
      id: this.reportId,
    });

    this.facilityConfigs$ = this.configsService.getFacilityConfigs();
    this.sendingToDHIS2State$ = this.store.select(getSendToDHIS2LOadingState);
    this.sendingDataToDHIS2HasErrorState$ = this.store.select(
      getSendingDataToDHIS2HasError
    );
    this.sendingDataToDHIS2Error$ = this.store.select(
      getErrorSendingDataToDHIS2
    );
    this.sentDataSuccessState$ = this.store.select(getSendToDHIS2SuccessState);
  }

  onConfirm(e, report, facilityConfigs) {
    e.stopPropagation();
    let facilityConfigsArray =
      facilityConfigs?.results?.length > 0
        ? _.filter(facilityConfigs?.results, (res) => {
            return res?.property == 'dhis2.facility_details' ? true : false;
          })
        : [];

    facilityConfigs =
      facilityConfigsArray?.length > 0
        ? JSON.parse(facilityConfigsArray[0]?.value)
        : {};

    if (!report?.eventDate) {
      this.store.dispatch(
        sendDataToDHIS2({
          data: createDHIS2Object(
            report,
            this.period,
            this.reportConfigs,
            facilityConfigs
          ),
          report: this.reportConfigs,
          period: this.period?.id,
        })
      );
    } else {
      // console.log("dsdsds", this.reportConfigs);
      this.store.dispatch(
        sendEventData({
          data: createDHIS2Object(
            report?.eventData,
            null,
            this.reportConfigs,
            facilityConfigs
          ),
          reportConfigs: report?.reportConfigs,
          eventDate: report?.eventDate,
          mrn: report?.mrn,
        })
      );
    }
    this.matDialogRef.close(true);
    // console.log("gdgd", report);
  }

  onCancel(e) {
    e.stopPropagation();
    this.matDialogRef.close(false);
  }
}
