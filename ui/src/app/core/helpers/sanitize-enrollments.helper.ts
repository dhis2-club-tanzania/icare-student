export function formatEnrollmentsList(
  displayColumns: string[],
  enrolledPatients: any[]
): any {
  return enrolledPatients?.map((enrollment: any, index: number) => {
    let data: any = {};
    displayColumns?.forEach((column: string) => {
      data[column] =
        column === "sn"
          ? index + 1
          : column === "mrn"
          ? enrollment?.patient?.identifiers[0]?.identifier
          : column === "gender"
          ? enrollment?.patient?.person?.gender
          : column === "age"
          ? enrollment?.patient?.person?.age
          : column === "names"
          ? enrollment?.patient?.person?.display
          : "";
    });
    data["enrollment"] = enrollment;
    return data;
  });
}
