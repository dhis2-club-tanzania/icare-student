import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CheckBox } from "src/app/shared/modules/form/models/check-box.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-manage-concept-attributes",
  templateUrl: "./manage-concept-attributes.component.html",
  styleUrls: ["./manage-concept-attributes.component.scss"],
})
export class ManageConceptAttributesComponent implements OnInit {
  @Input() conceptsAttributesTypes: any[];
  @Input() concept: any;
  formFields: any[];
  @Output() attributesValues: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.formFields = (
      this.conceptsAttributesTypes?.filter(
        (attributeType) => !attributeType?.retired
      ) || []
    )?.map((attributeType) => {
      return attributeType?.datatypeClassname ==
        "org.openmrs.customdatatype.datatype.BooleanDatatype"
        ? new CheckBox({
            id: attributeType?.uuid,
            key: attributeType?.uuid,
            label: attributeType?.display,
            value: (this.concept?.attributes?.filter(
              (attribute) =>
                attribute?.attributeType?.uuid === attributeType?.uuid
            ) || [])[0]?.value,
            required: true,
          })
        : new Textbox({
            id: attributeType?.uuid,
            key: attributeType?.uuid,
            label: attributeType?.display,
            value: (this.concept?.attributes?.filter(
              (attribute) =>
                attribute?.attributeType?.uuid === attributeType?.uuid
            ) || [])[0]?.value,
            required: true,
          });
    });
  }

  onFormUpdate(formValue: FormValue): void {
    const values = formValue.getValues();
    this.attributesValues.emit(
      Object.keys(values)
        ?.map((key) => {
          return values[key]?.value
            ? {
                value: values[key]?.value,
                attributeType: key,
              }
            : null;
        })
        ?.filter((attributeValue) => attributeValue)
    );
  }
}
