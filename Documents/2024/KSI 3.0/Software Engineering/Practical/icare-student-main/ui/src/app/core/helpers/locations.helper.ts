import * as _ from "lodash";
import { Location } from "../models";

let locationPath = "";

export function formatLocationsPayLoad(locations): Location[] {
  return _.map(locations, (location) => {
    // if (!location.retired) {
    const mainStoreTag =
      location?.tags?.length > 0
        ? (location?.tags?.filter(
            (tag) =>
              tag?.display?.toLowerCase() === "main store" ||
              tag?.display?.toLowerCase()?.indexOf("main store") > -1
          ) || [])[0]
        : null;
    locationPath = "";
    const modules = getLocationModules(location);
    return {
      ...location,
      id: location?.uuid,
      uuid: location?.uuid,
      country: location?.country,
      stateProvince: location?.stateProvince,
      postalCode: location?.postalCode,
      description: location?.description,
      name: location?.display,
      display: location?.display,
      childLocations: location?.childLocations,
      parentLocation: location?.parentLocation,
      links: location?.links,
      attributes: location?.attributes,
      tags: location?.tags,
      areChildLocationsBeds: checkIfTheChildAreBeds(location?.childLocations),
      areChildLocationsCabinets: checkIfTheChildAreCabinets(
        location?.childLocations
      ),
      beds: getBeds(location?.childLocations),
      cabinets: getCabinets(location?.childLocations),
      childMembers:
        (location.childLocations?.filter((loc) => !loc?.retired) || [])
          ?.length > 0
          ? getChildLocationMembers(location?.childLocations, locations)
          : [],
      path: _.reverse(
        (
          location?.uuid +
          "/" +
          (location?.parentLocation &&
          location?.parentLocation.hasOwnProperty("uuid")
            ? getPathForTheLocation(location?.parentLocation)
            : "")
        ).split("/")
      )
        .join("/")
        .substring(1),
      billingConcept:
        location?.attributes?.length > 0
          ? (location?.attributes?.filter(
              (attribute) =>
                attribute?.attributeType?.display === "Billing concept"
            ) || [])[0]?.value
          : null,
      modules: modules,
      isMainStore: mainStoreTag ? true : false,
    };
    // }
  }).filter((loc) => loc);
}

function getChildLocationMembers(childLocations, locations) {
  return childLocations?.map((location) => {
    const matchedLocations =
      locations?.filter((loc) => loc?.uuid === location?.uuid) || [];

    const currentLocation =
      matchedLocations?.length > 0 ? matchedLocations[0] : location;
    const patientPerBedAttribute =
      currentLocation &&
      currentLocation?.attributes &&
      currentLocation?.attributes?.length > 0
        ? (currentLocation?.attributes?.filter(
            (attribute) =>
              attribute?.attributeType?.display === "Patients per bed"
          ) || [])[0]
        : null;
    return {
      ...currentLocation,
      childMembers:
        (currentLocation?.childLocations?.filter((loc) => !loc?.retired) || [])
          ?.length > 0
          ? getChildLocationMembers(currentLocation?.childLocations, locations)
          : [],
      isBed:
        currentLocation &&
        currentLocation?.tags &&
        (
          currentLocation?.tags.filter(
            (tag) => tag?.display === "Bed Location"
          ) || []
        )?.length > 0,
      billingConcept: getBillingConceptUuid(currentLocation?.attributes),
      patientsPerBed: patientPerBedAttribute
        ? parseInt(patientPerBedAttribute?.value)
        : 1,
      path: _.reverse(
        (
          location?.uuid +
          "/" +
          (location?.parentLocation &&
          location?.parentLocation.hasOwnProperty("uuid")
            ? getPathForTheLocation(location?.parentLocation)
            : "")
        ).split("/")
      )
        .join("/")
        .substring(1),
    };
  });
}

export function getBillingConceptUuid(attributes): void {
  const billingConceptAttribute = (attributes?.filter(
    (attribute) =>
      attribute?.attributeType?.display?.toLowerCase() === "billing concept" ||
      attribute?.display?.toLowerCase()?.indexOf("billing concept") > -1
  ) || [])[0];
  return attributes?.length > 0
    ? billingConceptAttribute?.value
      ? billingConceptAttribute?.value
      : billingConceptAttribute?.display?.split(": ")[1]
    : null;
}

function getLocationModules(location) {
  const locationModuleAttributes =
    location?.attributes?.filter(
      (attribute) =>
        !attribute?.voided &&
        attribute?.attributeType?.display.toLowerCase() === "modules" &&
        !attribute?.voided
    ) || [];
  return locationModuleAttributes?.length > 0
    ? locationModuleAttributes.map((attribute) => {
        return {
          uuid: attribute?.uuid,
          id: attribute?.value.toLowerCase(),
          location,
        };
      })
    : [];
}

function checkIfTheChildAreBeds(childLocations) {
  /**
   * TODO: this has to be softcodes using global configs
   */
  return childLocations && childLocations?.length > 0
    ? childLocations[0]?.tags?.some((tag) => tag?.display === "Bed Location")
    : false;
}

function checkIfTheChildAreCabinets(childLocations) {
  /**
   * TODO: this has to be softcodes using global configs
   */
  return childLocations && childLocations?.length > 0
    ? childLocations[0]?.tags?.some(
        (tag) => tag?.display === "Mortuary Location"
      )
    : false;
}

function getBeds(childLocations) {
  return checkIfTheChildAreBeds(childLocations) ? childLocations : [];
}

function getCabinets(childLocations) {
  return checkIfTheChildAreCabinets(childLocations) ? childLocations : [];
}

function getPathForTheLocation(location) {
  locationPath +=
    location?.uuid +
    "/" +
    (location?.parentLocation && location?.parentLocation.hasOwnProperty("uuid")
      ? getPathForTheLocation(location?.parentLocation)
      : "");
  return locationPath;
}

export function getChildrenLocations(location) {
  return location?.childLocations;
}
