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
  attributes?: {
    display?: string;
    uuid?: string;
    value?: string;
    voided?: boolean;
    attributeType?: { uuid?: string; display?: string };
  }[];
  tags?: any[];
  path: string;
  beds?: Location[];
  areChildLocationsBeds?: boolean;
  areChildLocationsCabinets?: boolean;
  cabinets?: Location[];
  billingConcept?: string;
  modules?: any[];
}
