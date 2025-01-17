import { Injectable } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Field } from "../models/field.model";
import { FieldsData } from "../models/fields-data.model";

@Injectable({ providedIn: "root" })
export class FieldControlService {
  constructor() {}

  toFormGroup(fields: Field<string>[], fieldsData?: FieldsData): UntypedFormGroup {
    const group: any = {};
    fields?.forEach((field) => {
      const fieldData =
        fieldsData && fieldsData[field.id]?.latest
          ? fieldsData[field.id]?.latest
          : fieldsData && !fieldsData[field.id]?.latest
          ? fieldsData[field.id]
          : null;
      if (field?.key) {
        group[field.key] = new UntypedFormControl(
          {
            value:
              (!fieldData?.value?.uuid
                ? fieldData?.value
                : fieldData?.value?.uuid) ||
              field.value ||
              "",
            disabled: field?.disabled,
          },
          [
            field?.required ? Validators.required : null,
            field?.controlType === "phoneNumber"
              ? Validators.minLength(10)
              : null,
            field?.controlType === "phoneNumber"
              ? Validators.maxLength(10)
              : null,
            field?.type === "phonenumber"
              ? Validators.pattern(
                  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
                )
              : null,
            field?.type === "number"
              ? Validators.pattern(/[0-9]*\.?[0-9]*/)
              : null,
            field?.type === "email"
              ? Validators.pattern(/(.+)@(.+){2,}\.(.+){2,}/)
              : null,
          ].filter((validator) => validator)
        );
      }
    });

    return new UntypedFormGroup(group);
  }
}
