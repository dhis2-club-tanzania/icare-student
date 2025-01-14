import { flatten } from "lodash";

export function identifyConceptsFromFormattedForm(form: any): any[] {
  let concepts = [];
  if (form?.formFields?.length > 0) {
    return flatten(getConcepts(form?.formFields));
  }
  return concepts;
}

function getConcepts(formFields: any[]): any[] {
  let concepts = [];
  formFields?.forEach((formField) => {
    if (formField?.concept?.dataType?.display === "N/A") {
      getConcepts(formField?.formFields);
    } else {
      concepts = [
        ...concepts,
        formField?.concept,
        ...formField?.concept?.setMembers,
      ];
    }
  });
  return concepts;
}
