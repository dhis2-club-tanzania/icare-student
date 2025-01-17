import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "updatePrivilegesWithSelectedAttribute",
})
export class UpdatePrivilegesWithSelectedAttributePipe
  implements PipeTransform
{
  transform(privileges: any[], selectedPrivileges: string[]): any {
    if (!selectedPrivileges || selectedPrivileges?.length === 0) {
      return privileges || [];
    }

    if (!privileges) {
      return [];
    }
    return privileges?.map((privilege) => {
      return {
        ...privilege,
        selected:
          (
            selectedPrivileges.filter(
              (selectedOne) => selectedOne === privilege?.uuid
            ) || []
          )?.length > 0,
      };
    });
  }
}
