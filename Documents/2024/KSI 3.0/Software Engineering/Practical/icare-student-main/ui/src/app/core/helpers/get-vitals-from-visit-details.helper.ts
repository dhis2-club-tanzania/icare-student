import { flatten, keyBy, groupBy } from "lodash";

export function getVitalsFromVisitDetails(vitalForm, observations) {
  if (!vitalForm) {
    return [];
  }
  const groupedObservations = keyBy(
    observations.map((observation) => {
      return {
        ...observation?.obs,
        conceptUuid: observation?.obs?.concept?.uuid,
      };
    }),
    "conceptUuid"
  );
  const vitalsArray = (vitalForm?.formFields || []).map((formField: any) => {
    const observation = groupedObservations[formField?.concept?.uuid];
    // console.log('formfield', formField);
    return {
      id: formField?.concept?.uuid,
      display: formField?.concept?.display,
      value: observation?.value,
      units: formField?.formField?.units,
      min: formField?.formField?.min,
      max: formField?.formField?.max,
      children: !formField?.formFields
        ? []
        : getSetMembers(formField?.setMembers, groupedObservations),
    };
  });

  //group items
  return {
    noChildren: vitalsArray?.filter(
      (vitailItem) => vitailItem?.children?.length === 0
    ),
    withChildren: vitalsArray?.filter(
      (vitailItem) => vitailItem?.children?.length > 0
    ),
  };
}

function getSetMembers(setMembers, groupedObservations) {
  // console.log('formFields', formFields);
  // console.log('groupedObservations', groupedObservations);
  return setMembers.map((setMember: any) => {
    const observation = groupedObservations[setMember?.concept?.uuid];
    // console.log('formField', setMember);
    return {
      ...setMember,
      display: setMember?.concept?.display,
      value: observation ? observation?.value : null,
      ...setMember?.formField,
      children: setMember?.formFields
        ? getSetMembers(
            getSetMembersFromFormFields(setMember.formFields),
            groupedObservations
          )
        : [],
    };
  });
}

function getSetMembersFromFormFields(formFields) {
  return flatten(
    formFields.map((formField) => {
      return formField?.formFields;
    })
  );
}
