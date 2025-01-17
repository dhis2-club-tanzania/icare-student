import { LocationAttributeGetFull } from "src/app/shared/resources/openmrs";

export interface Location {
  uuid: string;
  display?: string;
  country?: string;
  postalCode?: string;
  stateProvince?: string;
  id?: string;
  name?: string;
  links: { rel?: string; uri?: string }[];
  description?: string;
  childLocations?: Location[];
  parentLocation?: Location[];
  attributes?: LocationAttributeGetFull[];
  tags?: any[];
  path: string;
  beds?: Location[];
  areChildLocationsBeds?: boolean;
  areChildLocationsCabinets?: boolean;
  cabinets?: Location[];
  billingConcept?: string;
  modules?: any[];
}
