import * as _ from 'lodash';

export function formatConceptResults(results) {
  /**
   * TODO: refactor how to handle generation of ranges. consider critical values
   */
  return _.map(results, (result) => {
    return {
      id: result.uuid,
      ...result,
      name: result?.name ? result?.name?.name : result?.display,
      shortNameDetails:
        result.names && result?.names?.length > 0
          ? (result?.names.filter(
              (name) => name?.conceptNameType === 'SHORT'
            ) || [])[0]
          : null,
      setMembers: result?.setMembers.map((member) => {
        return {
          ...member,
          shortNameDetails:
            member.names && member?.names?.length > 0
              ? (member?.names.filter(
                  (name) => name?.conceptNameType === 'SHORT'
                ) || [])[0]
              : null,
        };
      }),
      answers: result?.answers,
      type: result?.numeric ? 'number' : 'text',
      min: result?.numeric && result?.lowNormal ? result?.lowNormal : null,
      max: result?.numeric && result?.hiNormal ? result?.hiNormal : null,
      options:
        result?.numeric && result?.hiNormal && result?.lowNormal
          ? generateMinMaxValuesFromConceptRanges(
              result?.lowNormal,
              result?.hiNormal
            )
          : [],
    };
  });
}

function generateMinMaxValuesFromConceptRanges(min, max) {
  let items = [];

  let diff = Number((max - min) / ((max - min) * 10));
  let startValue = Number(min);

  items = [...items, Number(min.toFixed(2))];
  for (var i = 0; i < (max - min) * 10; i++) {
    items = [...items, Number((startValue + Number(diff)).toFixed(2))];
    startValue += Number(diff.toFixed(2));
  }
  items = [...items, Number(max.toFixed(2))];
  return _.uniq(items);
}
export function createKeyValuePairForAllLabDepartments(departments) {
  let keyedDepartmentsByTestOrder = {};
  departments.forEach((department) => {
    department?.setMembers.forEach((member) => {
      keyedDepartmentsByTestOrder[member?.uuid] = {
        ...member,
        department: {
          uuid: department?.uuid,
          id: department?.uuid,
          name: department?.display,
          display: department?.display,
        },
      };
    });
  });
  return keyedDepartmentsByTestOrder;
}

export function groupTestsBySpecimenSource(
  tests,
  specimenSources,
  labDepartments,
  patient
) {
  const keyedDepartmentsByTestOrder =
    createKeyValuePairForAllLabDepartments(labDepartments);
  let orders = [];
  _.each(tests, (order) => {
    _.each(specimenSources, (source) => {
      _.filter(source?.setMembers, (item) => {
        if (item.uuid == order?.concept?.uuid) {
          orders = [
            ...orders,
            {
              ...order,
              orderer: {
                ...order?.orderer,
                name: order?.orderer?.display.split('-')[1],
              },
              hiNormal: item?.hiNormal,
              lowNormal: item?.lowNormal,
              units: item?.units,
              numeric: item?.numeric,
              answers: item?.answers,
              specimenSourceName: source?.display,
              specimenSourceUuid: source?.uuid,
              departmentUuid:
                keyedDepartmentsByTestOrder[item?.uuid]?.department?.id,
              departmentName:
                keyedDepartmentsByTestOrder[item?.uuid]?.department?.name,
              departmentSpecimentSource:
                keyedDepartmentsByTestOrder[item?.uuid]?.department?.id +
                '_' +
                source?.uuid,
            },
          ];
        }
      });
    });
  });
  const groupedOrders = _.groupBy(orders, 'departmentSpecimentSource');
  return _.map(Object.keys(groupedOrders), (key) => {
    return {
      specimenSourceName: (groupedOrders[key] || [])[0]?.specimenSourceName,
      patient: patient?.patient,
      departmentName: (groupedOrders[key] || [])[0]?.departmentName,
      departmentUuid: (groupedOrders[key] || [])[0]?.departmentUuid,
      specimenSourceUuid: (groupedOrders[key] || [])[0]?.specimenSourceUuid,
      departmentSpecimentSource: (groupedOrders[key] || [])[0]
        ?.departmentSpecimentSource,
      orders: groupedOrders[key],
    };
  });
}
