import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentUserDetails,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-cashier-home",
  templateUrl: "./cashier-home.component.html",
  styleUrls: ["./cashier-home.component.scss"],
})
export class CashierHomeComponent implements OnInit {
  currentUser$: Observable<any>;
  pharmacyClientDetailsFormUuid$: Observable<string>;
  currentLocation: any;
  visitUuid$: Observable<string>;
  patientUuid$: Observable<string>;
  encounterTypeUuid$: Observable<string>;
  provider$: Observable<any>;
  prescriptionVariables$: Observable<any>;
  shouldShowDoseDetails$: Observable<string>;
  constructor(
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.provider$ = this.store.select(getProviderDetails);
    // TODO: Add support to catch errors in case configs miss
    this.pharmacyClientDetailsFormUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `iCareConnect.pharmacy.form.clientDetails.uid`
      );
    this.visitUuid$ = this.systemSettingsService.getSystemSettingsByKey(
      `iCareConnect.pharmacy.visitUuid`
    );
    this.patientUuid$ = this.systemSettingsService.getSystemSettingsByKey(
      `iCareConnect.pharmacy.patientUuid`
    );
    this.encounterTypeUuid$ = this.systemSettingsService.getSystemSettingsByKey(
      `iCareConnect.pharmacy.encounterTypeUuid`
    );
    this.prescriptionVariables$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `iCare.clinic.prescription.arrangement`
      );
    this.shouldShowDoseDetails$ =
      this.systemSettingsService.getSystemSettingsByKey(
        `iCareConnect.pharmacy.shouldShowDoseDetails`
      );

    this.currentLocation = localStorage.getItem(`currentLocation`)
      ? JSON.parse(localStorage.getItem(`currentLocation`))
      : null;
  }
}
