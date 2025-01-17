import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChildren,
} from "@angular/core";
import { Dropdown } from "../../modules/form/models/dropdown.model";
import { FormValue } from "../../modules/form/models/form-value.model";
import { ProviderGet } from "../../resources/openmrs";

import { find, uniq } from "lodash";
import { Patient } from "src/app/modules/registration/components/registration-search/registration-search.component";
import { DrugOrderObject } from "../../resources/order/models";
import { FormComponent } from "../../modules/form/components/form/form.component";

@Component({
  selector: "app-drug-order-form",
  templateUrl: "./drug-order-form.component.html",
  styleUrls: ["./drug-order-form.component.scss"],
})
export class DrugOrderFormComponent implements OnInit {
  @ViewChildren(FormComponent) formComponents: FormComponent[];
  @Input() doctorPrescriptionDetails: any;
  @Input() fromDispensing: boolean;
  @Input() showAddButton: boolean;
  @Input() hideActionButtons: boolean;
  @Input() encounterUuid: string;
  @Input() provider: ProviderGet;
  @Input() drugOrderFormsMetadata: any;
  @Input() drugs: any;
  drugFormField: Dropdown;
  @Input() patient: Patient;
  @Input() isFromDoctor: boolean;
  @Input() dispensingLocations: any;
  loadingMetadata: boolean;
  loadingMetadataError: string;
  countOfDispensingFormFieldsWithValues: number = 0;
  keysWithData: string[] = [];
  @Output() drugQuantity = new EventEmitter<number>();
  @Output() drugOrdered = new EventEmitter<any>();
  @Output() cancelForm = new EventEmitter<any>();
  @Output() formUpdate = new EventEmitter<any>();
  drugOrderDetails: any = {};
  isTheOrderFromDoctor: boolean = false;
  quantityField: any;
  shouldFeedQuantity: boolean = false;
  isDrugSet: boolean = false;
  showOtherDetails: boolean = false;
  @Output() enterKeyPressedFields: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    if (this.drugs?.results?.length > 0) {
      this.drugFormField = new Dropdown({
        id: "drug",
        key: "drug",
        label: `Select Drug`,
        conceptClass: "Drug",
        value: null,
        options: this.drugs?.results?.map((drug) => {
          return {
            key: drug?.uuid,
            value: drug?.uuid,
            label: drug?.display,
          };
        }),
      });
    } else {
      this.drugFormField = {
        ...this.drugOrderFormsMetadata?.drugFormField,
        conceptClass: "Drug",
        shouldHaveLiveSearchForDropDownFields: true,
        searchControlType: "Drug",
        filteringItems: {
          items: this.drugOrderFormsMetadata?.stockedDrugs,
          applicable: this.dispensingLocations,
        },
      };
    }
    this.quantityField = this.drugOrderFormsMetadata?.quantityField;
  }

  onFormUpdate(formName: string, formValue: FormValue): void {
    let data = formValue.getValues();
    this.isDrugSet = data["drug"] ? true : this.isDrugSet;
    if (this.isDrugSet && data["drug"]) {
    }
    this.shouldFeedQuantity = true;
    if (!this.shouldFeedQuantity) {
      this.quantityField = null;
      setTimeout(() => {
        this.quantityField = {
          ...this.drugOrderFormsMetadata?.quantityField,
          // disabled: true,
          // value: '0',
        };
      }, 100);
      this.drugQuantity.emit(0);
      data["quantity"] = {
        id: "quantity",
        options: [],
        value: "0",
      };
      this.keysWithData = [...this.keysWithData, "quantity"];
    } else {
      this.keysWithData =
        this.keysWithData.filter((key) => key !== "quantity") || [];
      if (data?.quantity?.value != "" && Number(data?.quantity?.value) === 0) {
        this.drugQuantity.emit();
        this.quantityField = null;
        setTimeout(() => {
          this.quantityField = {
            ...this.drugOrderFormsMetadata?.quantityField,
          };
        }, 100);
      }
    }
    this.keysWithData = uniq(
      [
        ...this.keysWithData,
        ...(Object.keys(data).filter((key) => data[key]?.value) || []),
      ].filter((key) => key)
    );
    this.countOfDispensingFormFieldsWithValues = this.keysWithData.length;
    if (data.quantity && data.quantity.value) {
      this.drugQuantity.emit(Number(data.quantity.value));
    }
    Object.keys(data).forEach((key: string) => {
      if (data[key].value !== "") {
        if (key === "drug") {
          const stockedDrug = find(this.drugOrderFormsMetadata.stockedDrugs, [
            "drugUuid",
            data[key].value,
          ]);

          this.drugOrderDetails["location"] = stockedDrug?.location;
        }

        this.drugOrderDetails[key] =
          data[key].options && data[key].options.length > 0
            ? {
                uuid: data[key].value,
              }
            : data[key].value;
      }
    });

    this.formUpdate.emit({
      formName,
      formValue,
      drugOrder: {
        ...this.doctorPrescriptionDetails,
        ...this.drugOrderDetails,
      },
      isTheOrderFromDoctor: this.isFromDoctor,
      patient: this.patient,
      provider: this.provider,
      orderType: this.drugOrderFormsMetadata?.orderType,
      countOfDispensingFormFieldsWithValues:
        this.countOfDispensingFormFieldsWithValues,
    });
  }

  onGetEnterKeyResponsedFields(keys: Event): void {
    this.enterKeyPressedFields.emit(keys);
  }

  toggleOtherDetails(event: Event): void {
    event.stopPropagation();
    this.showOtherDetails = !this.showOtherDetails;
  }
}
