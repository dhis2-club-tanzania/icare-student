import { uniqBy, flatten, keyBy } from 'lodash';

export function getApplicableForms(
  iCareConfigs,
  currentUser,
  formPrivilegesConfigs,
  userPrivileges?
) {
  userPrivileges = userPrivileges
    ? userPrivileges
    : keyBy(currentUser?.privileges, 'uuid');

  const privilegeFormsConfigs =
    formPrivilegesConfigs.filter(
      (formsWithUserPrivilege) => userPrivileges[formsWithUserPrivilege?.id]
    ) || [];
  const privilegeForms = flatten(
    privilegeFormsConfigs.map((matchedConfig) => {
      return matchedConfig?.forms;
    })
  );

  return uniqBy(privilegeForms, 'id');
}
