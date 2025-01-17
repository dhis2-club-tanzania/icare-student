import * as _ from 'lodash';
import { ConceptGet } from '../../openmrs';

export function formatConceptAnswersAsOptions(concept: ConceptGet) {
  if (!concept) {
    return null;
  }

  return _.filter(
    _.map(concept.answers, (option: ConceptGet) => {
      return {
        uuid: option.uuid,
        display: option.display,
        name: option.name.display,
        names: option.names,
        dataType: option.datatype,
        conceptClass: option.conceptClass,
        retired: option.retired,
        key: option.uuid,
        value: option.display,
        id: option.uuid,
        label: option.display
      };
    }),
    { retired: false }
  );
}

export function formatConceptSetMembersAsOptions(concept: ConceptGet) {
  if (!concept) {
    return null;
  }

  return _.filter(
    _.map(concept.setMembers, (option: ConceptGet) => {
      return {
        uuid: option.uuid,
        display: option.display,
        name: option.name.display,
        names: option.names,
        dataType: option.datatype,
        conceptClass: option.conceptClass,
        retired: option.retired,
        key: option.uuid,
        value: option.display,
        id: option.uuid,
        label: option.display
      };
    }),
    { retired: false }
  );
}

export function formatDrugOrderFrequencyConcept(frequencyConcepts) {
  return _.filter(
    _.map(frequencyConcepts, frequencyConcept => {
      return {
        uuid: frequencyConcept.uuid,
        display: frequencyConcept.name,
        frequency: frequencyConcept.frequencyPerDay,
        name: frequencyConcept.name,
        retired: frequencyConcept.retired,
        key: frequencyConcept.uuid,
        value: frequencyConcept.name,
        id: frequencyConcept.uuid,
        label: frequencyConcept.name
      };
    }),
    { retired: false }
  );
}
