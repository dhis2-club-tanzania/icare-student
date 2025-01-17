import * as _ from "lodash";
let beds = [];
export function getBedsFromAdmissionLocation(location, allBeds) {
  _.map(location?.childLocations, (childLocation) => {
    const isBedAvailable = checkIfTheLocationIsAvailableOnBeds(
      childLocation,
      allBeds
    );
    if (isBedAvailable) {
      beds = [
        ...beds,
        (_.filter(allBeds, { uuid: childLocation?.uuid }) || [])[0],
      ];
    } else {
      getBedsFromAdmissionLocation(childLocation, allBeds);
    }
  });
  return _.uniqBy(beds, "uuid");
}

function checkIfTheLocationIsAvailableOnBeds(location, locationBeds) {
  return (_.filter(locationBeds, { uuid: location?.uuid }) || [])?.length > 0
    ? true
    : false;
}

export function getBedsUnderCurrentLocation(locations, currentLocationUuid) {
  /**
   * TODO: improve the filter
   */
  let currentLocationPath = (_.filter(locations, {
    uuid: currentLocationUuid,
  }) || [])[0]?.path;
  let bedsUnderCurrentLocation = [];
  _.each(locations, (location) => {
    if (
      location?.path.indexOf(currentLocationPath) > -1 &&
      location?.areChildLocationsBeds
    ) {
      bedsUnderCurrentLocation = _.uniqBy(
        [
          ...bedsUnderCurrentLocation,
          ...location?.childLocations.map((location) => {
            const patientPerBedAttribute =
              location?.attributes && location?.attributes?.length > 0
                ? (location?.attributes?.filter(
                    (attribute) =>
                      attribute?.attributeType?.display === "Patients per bed"
                  ) || [])[0]
                : null;
            return {
              ...location,
              isBed: true,
              patientsPerBed: patientPerBedAttribute
                ? parseInt(patientPerBedAttribute?.value)
                : 1,
            };
          }),
        ],
        "uuid"
      );
    }
  });
  return bedsUnderCurrentLocation;
}

export function getCabinentsUnderCurrentLocation(
  locations,
  currentLocationUuid
) {
  /**
   * TODO: improve the filter
   */
  let currentLocationPath = (_.filter(locations, {
    uuid: currentLocationUuid,
  }) || [])[0]?.path;
  let cabinetsUnderCurrentLocation = [];
  _.each(locations, (location) => {
    if (
      location?.path.indexOf(currentLocationPath) > -1 &&
      location?.areChildLocationsCabinets
    ) {
      cabinetsUnderCurrentLocation = _.uniqBy(
        [...cabinetsUnderCurrentLocation, ...location?.childLocations],
        "uuid"
      );
    }
  });
  return cabinetsUnderCurrentLocation;
}
