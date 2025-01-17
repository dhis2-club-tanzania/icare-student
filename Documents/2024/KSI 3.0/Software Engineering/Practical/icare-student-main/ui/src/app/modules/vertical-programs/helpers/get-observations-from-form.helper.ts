import { keys } from 'lodash';
import { Location } from 'src/app/core/models';
import { ObsCreate } from 'src/app/shared/resources/openmrs';

export function getObservationsFromForm(
  formData: any,
  person?: string,
  location?: string,
  encounter?: string
): ObsCreate[] {
  return (keys(formData) || []).map((key) => {
    const valueObject = formData[key];
    const date = new Date();

    return {
      person,
      obsDatetime: date.toISOString(),
      concept: key,
      location,
      encounter,
      groupMembers: valueObject.memberEntities
        ? getObservationsFromForm(valueObject.memberEntities)
        : undefined,
      voided: false,
      value: valueObject?.value,
      status: 'PRELIMINARY',
    };
  });
}
