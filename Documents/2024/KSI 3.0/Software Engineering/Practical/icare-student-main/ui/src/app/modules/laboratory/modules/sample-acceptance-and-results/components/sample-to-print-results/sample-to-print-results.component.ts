import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SamplesService } from "src/app/shared/services/samples.service";
import { AppState } from "src/app/store/reducers";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { groupBy } from "lodash";
import { PrintResultsModalComponent } from "../print-results-modal/print-results-modal.component";
import { LabSample } from "src/app/modules/laboratory/resources/models";

@Component({
  selector: "app-sample-to-print-results",
  templateUrl: "./sample-to-print-results.component.html",
  styleUrls: ["./sample-to-print-results.component.scss"],
})
export class SampleToPrintResultsComponent implements OnInit {
  @Input() codedSampleRejectionReasons: any;
  @Input() labConfigs: any;
  @Input() datesParameters: any;
  @Input() patients: any[];
  @Input() sampleTypes: any;
  @Input() labSamplesDepartments: any;
  @Input() labSamplesContainers: any;
  @Input() currentUser: any;
  @Input() LISConfigurations: any;
  @Input() userUuid: string;
  @Input() category: string;
  @Input() hasStatus: string;

  completedSamples$: Observable<any[]>;
  selectedDepartment: string;
  searchingText: string;
  excludeAllocations: boolean = true;

  page: number = 1;
  pageCount: number = 100;

  savingMessage: any = {};
  providerDetails$: Observable<any>;

  samplesToViewMoreDetails: any = {};
  saving: boolean = false;
  dataForPrinting: any;
  @Output() dataToPrint: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private store: Store<AppState>,
    private sampleService: SamplesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.providerDetails$ = this.store.select(getProviderDetails);
  }

  onToggleViewSampleDetails(event: Event, sample: any): void {
    event.stopPropagation();
  }

  onGetSelectedSampleDetails(sample: any, providerDetails: any): void {
    this.sampleService
      .getFormattedSampleByUuid(
        sample?.uuid,
        this.labSamplesDepartments,
        this.sampleTypes,
        this.codedSampleRejectionReasons
      )
      .pipe(
        map((response) => {
          const filteredCompletedSamples = [
            {
              ...response,
              mrn: response?.mrn,
              departmentName: response?.department?.name,
            },
          ];
          const groupedByMRN = groupBy(filteredCompletedSamples, "mrn");
          return Object.keys(groupedByMRN).map((key) => {
            const samplesKeyedByDepartments = groupBy(
              groupedByMRN[key],
              "departmentName"
            );
            return {
              mrn: key,
              patient: groupedByMRN[key][0]?.sample?.patient,
              departments: Object.keys(samplesKeyedByDepartments).map(
                (depName) => {
                  return {
                    departmentName: depName,
                    samples: samplesKeyedByDepartments[depName].map(
                      (sampleObject) => {
                        const sample = new LabSample(
                          sampleObject,
                          this.labSamplesDepartments,
                          this.sampleTypes,
                          this.codedSampleRejectionReasons
                        ).toJSon();
                        return sample;
                      }
                    ),
                  };
                }
              ),
            };
          });
        })
      )
      .subscribe((response) => {
        this.dataForPrinting = {
          patientDetailsAndSamples: response[0],
          labConfigs: this.labConfigs,
          LISConfigurations: this.LISConfigurations,
          user: providerDetails,
          authorized: true,
        };
        this.dataToPrint.emit(this.dataForPrinting);
        // this.dialog.open(PrintResultsModalComponent, {
        //   data: {
        //     patientDetailsAndSamples: response[0],
        //     labConfigs: this.labConfigs,
        //     LISConfigurations: this.LISConfigurations,
        //     user: providerDetails,
        //     authorized: true,
        //   },
        //   width: "60%",
        //   maxHeight: "85%",
        //   disableClose: false,
        // });
      });
  }
}
