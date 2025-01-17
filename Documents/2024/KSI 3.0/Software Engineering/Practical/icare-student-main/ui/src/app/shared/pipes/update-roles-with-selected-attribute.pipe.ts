import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "updateRolesWithSelectedAttribute",
})
export class UpdateRolesWithSelectedAttributePipe implements PipeTransform {
  transform(roles: any[], selectedRoles: any[]): any {
    if (!selectedRoles || selectedRoles?.length === 0) {
      return roles || [];
    }

    if (!roles) {
      return [];
    }
    return roles?.map((role) => {
      return {
        ...role,
        selected:
          (
            selectedRoles.filter((selectedOne) => selectedOne === role?.uuid) ||
            []
          )?.length > 0,
      };
    });
  }
}
