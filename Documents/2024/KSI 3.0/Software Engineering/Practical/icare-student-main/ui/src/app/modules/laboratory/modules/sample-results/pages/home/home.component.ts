import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { LISConfigurationsModel } from "src/app/modules/laboratory/resources/models/lis-configurations.model";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { AppState } from "src/app/store/reducers";
import {
  getAllSampleTypes,
  getCodedSampleRejectionReassons,
  getLabConfigurations,
  getLabDepartments,
  getLabTestsContainers,
  getSampleTypesLoadedState,
} from "src/app/store/selectors";
import {
  getCurrentUserDetails,
  getCurrentUserPrivileges,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import { getLISConfigurations } from "src/app/store/selectors/lis-configurations.selectors";
import {
  getAllPatientsVisitsReferences,
  getVisitsLoadedState,
  getVisitsParameters,
} from "src/app/store/selectors/visits.selectors";

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
  codedSampleRejectionReasons$: Observable<any>;

  LISConfigurations$: Observable<LISConfigurationsModel>;
  currentUser$: Observable<any>;
  privileges$: Observable<any>;
  providerDetails$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private conceptService: ConceptsService
  ) {}

  ngOnInit(): void {
    this.datesParameters$ = this.store.select(getVisitsParameters);
    this.visitsLoadedState$ = this.store.select(getVisitsLoadedState);
    this.visitReferences$ = this.store.select(getAllPatientsVisitsReferences);
    this.sampleTypesLoadedState$ = this.store.select(getSampleTypesLoadedState);
    this.sampleTypes$ = this.store.select(getAllSampleTypes);
    this.labSamplesContainers$ = this.store.select(getLabTestsContainers);
    this.configs$ = this.store.select(getLabConfigurations);
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

    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.privileges$ = this.store.select(getCurrentUserPrivileges);
    this.providerDetails$ = this.store.select(getProviderDetails);
  }
}
