import { ConceptGet } from "src/app/shared/resources/openmrs";
import { FormFieldType } from "../constants/form-field-type.constant";
import { Boolean } from "../models/boolean.model";
import { CheckBox } from "../models/check-box.model";
import { ComplexDefaultFileField } from "../models/complex-file.model";
import { Dropdown } from "../models/dropdown.model";
import { Field } from "../models/field.model";
import { ICAREForm } from "../models/form.model";
import { TextArea } from "../models/text-area.model";
import { Textbox } from "../models/text-box.model";
import { getFormFieldOptions } from "./get-form-field-options.helper";

export function getSanitizedFormObject(
  concept: ConceptGet,
  fieldsInfo?,
  conceptsForDiagnosis?: string[]
): ICAREForm {
  if (!concept) {
    return null;
  }
  let isDiagnosis;
  if (conceptsForDiagnosis && conceptsForDiagnosis?.length > 0) {
    isDiagnosis =
      (
        conceptsForDiagnosis?.filter(
          (conceptForDiagnosis) => conceptForDiagnosis === concept?.uuid
        ) || []
      )?.length > 0;
  }

  const {
    name,
    display,
    uuid,
    setMembers,
    datatype,
    conceptClass,
    answers,
    mappings,
    units,
  } = concept;
  const formObject = {
    id: uuid,
    uuid,
    name: name?.name ? name?.name : display,
    dataType: answers?.length > 0 || isDiagnosis ? "Coded" : datatype?.display,
    formClass: conceptClass?.display,
    concept: concept,
    fieldNumber: fieldsInfo?.fieldNumber,
    fieldPart: fieldsInfo?.fieldPart,
    minOccurs: fieldsInfo?.minOccurs,
    maxOccurs: fieldsInfo?.fieldPart,
    required: fieldsInfo?.required,
    searchControlType: "concept",
    shouldHaveLiveSearchForDropDownFields: isDiagnosis ? true : false,
    conceptClass: conceptClass?.display,
    captureData: setMembers?.length == 0 ? true : false,
    options: getFormFieldOptions(answers),
    setMembers: (setMembers || []).map((setMember) =>
      getSanitizedFormObject(setMember, fieldsInfo, conceptsForDiagnosis)
    ),
    mappings: mappings,
    units: units,
  };

  return {
    ...formObject,
    formField: getFormField(formObject, isDiagnosis),
    formFields: getFormFields(formObject, isDiagnosis),
  };
}

function getFormFields(formObject: ICAREForm, isDiagnosis): Field<string>[] {
  if (!formObject) {
    return undefined;
  }

  const hasLowestMembers = formObject.setMembers.some(
    (member) => !member.setMembers || member.setMembers.length === 0
  );

  return hasLowestMembers
    ? formObject.setMembers
        .map((member) => getFormField(member, isDiagnosis))
        .filter((formField) => formField)
    : undefined;
}

function getFormField(
  formObject: ICAREForm,
  isDiagnosis: boolean
): Field<string> {
  switch (formObject.dataType) {
    case FormFieldType.NUMERIC:
      return new Textbox({
        key: formObject.uuid,
        label: formObject.name,
        type: "number",
        id: formObject.id,
        conceptClass: formObject?.concept?.conceptClass,
        min: formObject?.concept?.lowCritical
          ? formObject?.concept?.lowCritical
          : formObject?.concept?.lowAbsolute
          ? formObject?.concept?.lowAbsolute
          : formObject?.concept?.lowNormal
          ? formObject?.concept?.lowNormal
          : null,

        max: formObject?.concept?.hiCritical
          ? formObject?.concept?.hiCritical
          : formObject?.concept?.hiAbsolute
          ? formObject?.concept?.hiAbsolute
          : formObject?.concept?.hiNormal
          ? formObject?.concept?.hiNormal
          : null,
        searchControlType: "concept",
        units: formObject?.concept?.units,
      });
    case FormFieldType.CODED: {
      return new Dropdown({
        key: formObject.uuid,
        label: formObject.name,
        searchControlType: "concept",
        conceptClass: formObject?.concept?.conceptClass?.display,
        id: formObject.id,
        shouldHaveLiveSearchForDropDownFields: isDiagnosis ? true : false,
        isDiagnosis,
        options: formObject.options,
      });
    }
    case FormFieldType.TEXT: {
      return new TextArea({
        key: formObject.uuid,
        label: formObject.name,
        conceptClass: formObject?.concept?.conceptClass?.display,
        id: formObject.id,
        options: formObject.options,
      });
    }

    case FormFieldType.COMPLEX: {
      return new ComplexDefaultFileField({
        key: formObject.uuid,
        label: formObject.name,
        conceptClass: formObject?.concept?.conceptClass?.display,
        id: formObject.id,
        options: formObject.options,
      });
    }

    case FormFieldType.BOOLEAN: {
      return new Boolean({
        key: formObject.uuid,
        label: formObject.name,
        conceptClass: formObject?.concept?.conceptClass?.display,
        id: formObject.id,
        options: formObject.options,
      });
    }
    default:
      return null;
  }
}
