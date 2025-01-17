import { DropdownOption } from "../models/dropdown-option.model";
import * as _ from "lodash";

export function getFormFieldOptions(conceptAnswers: any[]): DropdownOption[] {
  return (conceptAnswers || [])
    .map((answer: any) => {
      if (!answer) {
        return null;
      }

      const { uuid, display } = answer;
      // console.log('sashdasas', answer);
      // const shortName = answer?.names
      //   ? (answer?.names.filter((name) => name?.conceptNameType === 'SHORT') ||
      //       [])[0]
      //   : null;
      // if (shortName && shortName.toLowerCase().indexOf('prov') > -1) {
      //   console.log('uiewrywe');
      // }
      return {
        key: uuid,
        value: uuid,
        label: display?.indexOf(":") > -1 ? display?.split(":")[1] : display,
        name: display?.indexOf(":") > -1 ? display?.split(":")[1] : display,
      };
    })
    .filter((option) => option);
}

export function createFormFieldsForOpenMRSForm(openMRSForm) {
  return _.map(openMRSForm?.formFields, (formField) => {
    return {
      id: formField?.uuid,
      name: formField?.display,
      label: formField?.display,
      key: formField?.uuid,
      dataType: null,
      formClass: null,
      options: [],
    };
  });
}
