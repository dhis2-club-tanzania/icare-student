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
  selector: "app-completed-samples",
  templateUrl: "./completed-samples.component.html",
  styleUrls: ["./completed-samples.component.scss"],
})
export class CompletedSamplesComponent implements OnInit {
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

  completedSamples$: Observable<any[]>;
  selectedDepartment: string;
  searchingText: string;
  excludeAllocations: boolean = true;

  page: number = 1;
  pageCount: number = 100;

  savingMessage: any = {};
  providerDetails$: Observable<any>;
  tabType: string = "completed-samples";

  samplesToViewMoreDetails: any = {};
  saving: boolean = false;
  @Output() dataToPrint: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private store: Store<AppState>,
    private sampleService: SamplesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.providerDetails$ = this.store.select(getProviderDetails);
  }

  getSamples(): void {
    this.completedSamples$ = this.sampleService.getLabSamplesByCollectionDates(
      this.datesParameters,
      "RESULT_AUTHORIZATION",
      "YES",
      this.excludeAllocations,
      this.tabType,
      null,
      null,
      {
        departments: this.labSamplesDepartments,
        specimenSources: this.sampleTypes,
        codedRejectionReasons: this.codedSampleRejectionReasons,
      }
    );
  }

  onToggleViewSampleDetails(event: Event, sample: any): void {
    event.stopPropagation();
  }

  onGetSelectedSampleDetails(sample: any, providerDetails: any): void {
    this.dataToPrint.emit({
      ...sample,
      providerDetails,
    });
  }
}
