import { flatten, keyBy } from "lodash";

export function getFormFieldsFromForms(
  forms: any[],
  existingBatchFieldsInformations?: any
): any[] {
  const keyedExistingValues = keyBy(existingBatchFieldsInformations, "id");
  let fields: any[] = [];
  forms?.forEach((form: any) => {
    fields = [
      ...fields,
      ...flatten(
        form?.formFields?.map((formField: any) => {
          return formField?.formFields ? formField?.formFields : formField;
        })
      ),
    ];
    if (form?.formField) {
      fields = [...fields, form?.formField?.FormFields];
    }
  });
  return fields?.map((field: any) => {
    return {
      ...field,
      value: keyedExistingValues[field?.id]?.value,
    };
  });
}
