import * as _ from 'lodash';

export function getEncountersByEncounterType(visitDetails, encounterType) {
  let encounters = [];
  _.map(visitDetails, (detail) => {
    _.map(detail.encounters, (encounter) => {
      if (encounter.display && encounter.display.indexOf(encounterType) > -1) {
        encounters = [
          ...encounters,
          { patient: detail.patient, ...encounter, visitUuid: detail.uuid },
        ];
      }
    });
  });
  return encounters;
}
