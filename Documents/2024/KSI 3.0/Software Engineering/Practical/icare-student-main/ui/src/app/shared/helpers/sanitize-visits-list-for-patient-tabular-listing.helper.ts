export function sanitizePatientsVisitsForTabularPatientListing(
  allVisitsData,
  shouldShowParentLocation,
  paymentTypeSelected?,
  itemsPerPage?,
  currentPage?
) {
  const filteredVisitDetails = paymentTypeSelected
    ? allVisitsData.filter(
        (visitData) => visitData?.visit?.paymentType === paymentTypeSelected
      )
    : allVisitsData;
  const data = filteredVisitDetails.map((visitDetails, index) => {
    return {
      ...visitDetails?.visit,
      position:
        itemsPerPage && currentPage
          ? itemsPerPage * currentPage + index + 1
          : index + 1,
      names: visitDetails?.visit?.patient?.person?.display?.toUpperCase(),
      mrn:
        (
          visitDetails?.visit?.patient?.identifiers?.filter(
            (identifier) =>
              identifier?.identifierType?.display?.toLowerCase() === "mrn" ||
              identifier?.identifierType?.display?.toLowerCase() ===
                "openempi id"
          ) || []
        )?.length > 0
          ? (visitDetails?.visit?.patient?.identifiers?.filter(
              (identifier) =>
                identifier?.identifierType?.display?.toLowerCase() === "mrn" ||
                identifier?.identifierType?.display?.toLowerCase() ===
                  "openempi id"
            ) || [])[0]?.identifier
          : "",
      location:
        shouldShowParentLocation &&
        visitDetails?.visit?.location?.parentLocation
          ? visitDetails?.visit?.location?.parentLocation?.display +
            " / " +
            visitDetails?.visit?.location?.display
          : visitDetails?.visit?.location?.display,
      gender: visitDetails?.visit?.patient?.person?.gender,
      age: visitDetails?.visit?.patient?.person?.age,
      birthdate: visitDetails?.visit?.patient?.person?.birthdate?.substring(
        0,
        10
      ),
      data: visitDetails,
      paymentType: visitDetails?.visit?.paymentType,
      visitType: visitDetails?.visit?.visitType?.name,
      startDatetime: visitDetails?.visit?.startDatetime,
    };
  });
  return paymentTypeSelected
    ? data?.filter((row) => row.paymentType === paymentTypeSelected)
    : data;
}
