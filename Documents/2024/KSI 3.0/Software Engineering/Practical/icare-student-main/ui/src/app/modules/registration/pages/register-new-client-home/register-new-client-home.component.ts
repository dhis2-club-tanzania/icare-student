import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { RegistrationService } from "../../services/registration.services";

@Component({
  selector: "app-register-new-client-home",
  templateUrl: "./register-new-client-home.component.html",
  styleUrls: ["./register-new-client-home.component.scss"],
})
export class RegisterNewClientHomeComponent implements OnInit {
  registrationMRNSourceReference$: Observable<any>;
  registrationFormConfigs$: Observable<any>;
  occupationConceptUuid$: Observable<string>;
  additionalClientInformationConceptUuid$: Observable<string>;
  relationShipTypesConceptUuid$: Observable<string>;
  genderOptionsConceptUuid$: Observable<string>;
  residenceDetailsLocationUuid$: Observable<any>;
  constructor(
    private registrationService: RegistrationService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.registrationFormConfigs$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey(
        "icare.registration.form"
      );
    this.registrationMRNSourceReference$ =
      this.registrationService.getRegistrationMRNSource();
    this.occupationConceptUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "icare.registration.form.occupation"
      );
    this.additionalClientInformationConceptUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.registration.form.additionalClientInformation.conceptUuid"
      );

    this.relationShipTypesConceptUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.registration.form.clientRelationShipTypes.conceptUuid"
      );
    this.genderOptionsConceptUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.registration.genderOptions.conceptUuid"
      );
    this.residenceDetailsLocationUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "icare.registration.form.contactInfo.residenceLocationUuid"
      );
  }
}
