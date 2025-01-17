import * as _ from 'lodash';

export function getDepartmentsGroupsForInvestigationAndProcedure(details) {
  return _.map(details?.setMembers, (setMember) => {
    return setMember;
  });
}
