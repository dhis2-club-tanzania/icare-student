export function formatEncountersForLabReport(
  encounterInformation: any[]
): any[] {
  return encounterInformation?.map((encounterFormData: any) => {
    return {
      ...encounterFormData,
      form: {
        ...encounterFormData?.form,
        formFields: encounterFormData?.form?.formFields?.map(
          (formField: any) => {
            return {
              ...formField,
              atLeastOnFormFieldSetMemberHasData:
                identifyCountOfFormFieldsWithData(
                  formField?.field?.concept?.setMembers,
                  encounterFormData
                ) > 0,
            };
          }
        ),
      },
    };
  });
}

function identifyCountOfFormFieldsWithData(
  formFields: any[],
  encounter: any
): number {
  return (
    formFields?.filter(
      (concept: any) => encounter?.keyedObs[concept?.uuid]?.latest?.value
    ) || []
  )?.length;
}
