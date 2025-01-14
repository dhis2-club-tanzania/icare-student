import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SamplesService } from "src/app/shared/services/samples.service";
import { AppState } from "src/app/store/reducers";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-worklist",
  templateUrl: "./worklist.component.html",
  styleUrls: ["./worklist.component.scss"],
})
export class WorklistComponent implements OnInit {
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

  samplesAcceptedByMe$: Observable<any[]>;
  selectedDepartment: string;
  searchingText: string;
  excludeAllocations: boolean = true;
  excludedSampleCategories: string[] = ["HAS_RESULTS", "REJECTED"];
  tabType: string = "sample-tracking";
  page: number = 1;
  pageCount: number = 100;

  savingMessage: any = {};
  providerDetails$: Observable<any>;

  samplesToViewMoreDetails: any = {};
  saving: boolean = false;
  constructor(
    private store: Store<AppState>,
    private sampleService: SamplesService
  ) {}

  ngOnInit(): void {
    this.providerDetails$ = this.store.select(getProviderDetails);
  }

  getSamples(): void {
    const acceptedBy = this.userUuid;
    this.samplesAcceptedByMe$ =
      this.sampleService.getLabSamplesByCollectionDates(
        this.datesParameters,
        "ACCEPTED",
        "YES",
        this.excludeAllocations,
        this.tabType,
        this.excludedSampleCategories,
        null,
        {
          departments: this.labSamplesDepartments,
          specimenSources: this.sampleTypes,
          codedRejectionReasons: this.codedSampleRejectionReasons,
        },
        acceptedBy
      );
    this.samplesAcceptedByMe$.subscribe((res) => {});
  }

  onToggleViewSampleDetails(event: Event, sample: any): void {
    event.stopPropagation();
    // console.log(sample);
  }
}
