import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatSelectChange } from "@angular/material/select";
import { omit, keyBy } from "lodash";
import { Observable } from "rxjs";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { SamplesService } from "src/app/shared/services/samples.service";

@Component({
  selector: "app-shared-samples-list",
  templateUrl: "./shared-samples-list.component.html",
  styleUrls: ["./shared-samples-list.component.scss"],
})
export class SharedSamplesListComponent implements OnInit {
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

  pageCounts: any[] = [1, 5, 10, 20, 25, 50, 100, 200];

  searchingTestField: any;
  keyedSelectedSamples: any = {};
  constructor(private sampleService: SamplesService) {}

  ngOnInit(): void {
    this.getSamples({
      category: this.category,
      hasStatus: this.hasStatus,
      pageSize: this.pageSize,
      page: this.page,
    });
    this.searchingTestField = new Dropdown({
      id: "test",
      key: "test",
      label: "Search by Test",
      searchControlType: "concept",
      searchTerm: "TEST_ORDERS",
      conceptClass: "Test",
      shouldHaveLiveSearchForDropDownFields: true,
    });
  }

  getSamples(params?: any): void {
    this.samples$ = this.sampleService.getLabSamplesByCollectionDates(
      this.datesParameters,
      params?.category,
      params?.hasStatus,
      this.excludeAllocations,
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
      params?.testUuid
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
    this.getSamples({
      category: this.category,
      hasStatus: this.hasStatus,
      pageSize: this.pageSize,
      page: 1,
      q: this.searchingText,
      dapartment: event?.value?.uuid,
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
    this.getSamples({
      category: this.category,
      hasStatus: this.hasStatus,
      pageSize: this.pageSize,
      page: 1,
      q: this.searchingText,
      testUuid: formValue.getValues()?.test?.value,
    });
  }
}
