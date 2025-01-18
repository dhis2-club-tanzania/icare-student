export function getBillingConceptFromLocation(location) {
  return location?.attributes && location?.attributes?.length > 0
    ? ((
        location?.attributes.filter(
          (attribute) =>
            attribute?.attributeType?.display?.toLowerCase() ===
              "billing concept" ||
            attribute?.display?.toLowerCase()?.indexOf("billing concept") > -1
        ) || []
      )
        .map(
          (filteredAttribute) =>
            filteredAttribute?.value ||
            filteredAttribute?.display?.split(": ")[1]
        )
        .filter((concept) => concept) || [])[0]
    : null;
}
