import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { getFormFieldsFromForms } from "src/app/core/helpers/get-form-fields-from-forms.helper";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { uniq } from "lodash";

@Component({
  selector: "app-shared-render-batch-defn-fields",
  templateUrl: "./shared-render-batch-defn-fields.component.html",
  styleUrls: ["./shared-render-batch-defn-fields.component.scss"],
})
export class SharedRenderBatchDefnFieldsComponent implements OnInit {
  @Input() forms: any[];
  @Input() fieldsToFilter1: Field<any>[];
  @Input() fieldsToFilter2: Field<any>[];
  @Input() existingBatchFieldsInformations: any[];
  @Output() fields: EventEmitter<any> = new EventEmitter<any>();
  formFields: any[];
  fieldsSelector: Field<any>;
  @Input() selectedFields: any[];
  fieldsAsOptions: any[] = [];
  @Output() selectedBatchFields: EventEmitter<any> = new EventEmitter<any>();

  // @ViewChild(MultipleResultsEntryComponent)
  // multipleResultsEntryComponent!: MultipleResultsEntryComponent;
  constructor() {}

  ngOnInit(): void {
    this.selectedFields = uniq(
      (
        [...this.selectedFields, ...this.existingBatchFieldsInformations]?.map(
          (formField: any) => {
            return {
              name: formField?.label,
              label: formField?.label,
              value: formField?.id,
              key: formField?.id,
            };
          }
        ) || []
      )?.map((fieldValue: any) => fieldValue?.value) || []
    );

    this.formFields = getFormFieldsFromForms(
      this.forms,
      this.existingBatchFieldsInformations
    );
    this.fields.emit(this.formFields);
    this.createFieldsSelectorField();
    this.fieldsAsOptions = this.formFields?.map((formField: any) => {
      return {
        name: formField?.label,
        label: formField?.label,
        value: formField?.id,
        key: formField?.id,
      };
    });
  }

  setFormFieldsToFilter(fields: any[]): void {
    // this.fieldsToFilter = fields;
    // console.log("IMPORTED FIELDS", fields);
    // this.multipleResultsEntryComponent.setList(
    //   this.fieldsAsOptions?.filter(
    //     (option: any) =>
    //       (
    //         this.fieldsToFilter?.filter(
    //           (field: any) => field?.key === option?.key
    //         ) || []
    //       )?.length === 0
    //   ) || []
    // );
  }

  createFieldsSelectorField(): void {
    this.fieldsSelector = new Dropdown({
      id: "selector",
      key: "selector",
      label: "Fields",
      options: this.formFields?.map((formField: any) => {
        return {
          name: formField?.label,
          label: formField?.label,
          value: formField?.id,
          key: formField?.id,
        };
      }),
    });
  }

  onGetSelectedFields(selectedItems: any[]): void {
    this.selectedFields = (selectedItems || [])?.map(
      (fieldValue: any) => fieldValue?.value
    );
    if (selectedItems?.length > 0) {
      this.selectedBatchFields.emit(
        this.selectedFields?.map((selectedField: any) => {
          return (this.formFields?.filter(
            (formField: any) => formField?.id === selectedField
          ) || [])[0];
        })
      );
    }
  }
}
