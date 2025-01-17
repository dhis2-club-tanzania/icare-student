import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SamplesService } from "src/app/shared/services/samples.service";
import { AppState } from "src/app/store/reducers";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { groupBy } from "lodash";
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
    this.dataToPrint.emit({
      ...sample,
      providerDetails,
    });
  }
}
