import { FormGroup } from "@angular/forms";
import { find } from "lodash";
import { Field } from "./field.model";
export class FormValue {
  form: FormGroup;
  fields: Field<string>[];
  fileValues: any;
  constructor(form: FormGroup, fields: Field<string>[], fileValues?: any) {
    this.form = form;
    this.fields = fields;
    this.fileValues = fileValues;
  }

  get isValid(): boolean {
    return this.form.valid;
  }

  clear(): void {
    this.form.reset();
  }

  getValues(): { [id: string]: { id: string; value: string; options: any[] } } {
    const newValues = {};
    const formValues = !this.fileValues
      ? this.form?.getRawValue()
      : this.fileValues;

    Object.keys(formValues).forEach((key) => {
      const field = find(this.fields, ["key", key]);
      if (field) {
        newValues[key] = {
          id: field.id,
          value:
            formValues[key]
              ? formValues[key]
              : field?.value
              ? field?.value
              : "",
          options: field.options,
          isFile: this.fileValues ? true : false,
          label: field?.label,
          name: field?.name,
        };
      }
    });

    return newValues;
  }

  getFields(){
    return this.fields;
  }
  setValue(key, value){
    this.fields.filter((field) => field.key === key)[0].value = value;
  }
}
