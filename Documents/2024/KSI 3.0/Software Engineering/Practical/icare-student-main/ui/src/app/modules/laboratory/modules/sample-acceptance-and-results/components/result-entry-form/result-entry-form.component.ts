import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ComplexDefaultFileField } from "src/app/shared/modules/form/models/complex-file.model";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

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
  formField: Field<string>;
  @Output() formData: EventEmitter<any> = new EventEmitter<any>();
  fieldsData: any = {};
  label: string;
  options: any[];
  constructor() {}

  ngOnInit(): void {
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
          })
        : this.parameter?.datatype?.display === "Complex"
        ? new ComplexDefaultFileField({
            id: this.parameter?.uuid,
            key: this.parameter?.uuid,
            label: this.label,
            value: this.value,
            disabled: this.disabled,
            required: true,
          })
        : new Textbox({
            id: this.parameter?.uuid,
            key: this.parameter?.uuid,
            label: this.label,
            type: "text",
            value: this.value,
            disabled: this.disabled,
            required: true,
          });
  }

  onFormUpdate(formValue: FormValue): void {
    this.formData.emit(formValue?.getValues()[this.parameter?.uuid]?.value);
  }

  getSelectedItems(value: any): void {
    this.formData.emit(value);
  }
}
