import { filter } from "lodash";

export function sanitizeUserLocations(locationsUuids, allLocations) {
  const userLocations = filter(allLocations, (location) => {
    if (locationsUuids?.indexOf(location?.uuid) > -1) {
      return location;
    }
  }).filter((loc) => loc);
  return userLocations;
}
