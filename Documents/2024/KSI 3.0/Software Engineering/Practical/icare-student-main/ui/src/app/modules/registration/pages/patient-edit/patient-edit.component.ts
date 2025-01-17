import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { patientObj } from "src/app/shared/models/patient";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { PatientGetFull } from "src/app/shared/resources/openmrs";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { RegistrationService } from "../../services/registration.services";

@Component({
  selector: "app-patient-edit",
  templateUrl: "./patient-edit.component.html",
  styleUrls: ["./patient-edit.component.scss"],
})
export class PatientEditComponent implements OnInit {
  patientDetails$: Observable<Patient>;
  patientId: string;
  registrationConfigurations$: Observable<any>;
  registrationFormConfigs$: any;

  occupationConceptUuid$: any;
  additionalClientInformationConceptUuid$: any;
  relationShipTypesConceptUuid$: any;
  genderOptionsConceptUuid$: any;
  residenceDetailsLocationUuid$: any;

  constructor(
    private store: Store,
    private openmrService: OpenmrsHttpClientService,
    private route: ActivatedRoute,
    private registrationService: RegistrationService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.params["patientId"];
    this.patientDetails$ = this.openmrService
      .get(`patient/${this.patientId}?v=full`)
      .pipe(
        map((response) => {
          return new Patient(response);
        })
      );
    this.registrationFormConfigs$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey(
        "icare.registration.form"
      );
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

    this.registrationConfigurations$ =
      this.registrationService.getRegistrationMRNSource();
  }
}
