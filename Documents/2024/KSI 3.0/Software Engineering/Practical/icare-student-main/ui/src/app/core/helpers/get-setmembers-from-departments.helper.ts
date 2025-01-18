import { uniqBy, orderBy, flatten } from "lodash";

export function getProcedures(departments): any {
  const procedureDepartment = ((departments || [])?.filter(
    (department) => department?.name?.toLowerCase().indexOf("procedure") === 0
  ) || [])[0];
  return !procedureDepartment
    ? []
    : uniqBy(
        orderBy(
          flatten(
            procedureDepartment?.setMembers.map((setMember) => {
              return setMember?.setMembers;
            })
          ),
          ["name"],
          ["asc"]
        ),
        "uuid"
      );
}
