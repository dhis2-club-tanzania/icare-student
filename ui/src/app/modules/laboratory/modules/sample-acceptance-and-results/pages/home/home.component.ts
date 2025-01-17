import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { AppState } from "src/app/store/reducers";
import {
  getAllPatientsVisitsReferences,
  getAllSampleTypes,
  getCodedSampleRejectionReassons,
  getLabConfigurations,
  getLabDepartments,
  getLabTestsContainers,
  getSampleTypesLoadedState,
  getVisitsLoadedState,
  getVisitsParameters,
} from "src/app/store/selectors";
import { getLISConfigurations } from "src/app/store/selectors/lis-configurations.selectors";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  datesParameters$: Observable<any>;
  visitReferences$: Observable<any>;
  visitsLoadedState$: Observable<boolean>;
  labSamplesDepartments$: Observable<any>;
  labSamplesContainers$: Observable<any>;
  sampleTypesLoadedState$: Observable<any>;
  sampleTypes$: Observable<any>;
  configs$: Observable<any>;
  LISConfigurations$: Observable<any>;
  codedSampleRejectionReasons$: Observable<any[]>;
  constructor(
    private store: Store<AppState>,
    private conceptService: ConceptsService
  ) {}

  ngOnInit(): void {
    this.datesParameters$ = this.store.select(getVisitsParameters);
    this.visitsLoadedState$ = this.store.select(getVisitsLoadedState);
    this.visitReferences$ = this.store.select(getAllPatientsVisitsReferences);
    this.sampleTypesLoadedState$ = this.store.select(getSampleTypesLoadedState);
    this.labSamplesContainers$ = this.store.select(getLabTestsContainers);
    this.configs$ = this.store.select(getLabConfigurations);

    this.LISConfigurations$ = this.store.select(getLISConfigurations);
    this.labSamplesDepartments$ = this.store.select(getLabDepartments);

    this.sampleTypes$ = this.store.select(getAllSampleTypes);

    this.codedSampleRejectionReasons$ = this.store.select(
      getCodedSampleRejectionReassons
    );

    this.LISConfigurations$ = this.store.select(getLISConfigurations);
    // Load departments depending either is LIS or not
    this.LISConfigurations$.subscribe((LISConfigs) => {
      if (LISConfigs) {
        this.labSamplesDepartments$ = !LISConfigs?.isLIS
          ? this.store.select(getLabDepartments)
          : this.conceptService.getConceptsBySearchTerm("LAB_DEPARTMENT");
        this.sampleTypes$ = !LISConfigs?.isLIS
          ? this.store.select(getAllSampleTypes)
          : this.conceptService.getConceptsBySearchTerm("SPECIMEN_SOURCE");
      }
    });
  }
}
