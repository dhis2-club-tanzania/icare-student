import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatRadioChange } from "@angular/material/radio";
import { MatSelectChange } from "@angular/material/select";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { omit, keyBy } from "lodash";
import { Observable, of } from "rxjs";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { SamplesService } from "src/app/shared/services/samples.service";
import { AppState } from "src/app/store/reducers";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";
import { VisitsService } from "../../resources/visits/services";
import { map } from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";
import { BarCodeModalComponent } from "src/app/shared/dialogs/bar-code-modal/bar-code-modal.component";
import { formatDateToYYMMDD } from "../../helpers/format-date.helper";

@Component({
  selector: "app-shared-samples-list",
  templateUrl: "./shared-samples-list.component.html",
  styleUrls: ["./shared-samples-list.component.scss"],
})
export class SharedSamplesListComponent implements OnInit, AfterViewInit {
  @Input() LISConfigurations: any;
  @Input() labSamplesDepartments: any;
  @Input() tabType: string;
  @Input() datesParameters: any;
  @Input() excludeAllocations: boolean;
  @Input() sampleTypes: any[];
  @Input() codedSampleRejectionReasons: any[];
  @Input() category: string;
  @Input() hasStatus: string;
  @Input() acceptedBy: string;
  @Input() showLegend: boolean;
  @Input() barcodeSettings: any;
  @Input() excludedSampleCategories: string[];
  samplesToViewMoreDetails: any = {};
  selectedDepartment: string;
  searchingText: string;
  page: number = 1;
  pageSize: number = 10;
  @Output() resultEntrySample: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedSampleDetails: EventEmitter<any> = new EventEmitter<any>();
  selectedSamples: any[] = [];
  @Output() samplesForAction: EventEmitter<any[]> = new EventEmitter<any[]>();

  samples$: Observable<{ pager: any; results: any[] }>;
  labEquipments$: Observable<any[]>;

  pageCounts: any[] = [1, 5, 10, 20, 25, 50, 100, 200];

  searchingTestField: any;
  searchingSpecimenSourceField: any;
  searchingEquipmentsField: any;
  keyedSelectedSamples: any = {};
  instrumentUuid: string;
  testUuid: string;
  specimenUuid: string;
  dapartment: string;
  connection: any;

  itemsToShow: any = {};
  currentUser$: Observable<any>;
  listType: string = "patients";

  currentSamplesByVisits$: Observable<any[]>;
  currentVisit: any;
  sampleVisitParameters: any;
  allCurrentPatientSamplesSelected: boolean = false;
  currentPatientSelectedSamples: any = {};
  currentPatientSelectedSamplesCount: number = 0;
  constructor(
    private sampleService: SamplesService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private visitsService: VisitsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.connection = webSocket(this.barcodeSettings?.socketUrl);
    this.connection.subscribe({
      next: (msg) => console.log("message received: ", msg), // Called whenever there is a message from the server.
      error: (err) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log("complete"), // Called when connection is closed (for whatever reason).
    });
    // [tabType]="'completed-samples'"
    if (this.listType === "samples") {
      
      this.getSamples({
        category: this.category,
        hasStatus: this.hasStatus,
        pageSize: this.pageSize,
        page: this.page,
      });
    } else {
      this.getPatients();
    }
    this.cdr.detectChanges(); 
  }

  ngOnInit(): void {
    this.listType = !this.LISConfigurations?.isLIS ? "patients" : "samples";
    this.pageSize = this.tabType == "completed-samples"?200:100;
    this.sampleVisitParameters = {
      hasStatus: this.hasStatus,
      sampleCategory:
        this.category === "COLLECTED" && this.tabType !== "sample-tracking"
          ? "NOT ACCEPTED"
          : this.category,
    };
    
    this.searchingTestField = new Dropdown({
      id: "test",
      key: "test",
      label: "Search by Test",
      searchControlType: "concept",
      searchTerm: "TEST_ORDERS",
      conceptClass: "Test",
      shouldHaveLiveSearchForDropDownFields: true,
    });

    this.searchingSpecimenSourceField = new Dropdown({
      id: "specimen",
      key: "specimen",
      label: "Search by Specimen type",
      searchControlType: "concept",
      searchTerm: "SPECIMEN_SOURCE",
      conceptClass: "Specimen",
      shouldHaveLiveSearchForDropDownFields: true,
    });
    // TODO: Consider to put class name for instruments on global property
    this.searchingEquipmentsField = new Dropdown({
      id: "instrument",
      key: "instrument",
      label: "Search by Instrument/Method",
      searchControlType: "concept",
      searchTerm: "LIS_INSTRUMENT",
      conceptClass: "LIS instrument",
      shouldHaveLiveSearchForDropDownFields: true,
    });

    this.currentUser$ = this.store.select(getCurrentUserDetails);
  }

  toggleCurrentPatientSamples(event: MatCheckboxChange, samples: any[]): void {
    if (event.checked) {
      this.allCurrentPatientSamplesSelected = true;
      this.currentPatientSelectedSamples = keyBy(samples, "uuid");
    } else {
      this.allCurrentPatientSamplesSelected = false;
      this.currentPatientSelectedSamples = {};
    }
    this.currentPatientSelectedSamplesCount = Object.keys(
      this.currentPatientSelectedSamples
    )?.length;
  }

  toggleCurrentPatientSample(
    event: MatCheckboxChange,
    sample: any,
    allSamples: any[]
  ): void {
    if (event.checked) {
      this.currentPatientSelectedSamples[sample?.uuid] = sample;
      this.allCurrentPatientSamplesSelected =
        allSamples?.length ===
        Object.keys(this.currentPatientSelectedSamples)?.length;
    } else {
      this.currentPatientSelectedSamples = omit(
        this.currentPatientSelectedSamples,
        sample?.id
      );
      this.allCurrentPatientSamplesSelected = false;
    }
    this.currentPatientSelectedSamplesCount = Object.keys(
      this.currentPatientSelectedSamples
    )?.length;
  }

  onRejectAllCurrentPatientSamples(event: Event): void {
    event.stopPropagation();
    this.selectedSampleDetails.emit({
      data: Object.keys(this.currentPatientSelectedSamples).map(
        (key) => this.currentPatientSelectedSamples[key]
      ),
      actionType: "reject",
    });
    this.allCurrentPatientSamplesSelected = false;
    this.currentPatientSelectedSamples = {};
    this.currentPatientSelectedSamplesCount = 0;
  }

  onAcceptAllCurrentPatientSamples(event: Event): void {
    event.stopPropagation();

    this.selectedSampleDetails.emit({
      data: Object.keys(this.currentPatientSelectedSamples).map(
        (key) => this.currentPatientSelectedSamples[key]
      ),
      actionType: "accept",
    });
    this.allCurrentPatientSamplesSelected = false;
    this.currentPatientSelectedSamples = {};
    this.currentPatientSelectedSamplesCount = 0;
  }

  toggleListType(event: MatRadioChange): void {
    this.listType = event.value;
    if (this.listType === "samples") {
      this.getSamples({
        pageSize: this.pageSize,
        page: this.page,
        category:
          this.category === "COLLECTED" && this.tabType !== "sample-tracking"
            ? "NOT ACCEPTED"
            : this.category,
        hasStatus: this.hasStatus,
      });
    } else {
      this.getPatients();
    }
  }

  toggleItemToShow(event: MatCheckboxChange, item: string): void {
    if (event?.checked) {
      this.itemsToShow[item] = true;
    } else {
      this.itemsToShow[item] = false;
    }
  }

  getPatients(): void {
    this.samples$ = this.visitsService
      .getAllVisits(
        null,
        false,
        false,
        null,
        0,
        this.pageSize,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        this.category,
        this.excludedSampleCategories
      )
      .pipe(
        map((response) => {
          return {
            pager: null,
            results: response?.map((visitData) => visitData?.visit),
          };
        })  
      );
      
  }

  getSamplesListByVisit(event: Event, visit: any, parameters: any): void {
    event.stopPropagation();
    this.currentVisit = visit;
    this.currentSamplesByVisits$ = this.visitsService.getSamplesByVisitUuid(
      visit?.uuid,
      parameters
    );
    
  }

  getSamples(params?: any): void {
    const category =
      params.category === "COLLECTED" && this.tabType !== "sample-tracking"
        ? "NOT ACCEPTED"
        : params.category;
    this.samples$ = this.sampleService.getLabSamplesByCollectionDates(
      this.datesParameters,
      category,
      params?.hasStatus,
      this.excludeAllocations,
      this.tabType ? this.tabType : null,
      this.excludedSampleCategories ? this.excludedSampleCategories : null,
      {
        pageSize: params?.pageSize,
        page: params?.page,
      },
      {
        departments: this.labSamplesDepartments,
        specimenSources: this.sampleTypes,
        codedRejectionReasons: this.codedSampleRejectionReasons,
      },
      this.acceptedBy,
      params?.q,
      params?.dapartment,
      params?.testUuid,
      params?.instrument,
      params?.specimenUuid,
      this.LISConfigurations?.isLIS
        ? localStorage?.getItem("currentLocation").indexOf("{") > -1
          ? JSON.parse(localStorage?.getItem("currentLocation"))?.uuid
          : null
        : null
    );
  }

  onPageChange(event: any): void {
    this.page = this.page + (event?.pageIndex - event?.previousPageIndex);
    this.pageSize = event?.pageSize;
    this.getSamples({
      category: this.category,
      hasStatus: this.hasStatus,
      pageSize: this.pageSize,
      page: this.page,
      testUuid: this.testUuid,
      specimenUuid: this.specimenUuid,
      instrument: this.instrumentUuid,
      dapartment: this.dapartment,
    });
  }

  onToggleViewSampleDetails(event: Event, sample: any): void {
    event.stopPropagation();
    if (!this.samplesToViewMoreDetails[sample?.uuid]) {
      this.samplesToViewMoreDetails[sample?.uuid] = sample;
    } else {
      this.samplesToViewMoreDetails = omit(
        this.samplesToViewMoreDetails,
        sample?.uuid
      );
    }
  }

  onSelectDepartment(event: MatSelectChange): void {
    this.dapartment = event?.value?.uuid;
    this.getSamples({
      category: this.category,
      hasStatus: this.hasStatus,
      pageSize: this.pageSize,
      page: 1,
      q: this.searchingText,
      testUuid: this.testUuid,
      specimenUuid: this.specimenUuid,
      instrument: this.instrumentUuid,
      dapartment: this.dapartment,
    });
  }

  onResultsEntryAndReview(e: Event, sample: any): void {
    e.stopPropagation();
    this.resultEntrySample.emit(sample);
  }

  onPrint(event: Event, sample: any): void {
    event.stopPropagation();
    this.selectedSampleDetails.emit(sample);
  }

  onAccept(event: Event, samples: any[], actionType?: string): void {
    event.stopPropagation();
    this.selectedSampleDetails.emit({ data: samples, actionType });
  }
  onReject(event: Event, samples: any[], actionType?: string): void {
    event.stopPropagation();
    this.selectedSampleDetails.emit({ data: samples, actionType });
  }

  onGetSelectedSampleDetails(event: Event, sample: any, action: string): void {
    event.stopPropagation();
    this.selectedSampleDetails.emit({ data: sample, action: action });
  }

  onSelectItem(event: MatCheckboxChange, sample: any): void {
    this.selectedSamples = event?.checked
      ? [...this.selectedSamples, sample]
      : this.selectedSamples?.filter(
          (selectedSample) => selectedSample?.label !== sample?.label
        ) || [];
    this.keyedSelectedSamples[sample?.id] = sample;
    this.samplesForAction.emit(this.selectedSamples);
  }

  onSelectAll(event: MatCheckboxChange, samples: any[]): void {
    this.selectedSamples = [];
    this.selectedSamples = event?.checked
      ? [...this.selectedSamples, ...samples]
      : [];
    this.keyedSelectedSamples =
      this.selectedSamples?.length > 0 ? keyBy(this.selectedSamples, "id") : {};
    this.samplesForAction.emit(this.selectedSamples);
  }

  onSearchSamples(event): void {
    this.searchingText = (event.target as HTMLInputElement)?.value;
    this.getSamples({
      category: this.category,
      hasStatus: this.hasStatus,
      pageSize: this.pageSize,
      page: 1,
      q: this.searchingText,
    });
  }

  onSearchByTest(formValue: FormValue): void {
    this.testUuid = formValue.getValues()?.test?.value;
    this.getSamples({
      category: this.category,
      hasStatus: this.hasStatus,
      pageSize: this.pageSize,
      page: 1,
      q: this.searchingText,
      testUuid: this.testUuid,
      specimenUuid: this.specimenUuid,
      instrument: this.instrumentUuid,
      dapartment: this.dapartment,
    });
  }

  onSearchBySpecimen(formValue: FormValue): void {
    this.specimenUuid = formValue.getValues()?.specimen?.value;
    this.getSamples({
      category: this.category,
      hasStatus: this.hasStatus,
      pageSize: this.pageSize,
      page: 1,
      q: this.searchingText,
      testUuid: this.testUuid,
      specimenUuid: this.specimenUuid,
      instrument: this.instrumentUuid,
      dapartment: this.dapartment,
    });
  }

  onSearchByEquipment(formValue: FormValue): void {
    this.instrumentUuid = formValue.getValues()?.instrument?.value;
    this.getSamples({
      instrument: this.instrumentUuid,
      category: this.category,
      hasStatus: this.hasStatus,
      pageSize: this.pageSize,
      page: 1,
      q: this.searchingText,
      testUuid: this.testUuid,
      specimenUuid: this.specimenUuid,
      dapartment: this.dapartment,
    });
  }

  onDispose(event: Event, sample: any): void {
    event.stopPropagation();
    this.selectedSampleDetails.emit(sample);
  }

  onPrintBarcode(event: Event, sample: any): void {
    const data = {
      identifier: sample?.label,
      sample: sample,
      sampleLabelsUsedDetails: [sample],
      isLis: this.LISConfigurations?.isLIS,
    };

    this.dialog
      .open(BarCodeModalComponent, {
        height: "200px",
        width: "20%",
        data,
        disableClose: false,
        panelClass: "custom-dialog-container",
      })
      .afterClosed()
      .subscribe((results) => {
        if (results) {
          let tests = [];
          results?.sampleData?.orders?.forEach((order) => {
            tests = [
              ...tests,
              order?.order?.shortName?.split("TEST_ORDERS:")?.join(""),
            ];
          });

          const message = {
            SampleID: results?.sampleData?.label,
            Tests: tests?.join(","),
            PatientNames: `${results?.sampleData?.patient?.givenName} ${
              results?.sampleData?.patient?.middleName?.length
                ? results?.sampleData?.patient?.middleName
                : ""
            } ${results?.sampleData?.patient?.familyName}`,
            Date: formatDateToYYMMDD(
              new Date(results?.sampleData?.created),
              true
            ),
            Storage: "",
            Department:
              results?.sampleData?.department?.shortName
                ?.split("LAB_DEPARTMENT:")
                .join("") || "",
            BarcodeData: results?.sampleData?.label
              ?.split(this.barcodeSettings?.textToIgnore)
              .join(""),
          };

          this.connection.next({
            Message: message,
            Description: "Message of data to be printed",
            Type: "print",
          });
        }
      });
  }
}
