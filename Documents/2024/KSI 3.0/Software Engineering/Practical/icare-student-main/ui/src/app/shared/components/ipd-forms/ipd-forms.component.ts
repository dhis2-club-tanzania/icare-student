import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
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
import { OrdersService } from "../../resources/order/services/orders.service";
import { ObservationService } from "../../resources/observation/services";

@Component({
  selector: "app-ipd-forms",
  templateUrl: "./ipd-forms.component.html",
  styleUrls: ["./ipd-forms.component.scss"],
})
export class IpdFormsComponent implements OnInit {
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
  @Input() forms: any[];
  savingObservations$: Observable<boolean>;
  clinicalForms: ICAREForm[];
  currentForm: ICAREForm;
  currentCustomForm: any;
  currentCustomFormName: string;
  formData: any;
  searchingText: string;
  @Output() saveObservations = new EventEmitter();
  @Output() currentSelectedFormForEmitting = new EventEmitter<any>();
  constructor(
    private store: Store<AppState>,
    private ordersService: OrdersService,
    private observationService: ObservationService
  ) {}

  ngOnInit(): void {
    this.formData = {};
    this.currentCustomForm = this.selectedForm
      ? this.selectedForm
      : this.forms[0];
    this.currentSelectedFormForEmitting.emit(this.currentCustomForm);
    this.currentCustomFormName = this.forms[0]?.name;
    this.savingObservations$ = this.store.select(getSavingObservationStatus);
  }

  onSetClinicalForm(e, form) {
    e.stopPropagation();
    this.currentCustomForm = form;
    this.currentCustomFormName = form?.name;
  }

  onFormUpdate(formValue: FormValue | any, isRawValue?: boolean): void {
    // console.log('vvdvd', formValue.getValues());
    this.formData[this.currentCustomForm.id] = {
      ...(this.formData[this.currentCustomForm.id] || {}),
      ...(isRawValue ? formValue : formValue.getValues()),
    };
  }

  onConfirm(e: Event, visit: any): void {
    e.stopPropagation();
    let obs = getObservationsFromForm(
      this.formData[this.currentCustomForm?.id],
      this.patient?.personUuid,
      this.location?.id,
      this.visit?.encounterUuid
        ? this.visit?.encounterUuid
        : JSON.parse(localStorage.getItem("patientConsultation"))[
        "encounterUuid"
        ]
    )
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
        uuid: this.currentCustomForm?.uuid
      }
    };

    this.observationService
      .saveEncounterWithObsDetails(encounterObject)
      .subscribe((res) => {
        if (res) {
          this.saveObservations.emit();
        }
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
}
