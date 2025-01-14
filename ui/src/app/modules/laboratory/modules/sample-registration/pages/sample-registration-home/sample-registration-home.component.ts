import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { iCareConnectConfigurationsModel } from "src/app/core/models/lis-configurations.model";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptGetFull } from "src/app/shared/resources/openmrs";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentUserDetails,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import { getLISConfigurations } from "src/app/store/selectors/lis-configurations.selectors";

@Component({
  selector: "app-sample-registration-home",
  templateUrl: "./sample-registration-home.component.html",
  styleUrls: ["./sample-registration-home.component.scss"],
})
export class SampleRegistrationHomeComponent implements OnInit {
  provider$: Observable<any>;
  LISConfigurations$: Observable<iCareConnectConfigurationsModel>;
  labSections$: Observable<ConceptGetFull[]>;
  specimenSources$: Observable<any[]>;
  personEmailAttributeTypeUuid$: Observable<string>;
  personPhoneAttributeTypeUuid$: Observable<string>;
  currentUser$: Observable<any>;
  sampleRegistrationCategoriesConceptUuid$: Observable<string>;
  errors: any[] = [];
  constructor(
    private store: Store<AppState>,
    private conceptService: ConceptsService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.provider$ = this.store.select(getProviderDetails);
    this.LISConfigurations$ = this.store.select(getLISConfigurations);
    this.labSections$ =
      this.conceptService.getConceptsBySearchTerm("LAB_DEPARTMENT");

    this.specimenSources$ =
      this.conceptService.getConceptsBySearchTerm("SPECIMEN_SOURCE");
    this.personEmailAttributeTypeUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `icare.person.attribute.email`
      );
    this.personPhoneAttributeTypeUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `icare.person.attribute.email`
      );

    this.sampleRegistrationCategoriesConceptUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `lis.registration.sampleRegistrationCategories.concept.uuid`
      );
    this.sampleRegistrationCategoriesConceptUuid$.subscribe((response: any) => {
      if (response && response === "none") {
        this.errors = [
          ...this.errors,
          {
            error: {
              error:
                "Key lis.registration.sampleRegistrationCategories.concept.uuid as not available",
              message:
                "Key lis.registration.sampleRegistrationCategories.concept.uuid as not available",
            },
          },
        ];
      }
    });
  }
}
