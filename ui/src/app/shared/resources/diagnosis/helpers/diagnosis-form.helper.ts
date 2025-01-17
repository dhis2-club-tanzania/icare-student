import * as _ from "lodash";
import { DiagnosisObject } from "../models/diagnosis-object.model";

export function formatDiagnosisFormObject(formObject, data?: DiagnosisObject) {
  if (!formObject) {
    return null;
  }
  const referenceMapping = {
    "1284AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA": "diagnosis",
    "161602AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA": "diagnosis-non-coded",
    "159946AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA": "rank",
    "159394AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA": "certainty",
    "162820AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA": "condition",
  };
  return {
    id: formObject?.uuid,
    uuid: formObject?.uuid,
    name: formObject?.name,
    dataType: formObject?.dataType,
    formClass: formObject?.formClass,
    setMembers: formObject?.setMembers,
    searchControlType: "concept",
    shouldHaveLiveSearchForOptions: true,
    formFields: formatFormFields(
      _.filter(formObject?.formFields, (formField) => {
        if (formField) {
          return formField;
        }
      }),
      referenceMapping,
      data,
      formObject?.setMembers
    ),
  };
}

function formatFormFields(fields, referenceMapping, data, setMembers) {
  return _.map(fields, (field) => {
    return {
      ...field,
      shouldHaveLiveSearchForDropDownFields:
        referenceMapping[field?.key] === "diagnosis" ? true : false,
      conceptClass:
        referenceMapping[field?.key] === "diagnosis" ? "Diagnosis" : "",
      key: referenceMapping[field.key]
        ? referenceMapping[field.key]
        : field.key,
      required: false,
      id: data ? data.uuid : field?.id,
      value: data
        ? getValueAsPerField(
            referenceMapping[field.key],
            field.key,
            data,
            setMembers
          )
        : null,
    };
  });
}

function getValueAsPerField(fieldKey, key, data, setMembers) {
  if (fieldKey == "diagnosis") {
    return data?.diagnosis?.uuid;
  } else if (fieldKey == "rank") {
    const orderValue = data.rank == 0 ? "Primary" : "Secondary";
    let options = [];
    _.map(setMembers, (setMember) => {
      if (setMember?.id === key) {
        options = setMember?.options;
      }
    });
    const matchedRank = (_.filter(options, { value: orderValue }) || [])[0];
    return matchedRank ? matchedRank["key"] : null;
  } else if (fieldKey == "certainty") {
    let options = [];
    _.map(setMembers, (setMember) => {
      if (setMember?.id === key) {
        options = setMember?.options;
      }
    });
    const matchedCertainty = (options.filter(
      (option) =>
        option?.value?.toLowerCase()?.indexOf(data?.certainty?.toLowerCase()) >
        -1
    ) || [])[0];

    return matchedCertainty ? matchedCertainty["key"] : null;
  }
  return null;
}
