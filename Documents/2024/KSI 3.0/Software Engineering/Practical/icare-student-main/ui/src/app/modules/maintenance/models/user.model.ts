export interface UserCreateModel {
  name: string;
  description?: string;
  username: string;
  password: string;
  person: PersonCreateModel;
  systemId?: string;
  userProperties?: {
    locations: string;
    lockoutTimestamp: string;
    loginAttempts: string;
  };
  roles?: RoleCreateModel[];
  proficientLocales?: object[];
  secretQuestion?: string;
  display?: string;
  uuid?: string;
  privileges: any[];
  allRoles: any[];
}

export interface PersonCreateModel {
  uuid?: string;
  display?: string;
  names?: any[];
  preferredName?: {
    display: string;
    familyName: string;
    familyName2: null;
    givenName: string;
    middleName: string;
    uuid: string;
  };
  gender?: string;
  age?: string;
  birthdateEstimated?: boolean;
  dead?: boolean;
  birthdate?: string;
  preferredAddress?: PersonAddress;
  addresses?: PersonAddress[];
}

export interface RoleCreateModel {}

export interface SourceCapabilities {
  firesTouchEvents: boolean;
}

export interface View {
  window: string;
  self: string;
  document: string;
  name: string;
  location: string;
}

export interface PersonAddress {
  display: string;
  uuid: string;
  preferred: boolean;
  address1: string;
  address2?: any;
  cityVillage: string;
  stateProvince: string;
  country: string;
  postalCode: string;
  countyDistrict?: any;
  startDate?: any;
  endDate?: any;
  latitude?: any;
  longitude?: any;
}
export interface GlobalEventHandlersEvent {
  altKey: boolean;
  stopPropagation: Function;
  altitudeAngle: number;
  azimuthAngle: number;
  bubbles: boolean;
  button: number;
  buttons: number;
  cancelBubble: boolean;
  cancelable: boolean;
  clientX: number;
  clientY: number;
  composed: boolean;
  ctrlKey: boolean;
  currentTarget?: any;
  defaultPrevented: boolean;
  detail: number;
  eventPhase: number;
  fromElement?: any;
  height: number;
  isPrimary: boolean;
  isTrusted: boolean;
  layerX: number;
  layerY: number;
  metaKey: boolean;
  movementX: number;
  movementY: number;
  offsetX: number;
  offsetY: number;
  pageX: number;
  pageY: number;
  pointerId: number;
  path: any[];
  pointerType: string;
  pressure: number;
  relatedTarget?: any;
  returnValue: boolean;
  screenX: number;
  screenY: number;
  shiftKey: boolean;
  sourceCapabilities: SourceCapabilities;
  srcElement: string;
  tangentialPressure: number;
  target: string;
  tiltX: number;
  tiltY: number;
  timeStamp: number;
  toElement?: any;
  twist: number;
  type: string;
  view: View;
  which: number;
  width: number;
  x: number;
  y: number;
  crtlKey: boolean;
}
