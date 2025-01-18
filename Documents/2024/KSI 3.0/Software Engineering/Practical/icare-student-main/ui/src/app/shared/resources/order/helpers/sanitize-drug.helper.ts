import * as _ from 'lodash';
import { DrugOrderObject } from 'src/app/shared/resources/order/models/drug-order.model';
import { DrugGet } from '../../openmrs';

export function formatDrugs(drugs) {
  if (!drugs) {
    return null;
  }

  return _.map(drugs, (drug: DrugGet) => {
    return {
      uuid: drug.uuid,
      name: drug.display,
      display: drug.display,
      dosageForm: drug.dosageForm,
      combination: drug.combination,
      maximumDailyDose: drug.maximumDailyDose,
      minimumDailyDose: drug.minimumDailyDose,
      conceptUuid: drug.concept.uuid,
      strength: drug.strength,
      key: drug.uuid,
      id: drug.uuid,
      value: drug.display,
      label: drug.display,
    };
  });
}

export function getUuidFromOptions(value, options) {
  const matchedOption = (_.filter(options, { display: value }) || [])[0];
  if (matchedOption) {
    return matchedOption.uuid;
  }
}

export function formatDrugOrderObjectOld(
  order,
  includePreviousOrder: boolean = false
): DrugOrderObject {
  const drugOrder = {
    encounter: order?.encounterUuid,
    orderType: order?.orderType?.uuid,
    concept: order.concept.uuid,
    drug: order?.drugUuid?.uuid,
    action: order?.action || 'NEW',
    urgency: order?.urgency,
    type: 'drugorder',
    orderer: order?.orderer?.uuid || order?.providerUuid,
    patient: order.patientUuid,
    dose: order.dose,
    orderReason: order.reason,
    instructions: order.instructions,
    doseUnits: order.doseUnits,
    route: order?.route,
    frequency: order?.frequency,
    careSetting: order?.careSetting || 'OUTPATIENT',
    quantity: order?.quantity || 0,
    quantityUnits: order?.doseUnits,
    numRefills: order.numRefills,
    dispenseAsWritten: order.dispenseAsWritten,
  };

  return includePreviousOrder ? { ...drugOrder, uuid: order?.uuid } : drugOrder;
}
