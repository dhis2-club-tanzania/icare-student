import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  addLabDepartments,
  loadLabSamplesByCollectionDates,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getCodedSampleRejectionReassons,
  getFormattedLabSamplesForTracking,
  getFormattedLabSamplesLoadedState,
  getLabConfigurations,
} from "src/app/store/selectors";
import { getCurrentUserPrivileges } from "src/app/store/selectors/current-user.selectors";
import { BarCodeModalComponent } from "../../../../../../shared/dialogs/bar-code-modal/bar-code-modal.component";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { iCareConnectConfigurationsModel } from "src/app/core/models/lis-configurations.model";

@Component({
  selector: "app-sample-tracking-dashboard",
  templateUrl: "./sample-tracking-dashboard.component.html",
  styleUrls: ["./sample-tracking-dashboard.component.scss"],
})
export class SampleTrackingDashboardComponent implements OnInit {
  @Input() datesParameters: any;
  @Input() patients: any;
  @Input() sampleTypes: any;
  @Input() labSamplesDepartments: any;
  @Input() labSamplesContainers: any;
  @Input() configs: any;
  @Input() codedSampleRejectionReasons: any;
  @Input() LISConfigurations: iCareConnectConfigurationsModel;
  labConfigs$: Observable<any>;
  privileges$: Observable<any>;
  codedSampleRejectionReasons$: Observable<any[]>;
  samplesLoadedState$: Observable<any>;
  searchingText: string = "";
  allSamples$: Observable<any[]>;
  selectedDepartment: string = "";
  samplesToViewMoreDetails: any = {};
  barcodeSettings$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(
      addLabDepartments({ labDepartments: this.labSamplesDepartments })
    );

    this.codedSampleRejectionReasons$ = this.store.select(
      getCodedSampleRejectionReassons
    );

    this.labConfigs$ = this.store.select(getLabConfigurations);

    this.privileges$ = this.store.select(getCurrentUserPrivileges);

    this.samplesLoadedState$ = this.store.select(
      getFormattedLabSamplesLoadedState
    );

    this.barcodeSettings$ = this.systemSettingsService
      .getSystemSettingsByKey("iCare.laboratory.settings.print.barcodeFormat")
      .pipe
      // tap((response) => {
      //   if (response === "none") {
      //     this.errors = [
      //       ...this.errors,
      //       {
      //         error: {
      //           message:
      //             "iCare.laboratory.settings.print.barcodeFormat is not set. You won't be able to print barcode.",
      //         },
      //         type: "warning",
      //       },
      //     ];
      //   }
      //   if (response?.error) {
      //     this.errors = [...this.errors, response?.error];
      //   }
      // })
      ();
  }

  setDepartment(department) {
    this.selectedDepartment = department;
    this.allSamples$ = this.store.select(getFormattedLabSamplesForTracking, {
      department: this.selectedDepartment,
      searchingText: this.searchingText,
    });
  }

  onSearch(e) {
    if (e) {
      e.stopPropagation();
      this.allSamples$ = this.store.select(getFormattedLabSamplesForTracking, {
        department: this.selectedDepartment,
        searchingText: this.searchingText,
      });
    }
  }

  onToggleViewSampleDetails(event: Event, sample: any): void {
    event.stopPropagation();
    this.samplesToViewMoreDetails[sample?.id] = !this.samplesToViewMoreDetails[
      sample?.id
    ]
      ? sample
      : null;
  }

  onPrintBarCodes(event: Event, sample: any): void {
    event.stopPropagation();
    const sampleDetails = {
      label: sample?.label,
      orders: sample?.orders?.map((order) => {
        return {
          ...order?.order?.concept,
        };
      }),
    };
    this.dialog.open(BarCodeModalComponent, {
      height: "200px",
      width: "15%",
      data: {
        sampleLabelsUsedDetails: [sampleDetails],
      },
      disableClose: false,
      panelClass: "custom-dialog-container",
    });
  }
}
