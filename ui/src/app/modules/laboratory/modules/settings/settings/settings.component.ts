import { Component, OnInit } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentUserDetails,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import { getLISConfigurations } from "src/app/store/selectors/lis-configurations.selectors";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { iCareConnectConfigurationsModel } from "src/app/core/models/lis-configurations.model";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { go } from "src/app/store/actions";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  selectedTab = new UntypedFormControl(0);

  LISConfigurations$: Observable<iCareConnectConfigurationsModel>;
  provider$: Observable<any>;
  labSections$: any;
  currentUser$: Observable<any>;
  selectedIndex: number = 0;
  sampleRegistrationCategoriesConceptUuid$: Observable<any>;
  errors: any[] = [];
  constructor(
    private store: Store<AppState>,
    private conceptService: ConceptsService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    try {
      this.selectedIndex =
        localStorage.getItem("labSettingsModuleTab") &&
        Number(JSON.parse(localStorage.getItem("labSettingsModuleTab"))?.index)
          ? Number(
              JSON.parse(localStorage.getItem("labSettingsModuleTab"))?.index
            )
          : this.selectedIndex;
      const label: string =
        localStorage.getItem("labSettingsModuleTab") &&
        JSON.parse(localStorage.getItem("labSettingsModuleTab"))?.label
          ? JSON.parse(localStorage.getItem("labSettingsModuleTab"))?.label
          : "";
      this.store.dispatch(
        go({
          path: ["/laboratory/settings"],
          query: { queryParams: { tab: label } },
        })
      );
    } catch (error) {
      console.log(error);
    }

    this.LISConfigurations$ = this.store.select(getLISConfigurations);
    this.provider$ = this.store.select(getProviderDetails);
    this.labSections$ =
      this.conceptService.getConceptsBySearchTerm("LAB_DEPARTMENT");

    this.currentUser$ = this.store.select(getCurrentUserDetails);

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

  onChangeTab(event: MatTabChangeEvent): void {
    const tabsDetails: any = {
      index: event?.index,
      label: event?.tab?.textLabel?.split(" ").join("-"),
    };
    localStorage.setItem("labSettingsModuleTab", JSON.stringify(tabsDetails));
    this.store.dispatch(
      go({
        path: ["/laboratory/settings"],
        query: { queryParams: { tab: tabsDetails?.label } },
      })
    );
  }
}
