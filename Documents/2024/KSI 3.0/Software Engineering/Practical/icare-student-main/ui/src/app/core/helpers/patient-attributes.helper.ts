export function identifyIfPatientHasPhoneAttribute(
  patient,
  generalMetadataConfigurations
): string {
  return !patient?.person?.attributes ||
    (patient?.person?.attributes && patient?.person?.attributes?.length == 0)
    ? ""
    : (
        patient?.person?.attributes.filter(
          (attribute) =>
            attribute?.attributeType?.uuid ===
            generalMetadataConfigurations?.phoneAttribute?.uuid
        ) || []
      )?.length > 0
    ? (patient?.person?.attributes.filter(
        (attribute) =>
          attribute?.attributeType?.uuid ===
          generalMetadataConfigurations?.phoneAttribute?.uuid
      ) || [])[0]?.value
    : "";
}
