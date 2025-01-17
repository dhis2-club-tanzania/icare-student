import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChildren,
} from "@angular/core";
import { select, Store } from "@ngrx/store";
import { find } from "lodash";
import { Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AppState } from "src/app/store/reducers";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import { FormComponent } from "../../modules/form/components/form/form.component";
import { Dropdown } from "../../modules/form/models/dropdown.model";
import { ProviderGet } from "../../resources/openmrs";
import { DrugOrderMetadata } from "../../resources/order/models/drug-order-metadata.model";
import { DrugOrderObject } from "../../resources/order/models/drug-order.model";
import { DrugOrdersService } from "../../resources/order/services";
import { Patient } from "../../resources/patient/models/patient.model";
import { getLocationsByTagName } from "src/app/store/selectors";

@Component({
  selector: "app-drug-order",
  templateUrl: "./drug-order.component.html",
  styleUrls: ["./drug-order.component.scss"],
})
export class DrugOrderComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormComponent) formComponents: FormComponent[];
  @Input() drugOrder: DrugOrderObject;
  @Input() fromDispensing: boolean;
  @Input() showAddButton: boolean;
  @Input() hideActionButtons: boolean;
  @Input() encounterUuid: string;
  @Input() drugInstructions: string;
  @Input() patient: Patient;
  @Input() isFromDoctor: boolean;
  @Input() locations: any[];
  @Input() drugsToBeDispensed: any[];

  @Input() dosingUnitsSettings: string;
  @Input() durationUnitsSettings: string;
  @Input() drugRoutesSettings: string;
  @Input() generalPrescriptionDurationConcept: string;
  @Input() generalPrescriptionDoseConcept: string;
  @Input() generalPrescriptionFrequencyConcept: string;
  @Input() specicDrugConceptUuid: string;

  drugsConceptsField: any;
  @Output() drugOrdered = new EventEmitter<any>();
  @Output() drugQuantity = new EventEmitter<number>();
  @Output() cancelForm = new EventEmitter<any>();
  @Output() formUpdate = new EventEmitter<any>();
  @Output() getDrugsByConceptUuid = new EventEmitter<any>();

  drugOrderDetails: any = {};
  isTheOrderFromDoctor: boolean = false;

  drugOrderMetadata: DrugOrderMetadata;
  drugFormField: Dropdown;
  loadingMetadata: boolean;
  loadingMetadataError: string;
  countOfDispensingFormFieldsWithValues: number = 0;
  keysWithData: string[] = [];
  provider: ProviderGet;
  drugOrderFormsMetadata$: Observable<any>;
  provider$: Observable<ProviderGet>;
  dispensingLocations$: Observable<any>;
  errors: any[] = [];

  @Output() enterKeyPressedFields: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private drugOrderService: DrugOrdersService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.drugOrder = {
      ...this.drugOrder,
      formulatedDescription: (
        Object.keys(this.drugOrder?.obs).map((key) =>
          this.drugOrder?.obs[key]?.value
            ? this.drugOrder?.obs[key]?.value
            : this.drugOrder?.obs[key]?.value?.display
        ) || []
      )?.join("; "),
    };
    this.getDrugsByConceptUuid.emit(this.drugOrder?.concept?.uuid);
    this.isTheOrderFromDoctor =
      this.drugOrder && this.drugOrder.drugUuid ? false : true;

    this.loadingMetadata = true;

    this.drugOrderFormsMetadata$ = this.drugOrderService
      .getDrugOrderMetadata(
        this.drugOrder,
        this.locations,
        this.fromDispensing,
        this.drugOrder,
        {
          dosingUnitsSettings: this.dosingUnitsSettings,
          durationUnitsSettings: this.durationUnitsSettings,
          drugRoutesSettings: this.drugRoutesSettings,
          generalPrescriptionDurationConcept:
            this.generalPrescriptionDurationConcept,
          generalPrescriptionDoseConcept: this.generalPrescriptionDoseConcept,
          generalPrescriptionFrequencyConcept:
            this.generalPrescriptionFrequencyConcept,
          specificDrugConceptUuid: this.specicDrugConceptUuid,
          fromDispensing: this.fromDispensing,
          drugInstructions: this.drugInstructions || "",
        }
      )
      .pipe(
        map((response) => {
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
          if (response === "null" || !response) {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Missing drug order forms metadata! Please contact IT",
                },
              },
            ];
          }

          return response;
        })
      );

    this.provider$ = this.store.pipe(select(getProviderDetails));
    this.dispensingLocations$ = this.store.select(getLocationsByTagName, {
      tagName: "Dispensing Unit",
    });
  }

  ngAfterViewInit(): void {}

  onOrderingDrug(data): void {
    this.drugOrdered.emit(data);
  }

  onFormUpdate(data): void {
    this.formUpdate.emit(data);
  }

  onChangeDrugQuantity(data): void {
    this.drugQuantity.emit(data);
  }

  addDrugOrderToTheList(drugOrder): void {
    Object.keys(drugOrder).length > 0
      ? this.drugOrdered.emit({
          ...drugOrder,
          providerUuid: this.provider?.uuid,
          patientUuid: this.patient?.id,
          encounterUuid: this.encounterUuid,
          orderType: this.drugOrderMetadata.orderType,
          careSetting: "OUTPATIENT",
          numRefills: 1,
        })
      : "";

    this.formComponents.forEach((form) => {
      form.onClear();
    });

    this.drugOrderDetails = {};
  }

  updateDrugOrder(drugOrder, drugOrderDetails) {
    const newDrugOrder = { ...drugOrder, ...drugOrderDetails };
    const data = {
      order: newDrugOrder,
      isTheOrderFromDoctor: this.isFromDoctor,
      patient: this.patient,
      provider: this.provider,
      orderType: this.drugOrderMetadata?.orderType,
    };
    this.drugOrdered.emit(data);
  }

  onCancel(e) {
    e.stopPropagation();
    this.cancelForm.emit();
  }

  onGetEnterKeyResponsedFields(keys: Event): void {
    this.enterKeyPressedFields.emit(keys);
  }
}
