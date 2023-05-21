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
      const fieldData = fieldsData ? fieldsData[field.id]?.latest : null;
      if (field?.key) {
        group[field.key] = field.required
          ? new UntypedFormControl(
              {
                value: fieldData?.value || field.value || "",
                disabled: field?.disabled,
              },
              [
                Validators.required,
                field?.controlType === "phoneNumber"
                  ? Validators.minLength(10)
                  : null,
                field?.controlType === "phoneNumber"
                  ? Validators.maxLength(10)
                  : null,
              ].filter((validator) => validator)
            )
          : new UntypedFormControl(
              {
                value: fieldData?.value || field.value || "",
                disabled: field?.disabled,
              },

              [
                field?.controlType === "phoneNumber"
                  ? Validators.minLength(10)
                  : null,
                field?.controlType === "phoneNumber"
                  ? Validators.maxLength(10)
                  : null,
              ].filter((validator) => validator)
            );
      }
    });

    return new UntypedFormGroup(group);
  }
}
