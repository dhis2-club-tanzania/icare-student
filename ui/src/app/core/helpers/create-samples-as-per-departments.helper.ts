import { groupBy, uniqBy } from "lodash";
import { keyDepartmentsByTestOrder } from "src/app/shared/helpers/sample-types.helper";
import { ConceptGetFull } from "src/app/shared/resources/openmrs";

export function formulateSamplesByDepartments(
  labSections: ConceptGetFull[],
  testOrders: any[]
) {
  const keyedDepartmentsByTestOrders = keyDepartmentsByTestOrder(labSections);
  //   Add departments to test orders
  const testOrdersWithDepartments = testOrders.map((testOrder) => {
    return {
      ...keyedDepartmentsByTestOrders[testOrder?.value],
      ...testOrder,
    };
  });

  const groupedTests = groupBy(testOrdersWithDepartments, "departmentUuid");
  return Object.keys(groupedTests).map((key) => {
    return uniqBy(groupedTests[key], "value");
  });
}

export function determineIfAtLeastOneTestHasNoDepartment(
  labSections: ConceptGetFull[],
  testOrders: any[]
): boolean {
  const keyedDepartmentsByTestOrders = keyDepartmentsByTestOrder(labSections);
  return (
    (
      testOrders.filter(
        (order) => keyedDepartmentsByTestOrders[order?.value]
      ) || []
    )?.length === testOrders?.length
  );
}
