import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Location } from "src/app/core/models";
import { getObservationsFromForm } from "src/app/modules/clinic/helpers/get-observations-from-form.helper";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { ICAREForm } from "src/app/shared/modules/form/models/form.model";
import { ObservationObject } from "src/app/shared/resources/observation/models/obsevation-object.model";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { VisitObject } from "src/app/shared/resources/visits/models/visit-object.model";
import { AppState } from "src/app/store/reducers";
import { getSavingObservationStatus } from "src/app/store/selectors/observation.selectors";
import { ICARE_CONFIG } from "../../resources/config";
import { ObservationService } from "../../resources/observation/services";
import { identifyConceptsFromFormattedForm } from "../../helpers/identify-concepts-from-formatted-form.helper";
import { indexOf, keyBy, orderBy } from "lodash";

import * as moment from "moment";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";

@Component({
  selector: "app-clinical-notes",
  templateUrl: "./clinical-notes.component.html",
  styleUrls: ["./clinical-notes.component.scss"],
})
export class ClinicalNotesComponent implements OnInit {
  @Input() clinicalForm: ICAREForm;
  @Input() clinicalObservations: ObservationObject;
  @Input() patient: Patient;
  @Input() location: Location;
  @Input() visit: VisitObject;
  @Input() encounterUuid: string;
  @Input() savingObservations: boolean;
  @Input() selectedForm: any;
  @Input() shouldUseOwnFormSelection: boolean;
  @Input() provider: any;
  @Input() clinicConfigurations: any;
  @Input() forms: any[];
  savingObservations$: Observable<boolean>;
  ordersUpdates$: Observable<any>;

  clinicalForms: ICAREForm[];
  currentForm: ICAREForm;
  currentCustomForm: any;
  currentCustomFormName: string;
  formData: any;
  searchingText: string;
  atLeastOneFieldHasData: boolean = false;
  currentFormHasRequiredData: boolean = false;
  dependedFormHasData: boolean = false;
  @Output() saveObservations = new EventEmitter();
  @Output() currentSelectedFormForEmitting = new EventEmitter<any>();
  @Output() updateConsultationOrder = new EventEmitter<any>();
  showMessage: boolean = false;
  @Output() currentFormDetails: EventEmitter<any> = new EventEmitter<any>();
  useFilledObsData: boolean = true;
  constructor(
    private store: Store<AppState>,
    private observationService: ObservationService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    // console.log(this.clinicConfigurations);
    this.clinicConfigurations = {
      ...this.clinicConfigurations,
      forms: keyBy(
        Object.keys(this.clinicConfigurations?.forms)
          .filter(
            (key) =>
              (this.forms?.filter((form) => form?.uuid == key) || [])?.length >
              0
          )
          .map((key) => this.clinicConfigurations?.forms[key]),
        "uuid"
      ),
    };
    this.selectedForm = !this.selectedForm
      ? this.clinicalForm
      : this.selectedForm;
    this.formData = {};
    this.currentCustomForm = this.selectedForm;
    this.currentSelectedFormForEmitting.emit(this.currentCustomForm);
    this.currentCustomFormName = this.forms[0]?.name;
    this.savingObservations$ = this.store.select(getSavingObservationStatus);
    const latestObservations = Object.keys(this.clinicalObservations).map(
      (key) => this.clinicalObservations[key]?.latest
    );
    const concepts = identifyConceptsFromFormattedForm(this.currentCustomForm);
    // this.currentFormHasRequiredData =
    //   (
    //     Object.keys(this.clinicalObservations).filter(
    //       (key) =>
    //         indexOf(
    //           concepts?.map((concept) => concept?.uuid),
    //           key,
    //           0
    //         ) > -1
    //     ) || []
    //   ).length > 0;
    const latestObsForCurrentForm =
      latestObservations?.filter(
        (obs) => keyBy(concepts, "uuid")[obs?.conceptUuid]
      ) || [];
    if (latestObsForCurrentForm?.length > 0) {
      const latestObsTime = (orderBy(
        latestObsForCurrentForm?.map((obs) => {
          return {
            ...obs,
            observationDatetime: new Date(obs?.observationDatetime),
          };
        }),
        ["observationDatetime"]["desc"]
      ) || [])[0]?.observationDatetime;

      var duration = moment.duration(
        moment(new Date()).diff(moment(latestObsTime))
      );
      // TODO: Add support to use configured time for the 2 hrs constant
      this.useFilledObsData = duration.asHours() > 2 ? false : true;
    }

    this.dependedFormHasData = this.evaluateFormDependency(
      this.clinicConfigurations,
      this.currentCustomForm
    );

    // Identify form with dependants
    if (Object.keys(this.clinicConfigurations?.forms)?.length > 0) {
      const formsWithDependants = (
        Object.keys(this.clinicConfigurations?.forms)?.filter(
          (key) => this.clinicConfigurations?.forms[key]?.dependants?.length > 0
        ) || []
      )?.map((formUuid) => {
        return {
          ...(this.forms?.filter((form) => form?.uuid === formUuid) || [])[0],
          ...this.clinicConfigurations?.forms[formUuid],
        };
      });
      formsWithDependants
        ?.filter(
          (form) =>
            (
              form?.dependants?.filter(
                (dependant) => dependant?.type === "section"
              ) || []
            )?.length > 0
        )
        ?.forEach((form) => {
          const concepts = identifyConceptsFromFormattedForm(form);
          const currentFormHasRequiredData =
            (
              Object.keys(this.clinicalObservations).filter(
                (key) =>
                  indexOf(
                    concepts?.map((concept) => concept?.uuid),
                    key,
                    0
                  ) > -1
              ) || []
            ).length > 0;
          this.currentFormDetails.emit({
            requiredFormsHasData: currentFormHasRequiredData,
            configs: form,
          });
        });
      // console.log("formsWithDependants", formsWithDependants);
    }

    if (
      this.clinicConfigurations?.forms &&
      this.clinicConfigurations?.forms[this.currentCustomForm?.uuid] &&
      this.clinicConfigurations?.forms[this.currentCustomForm?.uuid]?.dependsOn
        ?.length > 0 &&
      this.clinicConfigurations?.forms[
        this.currentCustomForm?.uuid
      ]?.dependsOn?.filter((depended) => depended?.type === "form")
    ) {
      this.showMessage = true;
    }
  }

  onCloseMessage(event: Event): void {
    event.stopPropagation();
    this.showMessage = false;
  }

  evaluateFormDependency(configs: any, form: any): boolean {
    let dependedFormHasData = false;
    const formConfigs = configs?.forms[form?.uuid];
    const dependedForms = formConfigs
      ? configs?.forms[form?.uuid]?.dependsOn?.filter(
          (depended) => depended?.type === "form"
        )
      : null;
    if (dependedForms?.length > 0) {
      const dependedForm = (this.forms?.filter(
        (form) => form?.uuid === dependedForms[0]?.uuid
      ) || [])[0];

      const concepts = identifyConceptsFromFormattedForm(dependedForm);

      dependedFormHasData =
        (
          Object.keys(this.clinicalObservations).filter(
            (key) =>
              indexOf(
                concepts?.map((concept) => concept?.uuid),
                key,
                0
              ) > -1
          ) || []
        ).length > 0;
    }
    return dependedFormHasData;
  }

  onSetClinicalForm(e: Event, form: any): void {
    e.stopPropagation();
    this.currentCustomForm = form;
    this.currentCustomFormName = form?.name;
  }

  onSetForm(e, form: ICAREForm): void {
    e.stopPropagation();
    this.currentForm = form;
  }

  onFormUpdate(formValue: FormValue | any, isRawValue?: boolean): void {
    // console.log('vvdvd', formValue.getValues());
    this.formData[this.currentCustomForm.id] = {
      ...(this.formData[this.currentCustomForm.id] || {}),
      ...(isRawValue ? formValue : formValue.getValues()),
    };
    this.atLeastOneFieldHasData =
      (
        Object.keys(this.formData[this.currentCustomForm.id])
          ?.map((key) => this.formData[this.currentCustomForm.id][key]?.value)
          ?.filter((value) => value) || []
      )?.length > 0;
  }

  onConfirm(e: Event, visit: any,form:any): void {
    e.stopPropagation();
    this.updateConsultationOrder.emit();
    let obs = getObservationsFromForm(
      this.formData[this.currentCustomForm?.id],

      this.patient?.personUuid,
      this.location?.id,
      this.visit?.encounterUuid
        ? this.visit?.encounterUuid
        : JSON.parse(localStorage.getItem("patientConsultation"))[
            "encounterUuid"
          ]
    );
    let encounterObject = {
      patient: this.patient?.id,
      encounterType: this.currentCustomForm?.encounterType?.uuid,
      location: this.location?.uuid,
      encounterProviders: [
        {
          provider: this.provider?.uuid,
          encounterRole: ICARE_CONFIG?.encounterRole?.uuid,
        },
      ],
      visit: this.visit?.uuid,
      obs: obs,
      form: {
        uuid: this.currentCustomForm?.uuid,
      },
    };

    this.observationService
      .saveEncounterWithObsDetails(encounterObject)
      .subscribe((res) => {
        if (res) {
          this.saveObservations.emit();
        }

  this.trackActionForAnalytics(`${this.currentCustomForm?.name}: Save`);
        
      });
    // this.saveObservations.emit(
    //   getObservationsFromForm(
    //     this.formData[this.currentCustomForm?.id],
    //     this.patient?.personUuid,
    //     this.location?.id,
    //     this.visit?.encounterUuid
    //       ? this.visit?.encounterUuid
    //       : JSON.parse(localStorage.getItem("patientConsultation"))[
    //           "encounterUuid"
    //         ]
    //   )
    // );
  }

  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
    this.googleAnalyticsService.sendAnalytics(
      "Clinic",
      eventname,
      "Clinic"
    );
  }
  

  onClear(event: Event, form: any): void {
    event.stopPropagation();
    this.currentCustomForm = null;
    setTimeout(() => {
      this.currentCustomForm = form;
    }, 20);
  }
}
