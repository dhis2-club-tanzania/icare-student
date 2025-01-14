import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ComplexDefaultFileField } from "src/app/shared/modules/form/models/complex-file.model";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { SampleAllocationObject } from "src/app/shared/resources/sample-allocations/models/allocation.model";
import { omit } from "lodash";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getDataValuesEntities } from "src/app/store/selectors";
import { identifyFieldIdsFromExpressions } from "src/app/core/helpers/autocalculation.helper";

@Component({
  selector: "app-result-entry-form",
  templateUrl: "./result-entry-form.component.html",
  styleUrls: ["./result-entry-form.component.scss"],
})
export class ResultEntryFormComponent implements OnInit {
  @Input() parameter: any;
  @Input() hasMultipleAnswers: boolean;
  value: any;
  @Input() disabled: boolean;
  @Input() multipleResultsAttributeType: string;
  @Input() conceptNameType: string;
  @Input() isLIS: boolean;
  @Input() latestResult: any;
  @Input() allocation: SampleAllocationObject;
  @Input() calculatedValueExpressionAttributeType: any;
  formField: Field<string>;
  @Output() formData: EventEmitter<any> = new EventEmitter<any>();
  @Output() attributes: EventEmitter<any> = new EventEmitter<any>();
  @Output() formDataProperties: EventEmitter<any> = new EventEmitter<any>();
  fieldsData: any = {};
  label: string;
  options: any[];
  dataValuesEntities$: Observable<any>;
  autoCalculationAttributes: any[];
  isAutoCalculated: boolean = false;
  dependedFields: any = {};
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.dataValuesEntities$ = this.store.select(getDataValuesEntities);
    this.autoCalculationAttributes =
      this.parameter?.attributes?.filter(
        (attribute: any) =>
          attribute?.attributeType?.uuid ===
            this.calculatedValueExpressionAttributeType && !attribute?.voided
      ) || [];
    if (this.autoCalculationAttributes?.length > 0)
      this.dependedFields[this.parameter?.uuid] =
        identifyFieldIdsFromExpressions(
          this.autoCalculationAttributes[0]?.value
        );

    this.isAutoCalculated = this.autoCalculationAttributes?.length > 0;
    this.conceptNameType =
      !this.conceptNameType && this.isLIS ? "SHORT" : this.conceptNameType;
    this.hasMultipleAnswers =
      (
        this.parameter?.attributes?.filter(
          (attribute) =>
            attribute?.attributeType?.uuid == this.multipleResultsAttributeType
        ) || []
      )?.length > 0;
    this.value =
      !this.hasMultipleAnswers && !this.latestResult?.isArray
        ? this.latestResult?.value
          ? this.latestResult?.value
          : this.latestResult?.valueNumeric
          ? this.latestResult?.valueNumeric
          : this.latestResult?.valueBoolean
          ? this.latestResult?.valueBoolean
          : this.latestResult?.valueComplex
          ? this.latestResult?.valueComplex
          : this.latestResult?.valueCoded
          ? this.latestResult?.valueCoded
          : this.latestResult?.valueText
          ? this.latestResult?.valueText
          : this.latestResult?.valueModifier
          ? this.latestResult?.valueModifier
          : null
        : !this.hasMultipleAnswers &&
          this.latestResult?.isArray &&
          this.latestResult?.value
        ? this.latestResult?.value[0]
        : this.latestResult?.value;
    this.label = !this.conceptNameType
      ? this.parameter?.display
      : (this.parameter?.names?.filter(
          (name) => name?.conceptNameType === this.conceptNameType
        ) || [])[0]?.display;
    this.options =
      this.parameter?.answers?.map((answer) => {
        const answerLabel = !this.conceptNameType
          ? answer?.display
          : (answer?.names?.filter(
              (name) => name?.conceptNameType === this.conceptNameType
            ) || [])[0]?.display;
        return {
          value: answer?.uuid,
          key: answer?.uuid,
          name: answerLabel,
          label: answerLabel,
        };
      }) || [];
    this.formField =
      this.parameter?.datatype?.display === "Numeric"
        ? new Textbox({
            id: this.parameter?.uuid,
            key: this.parameter?.uuid,
            label: this.label,
            type: "number",
            value: this.value,
            disabled: this.disabled,
            min: this.parameter?.min,
            max: this.parameter?.max,
            required: true,
            isAutoCalculated: this.isAutoCalculated,
            autoCalculationAttribute: this.autoCalculationAttributes[0],
          })
        : this.parameter?.datatype?.display === "Coded"
        ? new Dropdown({
            id: this.parameter?.uuid,
            key: this.parameter?.uuid,
            label: this.label,
            value: this.value,
            disabled: this.disabled,
            multiple: this.hasMultipleAnswers,
            options: this.options,
            min: this.parameter?.min,
            max: this.parameter?.max,
            required: true,
            isAutoCalculated: this.isAutoCalculated,
            autoCalculationAttribute: this.autoCalculationAttributes[0],
          })
        : this.parameter?.datatype?.display === "Complex"
        ? new ComplexDefaultFileField({
            id: this.parameter?.uuid,
            key: this.parameter?.uuid,
            label: this.label,
            value: this.value,
            disabled: this.disabled,
            required: true,
            isAutoCalculated: this.isAutoCalculated,
            autoCalculationAttribute: this.autoCalculationAttributes[0],
          })
        : new Textbox({
            id: this.parameter?.uuid,
            key: this.parameter?.uuid,
            label: this.label,
            type: "text",
            value: this.value,
            disabled: this.disabled,
            required: true,
            isAutoCalculated: this.isAutoCalculated,
            autoCalculationAttribute: this.autoCalculationAttributes[0],
          });

    //if(this.allocation?.parameter?.attributes.length > 0){

    if (
      (
        this.allocation?.parameter?.attributes?.filter(
          (attribute) =>
            attribute?.attributeTypeUuid ===
            this.calculatedValueExpressionAttributeType
        ) || []
      )?.length > 0
    ) {
      this.attributes.emit(
        this.allocation?.parameter?.attributes?.map((attribute: any) => {
          return {
            ...attribute,
            parameter: omit(this.allocation?.parameter, ["attributes"]),
          };
        })
      );
    }
  }

  //}

  onFormUpdate(formValue: FormValue, fieldsData: any): void {
    this.formData.emit(formValue?.getValues()[this.parameter?.uuid]?.value);
  }

  getSelectedItems(value: any): void {
    this.formData.emit(value);
  }

  createFormFields(parameterValue): void {
    // console.log(parameterValue);
  }
}
