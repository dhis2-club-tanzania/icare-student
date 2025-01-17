import { Injectable } from "@angular/core";

/* tslint:disable */
/* eslint-disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PersonCreate {
  names: PersonNameCreate[];
  gender: "M" | "F";
  age?: number;
  birthdate?: string;
  birthdateEstimated?: boolean;
  dead?: boolean;
  deathDate?: string;
  causeOfDeath?: string;
  addresses?: PersonAddressCreate[];
  attributes?: PersonAttributeCreate[];
  deathdateEstimated?: boolean;
}

export interface PersonCreateFull {
  names: PersonNameCreate[];
  gender: "M" | "F";
  age?: number;
  birthdate?: string;
  birthdateEstimated?: boolean;
  dead?: boolean;
  deathDate?: string;
  causeOfDeath?: string;
  addresses?: PersonAddressCreate[];
  attributes?: PersonAttributeCreate[];
  deathdateEstimated?: boolean;
}

export interface PersonGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  gender?: "M" | "F";
  age?: number;
  birthdate?: string;
  birthdateEstimated?: boolean;
  dead?: boolean;
  deathDate?: string;
  causeOfDeath?: string;
  attributes?: PersonAttributeGetRef[];
  voided?: boolean;
  preferredName?: PersonNameGetRef;
  preferredAddress?: PersonAddressGetRef;
  deathdateEstimated?: boolean;
}

export interface PersonGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface PersonGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  gender?: "M" | "F";
  age?: number;
  birthdate?: string;
  birthdateEstimated?: boolean;
  dead?: boolean;
  deathDate?: string;
  causeOfDeath?: string;
  attributes?: PersonAttributeGetRef[];
  voided?: boolean;
  preferredName?: PersonNameGet;
  preferredAddress?: PersonAddressGet;
  names?: PersonNameGet[];
  addresses?: PersonAddressGet[];
  deathdateEstimated?: boolean;
}

export interface PersonUpdate {
  dead: boolean;
  causeOfDeath: string;
  deathDate?: string;
  age?: number;
  gender?: "M" | "F";
  birthdate?: string;
  birthdateEstimated?: boolean;
  preferredName?: string;
  preferredAddress?: string;
  attributes?: PersonAttributeCreate[];
  deathdateEstimated?: boolean;
}

export interface PersonattributetypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  format?: string;
  foreignKey?: number;
  sortWeight?: number;
  searchable?: boolean;
  editPrivilege?: PrivilegeGetRef;
}

export interface PersonattributetypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface PersonattributetypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  format?: string;
  foreignKey?: number;
  sortWeight?: number;
  searchable?: boolean;
  editPrivilege?: PrivilegeGet;
  concept?: string;
}

export interface PersonattributetypeCreate {
  name: string;
  description: string;
  format?: string;
  foreignKey?: number;
  sortWeight?: number;
  searchable?: boolean;
  editPrivilege?: PrivilegeCreate;
}

export interface PersonattributetypeCreateFull {
  name: string;
  description: string;
  format?: string;
  foreignKey?: number;
  sortWeight?: number;
  searchable?: boolean;
  editPrivilege?: PrivilegeCreate;
}

export interface PersonattributetypeUpdate {
  name: string;
  description: string;
  format?: string;
  foreignKey?: number;
  sortWeight?: number;
  searchable?: boolean;
  editPrivilege?: PrivilegeCreate;
}

export interface OrdergroupCreate {
  patient?: string;
  encounter?: string;
  orders?: OrderCreate[];
  orderSet?: string;
}

export interface OrdergroupCreateFull {
  patient?: string;
  encounter?: string;
  orders?: OrderCreate[];
  orderSet?: string;
}

export interface OrdergroupGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  voided?: boolean;
  patient?: PatientGetRef;
  encounter?: EncounterGetRef;
  orders?: OrderGetRef;
  orderSet?: OrdersetGetRef;
}

export interface OrdergroupGetRef {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
}

export interface OrdergroupGetFull {
  auditInfo?: boolean;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  voided?: boolean;
  patient?: PatientGetRef;
  encounter?: EncounterGetRef;
  orders?: OrderGetRef[];
  orderSet?: OrdersetGetRef;
}

export interface OrdergroupUpdate {
  orders?: OrderCreate[];
}

export interface ProviderGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  person?: PersonGetRef;
  identifier?: string;
  attributes?: ProviderAttributeGetRef[];
  preferredHandlerClassname?: string;
}

export interface ProviderGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ProviderGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  person?: PersonGet;
  identifier?: string;
  attributes?: ProviderAttributeGet[];
  preferredHandlerClassname?: string;
}

export interface ProviderCreate {
  name: string;
  description?: string;
  person: string;
  identifier: string;
  attributes?: ProviderAttributeCreate[];
  retired?: boolean;
}

export interface ProviderCreateFull {
  name: string;
  description?: string;
  person: PersonCreate;
  identifier: string;
  attributes?: ProviderAttributeCreate[];
  retired?: boolean;
}

export interface ProviderUpdate {
  name: string;
  description?: string;
  person: string;
  identifier: string;
  attributes?: ProviderAttributeCreate[];
  retired?: boolean;
}

export interface ConditionCreate {
  condition?: string;
  patient?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  previousVersion?: string;
  onsetDate?: string;
  endDate?: string;
  additionalDetail?: string;
}

export interface ConditionCreateFull {
  condition?: string;
  patient?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  previousVersion?: string;
  onsetDate?: string;
  endDate?: string;
  additionalDetail?: string;
}

export interface ConditionGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  condition?: string;
  patient?: PatientGetRef;
  clinicalStatus?: string;
  verificationStatus?: string;
  previousVersion?: string;
  onsetDate?: string;
  endDate?: string;
  additionalDetail?: string;
  voided?: string;
}

export interface ConditionGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ConditionGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  condition?: string;
  patient?: PatientGetRef;
  clinicalStatus?: string;
  verificationStatus?: string;
  previousVersion?: string;
  onsetDate?: string;
  endDate?: string;
  additionalDetail?: string;
  voided?: string;
}

export interface ConditionUpdate {
  condition?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  previousVersion?: string;
  onsetDate?: string;
  endDate?: string;
  additionalDetail?: string;
  voided?: string;
}

export interface Hl7SourceCreate {
  name: string;
  description: string;
}

export interface Hl7SourceCreateFull {
  name: string;
  description: string;
}

export interface Hl7SourceGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface Hl7SourceGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface Hl7SourceGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface Hl7SourceUpdate {
  name: string;
  description: string;
}

export interface AppointmentschedulingAppointmentblockGet {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingAppointmentblockGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingAppointmentblockGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface VisittypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface VisittypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface VisittypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface VisittypeCreate {
  name: string;
  description?: string;
}

export interface VisittypeCreateFull {
  name: string;
  description?: string;
}

export interface VisittypeUpdate {
  name: string;
  description?: string;
}

export interface ConceptdatatypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  hl7Abbreviation?: string;
  retired?: boolean;
}

export interface ConceptdatatypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ConceptdatatypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  hl7Abbreviation?: string;
}

export interface ProgramenrollmentCreate {
  patient: string;
  program: string;
  dateEnrolled: string;
  dateCompleted?: string;
  location?: string;
  voided?: boolean;
  states?: ProgramenrollmentStateCreate[];
  outcome?: ConceptCreate;
}

export interface ProgramenrollmentCreateFull {
  patient: PatientCreate;
  program: ProgramCreate;
  dateEnrolled: string;
  dateCompleted?: string;
  location?: LocationCreate;
  voided?: boolean;
  states?: ProgramenrollmentStateCreate[];
  outcome?: ConceptCreate;
}

export interface ProgramenrollmentGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  dateEnrolled?: string;
  dateCompleted?: string;
  voided?: boolean;
  patient?: PatientGetRef;
  program?: ProgramGetRef;
  location?: LocationGetRef;
}

export interface ProgramenrollmentGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ProgramenrollmentGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  dateEnrolled?: string;
  dateCompleted?: string;
  voided?: boolean;
  patient?: PatientGet;
  program?: ProgramGet;
  location?: LocationGet;
}

export interface ProgramenrollmentUpdate {
  dateEnrolled: string;
  states?: ProgramenrollmentStateCreate[];
  outcome?: ConceptCreate;
  location?: LocationCreate;
  voided?: boolean;
  dateCompleted?: string;
}

export interface EncounterCreate {
  patient: PatientCreate;
  encounterType: EncountertypeCreate;
  encounterDatetime?: string;
  location?: LocationCreate;
  form?: FormCreate;
  provider?: string;
  orders?: OrderCreate[];
  obs?: ObsCreate[];
}

export interface EncounterCreateFull {
  patient: PatientCreate;
  encounterType: EncountertypeCreate;
  encounterDatetime?: string;
  location?: LocationCreate;
  form?: FormCreate;
  provider?: string;
  orders?: OrderCreate[];
  obs?: ObsCreate[];
}

export interface EncounterGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  encounterDatetime?: string;
  provider?: string;
  voided?: boolean;
  patient?: PatientGetRef;
  location?: LocationGetRef;
  form?: FormGetRef;
  encounterType?: EncountertypeGetRef;
  obs?: ObsGetRef[];
  orders?: OrderGetRef[];
}

export interface EncounterGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface EncounterGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  encounterDatetime?: string;
  provider?: string;
  voided?: boolean;
  patient?: PatientGet;
  location?: LocationGet;
  form?: FormGet;
  encounterType?: EncountertypeGet;
  obs?: ObsGet[];
  orders?: OrderGet[];
}

export interface EncounterUpdate {
  patient: PatientCreate;
  encounterType: EncountertypeCreate;
  encounterDatetime?: string;
  location?: LocationCreate;
  form?: FormCreate;
  provider?: string;
  orders?: OrderCreate[];
  obs?: ObsCreate[];
  void?: boolean;
  voidReason?: string;
}

export interface AppointmentschedulingTimeslotGet {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingTimeslotGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingTimeslotGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface PatientCreate {
  person: string;
  identifiers: PatientIdentifierCreate[];
}

export interface PatientCreateFull {
  person: PersonCreate;
  identifiers: PatientIdentifierCreate[];
}

export interface PatientGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  identifiers?: PatientIdentifierGetRef[];
  preferred?: boolean;
  voided?: boolean;
  person?: PersonGetRef;
}

export interface PatientGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface PatientGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  identifiers?: PatientIdentifierGetRef[];
  preferred?: boolean;
  voided?: boolean;
  person?: PersonGet;
}

export interface PatientUpdate {
  person: PersonGet;
}

export interface AppointmentschedulingAppointmentstatushistoryGet {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingAppointmentstatushistoryGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingAppointmentstatushistoryGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface RelationshiptypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  aIsToB?: string;
  bIsToA?: string;
}

export interface RelationshiptypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface RelationshiptypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  aIsToB?: string;
  bIsToA?: string;
  weight?: number;
}

export interface RelationshiptypeCreate {
  name: string;
  description?: string;
  aIsToB: string;
  bIsToA: string;
  weight?: number;
}

export interface RelationshiptypeCreateFull {
  name: string;
  description?: string;
  aIsToB: string;
  bIsToA: string;
  weight?: number;
}

export type RelationshiptypeUpdate = any;

export interface AppointmentschedulingAppointmentrequestGet {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingAppointmentrequestGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingAppointmentrequestGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface ReportingrestCohortGet {
  links?: { rel?: string; uri?: string }[];
}

export interface ReportingrestCohortGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ReportingrestCohortGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface VisitGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  startDatetime?: string;
  stopDatetime?: string;
  attributes?: string[];
  voided?: boolean;
  patient?: PatientGetRef;
  visitType?: VisittypeGetRef;
  indication?: ConceptGetRef;
  location?: LocationGetRef;
  encounters?: EncounterGetRef[];
}

export interface VisitGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface VisitGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  startDatetime?: string;
  stopDatetime?: string;
  attributes?: string[];
  voided?: boolean;
  patient?: PatientGet;
  visitType?: VisittypeGet;
  indication?: ConceptGet;
  location?: LocationGet;
  encounters?: EncounterGet[];
}

export interface VisitCreate {
  patient: string;
  visitType: string;
  startDatetime?: string;
  location?: string;
  indication?: string;
  stopDatetime?: string;
  encounters?: string[];
  attributes?: VisitAttributeCreate[];
}

export interface VisitCreateFull {
  patient: PatientCreate;
  visitType: VisittypeCreate;
  startDatetime?: string;
  location?: LocationCreate;
  indication?: ConceptCreate;
  stopDatetime?: string;
  encounters?: EncounterCreate[];
  attributes?: VisitAttributeCreate[];
}

export interface VisitUpdate {
  visitType?: VisittypeCreate;
  startDatetime?: string;
  location?: LocationCreate;
  indication?: ConceptCreate;
  stopDatetime?: string;
  encounters?: EncounterCreate[];
  attributes?: string[];
}

export interface ReportingrestDataSetGet {
  links?: { rel?: string; uri?: string }[];
}

export interface ReportingrestDataSetGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ReportingrestDataSetGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface LocationGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  tags?: LocationtagGetRef[];
  parentLocation?: LocationGetRef;
  childLocations?: LocationGetRef[];
  attributes?: any[];
  forms?: any[];
}

export interface LocationGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface LocationGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  tags?: LocationtagGet[];
  parentLocation?: LocationGet;
  childLocations?: LocationGet[];
}

export interface LocationCreate {
  name: string;
  description?: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  tags?: string[];
  parentLocation?: string;
  childLocations?: string[];
}

export interface LocationCreateFull {
  name: string;
  description?: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  tags?: string[];
  parentLocation?: string;
  childLocations?: string[];
}

export interface LocationUpdate {
  name: string;
  description?: string;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  tags?: string[];
  parentLocation?: string;
  childLocations?: string[];
}

export interface PatientdiagnosesCreate {
  diagnosis?: { coded?: string; nonCoded?: string; specificName: string };
  encounter?: string;
  condition?: string;
  certainty?: string;
  patient?: string;
  rank?: number;
}

export interface PatientdiagnosesCreateFull {
  diagnosis?: string;
  encounter?: string;
  condition?: string;
  certainty?: string;
  patient?: string;
  rank?: number;
}

export interface PatientdiagnosesGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  diagnosis?: string;
  condition?: string;
  certainty?: "PROVISIONAL" | "CONFIRMED";
  rank?: number;
  patient?: PatientGetRef;
  voided?: boolean;
}

export interface PatientdiagnosesGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface PatientdiagnosesGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  diagnosis?: string;
  condition?: string;
  certainty?: "PROVISIONAL" | "CONFIRMED";
  rank?: number;
  patient?: PatientGetRef;
  voided?: boolean;
}

export interface PatientdiagnosesUpdate {
  diagnosis?: string;
  condition?: string;
  encounter?: string;
  certainty?: "PROVISIONAL" | "CONFIRMED";
  rank?: number;
  voided?: boolean;
}

export interface UserGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  username?: string;
  systemId?: string;
  userProperties?: object;
  person?: PersonGetRef;
  privileges?: PrivilegeGetRef[];
  roles?: RoleGetRef[];
  provider?: { uuid?: string; display?: string };
}

export interface UserGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface UserGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  username?: string;
  systemId?: string;
  userProperties?: object;
  person?: PersonGet;
  privileges?: PrivilegeGet[];
  roles?: RoleGet[];
  allRoles?: RoleGet[];
  proficientLocales?: object[];
  secretQuestion?: string;
}

export interface UserCreate {
  name: string;
  description?: string;
  username: string;
  password: string;
  person: PersonCreate;
  systemId?: string;
  userProperties?: object;
  roles?: RoleCreate[];
  proficientLocales?: object[];
  secretQuestion?: string;
}

export interface UserCreateFull {
  name: string;
  description?: string;
  username: string;
  password: string;
  person: PersonCreate;
  systemId?: string;
  userProperties?: object;
  roles?: RoleCreate[];
  proficientLocales?: object[];
  secretQuestion?: string;
}

export interface UserUpdate {
  name: string;
  description?: string;
  username: string;
  password: string;
  person: PersonCreate;
  systemId?: string;
  userProperties?: object;
  roles?: RoleCreate[];
  proficientLocales?: object[];
  secretQuestion?: string;
}

export interface ProviderattributetypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeClassname?: string;
  preferredHandlerClassname?: string;
}

export interface ProviderattributetypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ProviderattributetypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeClassname?: string;
  preferredHandlerClassname?: string;
  datatypeConfig?: string;
  handlerConfig?: string;
}

export interface ProviderattributetypeCreate {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface ProviderattributetypeCreateFull {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface ProviderattributetypeUpdate {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface ReportingrestReportDefinitionGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ReportingrestReportDefinitionGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ReportingrestReportDefinitionGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface ReportingrestReportDefinitionCreate {
  name: string;
  description?: string;
}

export interface ReportingrestReportDefinitionCreateFull {
  name: string;
  description?: string;
}

export interface ReportingrestReportDefinitionUpdate {
  name: string;
  description?: string;
}

export interface ConceptmaptypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  isHidden?: boolean;
}

export interface ConceptmaptypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ConceptmaptypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  isHidden?: boolean;
}

export interface ConceptmaptypeCreate {
  name: string;
  description?: string;
  isHidden?: boolean;
}

export interface ConceptmaptypeCreateFull {
  name: string;
  description?: string;
  isHidden?: boolean;
}

export interface ConceptmaptypeUpdate {
  name: string;
  description?: string;
  isHidden?: boolean;
}

export interface ConceptreferencetermGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  code?: string;
  version?: string;
  conceptSource?: ConceptsourceGetRef;
}

export interface ConceptreferencetermGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ConceptreferencetermGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  code?: string;
  version?: string;
  conceptSource?: ConceptsourceGet;
}

export interface ConceptreferencetermCreate {
  name: string;
  description?: string;
  code: string;
  conceptSource: string;
  version?: string;
}

export interface ConceptreferencetermCreateFull {
  name: string;
  description?: string;
  code: string;
  conceptSource: string;
  version?: string;
}

export type ConceptreferencetermUpdate = any;

export interface EncountertypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface EncountertypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface EncountertypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface EncountertypeCreate {
  name: string;
  description: string;
}

export interface EncountertypeCreateFull {
  name: string;
  description: string;
}

export interface EncountertypeUpdate {
  name: string;
  description: string;
}

export interface CohortGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  voided?: string;
}

export interface CohortGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface CohortGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  voided?: string;
}

export interface CohortCreate {
  name: string;
  description: string;
  memberIds: number[];
}

export interface CohortCreateFull {
  name: string;
  description: string;
  memberIds: number[];
}

export interface CohortUpdate {
  name: string;
  description: string;
}

export interface EncounterroleGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface EncounterroleGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface EncounterroleGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface EncounterroleCreate {
  name: string;
  description?: string;
}

export interface EncounterroleCreateFull {
  name: string;
  description?: string;
}

export interface EncounterroleUpdate {
  name: string;
  description?: string;
}

export interface FieldGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  tableName?: string;
  attributeName?: string;
  defaultValue?: string;
  selectMultiple?: boolean;
  fieldType?: FieldtypeGetRef;
  concept?: ConceptGetRef;
}

export interface FieldGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface FieldGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  tableName?: string;
  attributeName?: string;
  defaultValue?: string;
  selectMultiple?: boolean;
  fieldType?: FieldtypeGet;
  concept?: ConceptGet;
}

export interface FieldCreate {
  name: string;
  description?: string;
  fieldType: FieldtypeCreate;
  selectMultiple: boolean;
  concept?: ConceptCreate;
  tableName?: string;
  attributeName?: string;
  defaultValue?: string;
}

export interface FieldCreateFull {
  name: string;
  description?: string;
  fieldType: FieldtypeCreate;
  selectMultiple: boolean;
  concept?: ConceptCreate;
  tableName?: string;
  attributeName?: string;
  defaultValue?: string;
}

export type FieldUpdate = any;

export interface ConceptclassGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ConceptclassGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ConceptclassGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface ConceptclassCreate {
  name: string;
  description?: string;
}

export interface ConceptclassCreateFull {
  name: string;
  description?: string;
}

export interface ConceptclassUpdate {
  name: string;
  description?: string;
}

export interface ReportingrestReportRequestGet {
  links?: { rel?: string; uri?: string }[];
}

export interface ReportingrestReportRequestGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ReportingrestReportRequestGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface CaresettingGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  careSettingType?: "OUTPATIENT" | "INPATIENT";
}

export interface CaresettingGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface CaresettingGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  careSettingType?: "OUTPATIENT" | "INPATIENT";
}

export interface TaskdefinitionGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface TaskdefinitionGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface TaskdefinitionGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface TaskdefinitionCreate {
  name: string;
  description?: string;
}

export interface TaskdefinitionCreateFull {
  name: string;
  description?: string;
}

export interface TaskdefinitionUpdate {
  name: string;
  description?: string;
}

export interface ReportingrestDataSetDefinitionGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ReportingrestDataSetDefinitionGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ReportingrestDataSetDefinitionGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface ReportingrestDataSetDefinitionCreate {
  name: string;
  description?: string;
}

export interface ReportingrestDataSetDefinitionCreateFull {
  name: string;
  description?: string;
}

export interface ReportingrestDataSetDefinitionUpdate {
  name: string;
  description?: string;
}

export interface ApptemplateGet {
  links?: { rel?: string; uri?: string }[];
}

export interface ApptemplateGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ApptemplateGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface ServerlogGet {
  links?: { rel?: string; uri?: string }[];
  serverLog?: object;
}

export interface ServerlogGetRef {
  links?: { rel?: string; uri?: string }[];
  serverLog?: object;
}

export interface ServerlogGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  serverLog?: object;
}

export interface TaskactionCreate {
  tasks?: string[];
  allTasks?: boolean;
  action:
    | "SCHEDULETASK"
    | "SHUTDOWNTASK"
    | "RESCHEDULETASK"
    | "RESCHEDULEALLTASKS"
    | "DELETE"
    | "RUNTASK";
}

export interface TaskactionCreateFull {
  tasks?: string[];
  allTasks?: boolean;
  action:
    | "SCHEDULETASK"
    | "SHUTDOWNTASK"
    | "RESCHEDULETASK"
    | "RESCHEDULEALLTASKS"
    | "DELETE"
    | "RUNTASK";
}

export interface TaskactionGet {
  links?: { rel?: string; uri?: string }[];
}

export interface TaskactionGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface TaskactionGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface ModuleactionCreate {
  modules?: string[];
  allModules?: boolean;
  action: "START" | "STOP" | "RESTART" | "UNLOAD" | "INSTALL";
  installUri?: string;
}

export interface ModuleactionCreateFull {
  modules?: string[];
  allModules?: boolean;
  action: "START" | "STOP" | "RESTART" | "UNLOAD" | "INSTALL";
  installUri?: string;
}

export interface PersonimageGet {
  links?: { rel?: string; uri?: string }[];
}

export interface PersonimageGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface PersonimageGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface FormGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  version?: string;
  build?: number;
  published?: boolean;
  retired?: boolean;
  encounterType?: EncountertypeGetRef;
  formFields?: FormFormfieldGetRef[];
}

export interface FormGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface FormGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  version?: string;
  build?: number;
  published?: boolean;
  encounterType?: EncountertypeGet;
  formFields?: FormFormfieldGet[];
}

export interface FormCreate {
  name: string;
  description?: string;
  version: string;
  encounterType?: string;
  build?: number;
  published?: boolean;
  formFields?: string[];
  xslt?: string;
  template?: string;
}

export interface FormCreateFull {
  name: string;
  description?: string;
  version: string;
  encounterType?: EncountertypeCreate;
  build?: number;
  published?: boolean;
  formFields?: FormFormfieldCreate[];
  xslt?: string;
  template?: string;
}

export interface FormUpdate {
  name: string;
  description?: string;
  version: string;
  encounterType?: string;
  build?: number;
  published?: boolean;
  formFields?: string[];
  xslt?: string;
  template?: string;
}

export interface ReportingrestReportdataGet {
  links?: { rel?: string; uri?: string }[];
}

export interface ReportingrestReportdataGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ReportingrestReportdataGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface OrderfrequencyGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface OrderfrequencyGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface OrderfrequencyGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface OrderfrequencyCreate {
  name: string;
  description?: string;
}

export interface OrderfrequencyCreateFull {
  name: string;
  description?: string;
}

export interface OrderfrequencyUpdate {
  name: string;
  description?: string;
}

export interface VisitattributetypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeClassname?: string;
  preferredHandlerClassname?: string;
}

export interface VisitattributetypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface VisitattributetypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeClassname?: string;
  preferredHandlerClassname?: string;
  datatypeConfig?: string;
  handlerConfig?: string;
}

export interface VisitattributetypeCreate {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface VisitattributetypeCreateFull {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface VisitattributetypeUpdate {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface AppointmentschedulingProviderscheduleGet {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingProviderscheduleGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingProviderscheduleGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface ModuleGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  started?: boolean;
  startupErrorMessage?: string;
}

export interface ModuleGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ModuleGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  started?: boolean;
  startupErrorMessage?: string;
  packageName?: string;
  author?: string;
  version?: string;
  requireOpenmrsVersion?: string;
  awareOfModules?: string[];
  requiredModules?: string[];
}

export interface LocationtagGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface LocationtagGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface LocationtagGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface LocationtagCreate {
  name: string;
  description?: string;
  retired?: boolean;
  retiredReason?: string;
}

export interface LocationtagCreateFull {
  name: string;
  description?: string;
  retired?: boolean;
  retiredReason?: string;
}

export interface LocationtagUpdate {
  name: string;
  description?: string;
  retired?: boolean;
  retiredReason?: string;
}

export interface OrdersetGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  operator?: "ALL" | "ONE" | "ANY";
  orderSetMembers?: OrdersetOrdersetmemberGetRef[];
}

export interface OrdersetGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface OrdersetGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  operator?: "ALL" | "ONE" | "ANY";
  orderSetMembers?: OrdersetOrdersetmemberGet[];
}

export interface OrdersetCreate {
  operator?: "ALL" | "ONE" | "ANY";
  orderSetMembers?: OrdersetOrdersetmemberCreate[];
}

export interface OrdersetCreateFull {
  operator?: "ALL" | "ONE" | "ANY";
  orderSetMembers?: OrdersetOrdersetmemberCreate[];
}

export interface OrdersetUpdate {
  operator?: "ALL" | "ONE" | "ANY";
  orderSetMembers?: OrdersetOrdersetmemberCreate[];
}

export interface Hl7Create {
  hl7: string;
}

export interface Hl7CreateFull {
  hl7: string;
}

export interface AppointmentschedulingAppointmentGet {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingAppointmentGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface AppointmentschedulingAppointmentGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface DrugGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  doseStrength?: number;
  strength: string;
  maximumDailyDose?: number;
  minimumDailyDose?: number;
  units?: string;
  combination?: boolean;
  dosageForm?: ConceptGetRef;
  concept?: ConceptGetRef;
  route?: ConceptGetRef;
  drugReferenceMaps?: DrugreferencemapGetRef;
}

export interface DrugGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface DrugGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  doseStrength?: number;
  maximumDailyDose?: number;
  minimumDailyDose?: number;
  units?: string;
  combination?: boolean;
  dosageForm?: ConceptGet;
  concept?: ConceptGet;
  route?: ConceptGet;
  drugReferenceMaps?: DrugreferencemapGet;
}

export interface DrugCreate {
  drugReferenceMaps?: DrugreferencemapCreate;
}

export interface DrugCreateFull {
  drugReferenceMaps?: DrugreferencemapCreate;
}

export interface DrugUpdate {
  drugReferenceMaps?: DrugreferencemapCreate;
}

export interface ProgramGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  concept?: ConceptGetRef;
  allWorkflows?: WorkflowGetRef[];
}

export interface ProgramGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  allWorkflows?: WorkflowGetRef[];
}

export interface ProgramGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  concept?: ConceptGet;
  allWorkflows?: WorkflowGet[];
}

export interface ProgramCreate {
  name: string;
  description: string;
  concept: string;
  retired?: boolean;
  outcomesConcept?: string;
}

export interface ProgramCreateFull {
  name: string;
  description: string;
  concept: ConceptCreate;
  retired?: boolean;
  outcomesConcept?: ConceptCreate;
}

export type ProgramUpdate = any;

export interface DrugreferencemapCreate {
  conceptReferenceTerm?: string;
  conceptMapType?: string;
  drug?: string;
}

export interface DrugreferencemapCreateFull {
  conceptReferenceTerm?: string;
  conceptMapType?: string;
  drug?: string;
}

export interface DrugreferencemapGet {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  drug?: DrugGetRef;
  conceptReferenceTerm?: ConceptreferencetermGetRef;
  conceptMapType?: ConceptmaptypeGetRef;
}

export interface DrugreferencemapGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface DrugreferencemapGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  drug?: DrugGet;
  conceptReferenceTerm?: ConceptreferencetermGet;
  conceptMapType?: ConceptmaptypeGet;
}

export interface DrugreferencemapUpdate {
  conceptReferenceTerm?: string;
  conceptMapType?: string;
  drug?: string;
}

export interface ConceptsourceGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  hl7Code?: string;
  retired?: boolean;
  uniqueId?: string;
}

export interface ConceptsourceGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  hl7Code?: string;
  retired?: boolean;
}

export interface ConceptsourceGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  hl7Code?: string;
  uniqueId?: string;
}

export interface ConceptsourceCreate {
  name: string;
  description: string;
  hl7Code?: string;
  uniqueId?: string;
}

export interface ConceptsourceCreateFull {
  name: string;
  description: string;
  hl7Code?: string;
  uniqueId?: string;
}

export interface ConceptsourceUpdate {
  name: string;
  description: string;
  hl7Code?: string;
  uniqueId?: string;
}

export interface OrdertypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  javaClassName?: string;
  conceptClasses?: ConceptclassGetRef[];
  parent?: OrdertypeGetRef;
}

export interface OrdertypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface OrdertypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  javaClassName?: string;
  conceptClasses?: ConceptclassGet[];
  parent?: OrdertypeGet;
}

export interface OrdertypeCreate {
  name: string;
  description?: string;
  javaClassName: string;
  parent?: string;
  conceptClasses?: string[];
}

export interface OrdertypeCreateFull {
  name: string;
  description?: string;
  javaClassName: string;
  parent?: string;
  conceptClasses?: string[];
}

export interface OrdertypeUpdate {
  name: string;
  description?: string;
  javaClassName: string;
  parent?: string;
  conceptClasses?: string[];
}

export interface ConceptstopwordGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  value?: string;
  locale?: string;
}

export interface ConceptstopwordGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ConceptstopwordGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  value?: string;
  locale?: string;
}

export interface ConceptstopwordCreate {
  value: string;
  locale?: string;
}

export interface ConceptstopwordCreateFull {
  value: string;
  locale?: string;
}

export interface ConceptstopwordUpdate {
  value: string;
  locale?: string;
}

export interface FieldtypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  isSet?: boolean;
}

export interface FieldtypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface FieldtypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  isSet?: boolean;
}

export interface FieldtypeCreate {
  name: string;
  description?: string;
}

export interface FieldtypeCreateFull {
  name: string;
  description?: string;
}

export type FieldtypeUpdate = any;

export interface OrderCreate {
  encounter?: string;
  orderType: string;
  action?: "NEW" | "REVISE" | "DISCONTINUE" | "RENEW";
  accessionNumber?: string;
  dateActivated?: string;
  scheduledDate?: string;
  patient: string;
  concept: string;
  careSetting?: string;
  dateStopped?: string;
  autoExpireDate?: string;
  orderer?: string;
  previousOrder?: string;
  urgency?: "ROUTINE" | "STAT" | "ON_SCHEDULED_DATE";
  orderReason?: string;
  orderReasonNonCoded?: string;
  instructions?: string;
  fulfillerStatus?: "RECEIVED" | "IN_PROGRESS" | "EXCEPTION" | "COMPLETED";
  commentToFulfiller?: string;
}

export interface OrderCreateFull {
  encounter?: EncounterCreate;
  orderType: string;
  action?: "NEW" | "REVISE" | "DISCONTINUE" | "RENEW";
  accessionNumber?: string;
  dateActivated?: string;
  scheduledDate?: string;
  patient: PatientCreate;
  concept: ConceptCreate;
  careSetting?: string;
  dateStopped?: string;
  autoExpireDate?: string;
  orderer?: UserCreate;
  previousOrder?: OrderCreate;
  urgency?: "ROUTINE" | "STAT" | "ON_SCHEDULED_DATE";
  orderReason?: ConceptCreate;
  orderReasonNonCoded?: string;
  instructions?: string;
  commentToFulfiller?: string;
}

export interface OrderGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  instructions?: string;
  startDate?: string;
  autoExpireDate?: string;
  accessionNumber?: string;
  discontinuedDate?: string;
  discontinuedReasonNonCoded?: string;
  voided?: boolean;
  orderType?: OrdertypeGetRef;
  patient?: PatientGetRef;
  concept?: ConceptGetRef;
  encounter?: EncounterGetRef;
  orderer?: UserGetRef;
  discontinuedBy?: UserGetRef;
  discontinuedReason?: ConceptGetRef;
}

export interface OrderGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface OrderGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  instructions?: string;
  startDate?: string;
  autoExpireDate?: string;
  accessionNumber?: string;
  discontinuedDate?: string;
  discontinuedReasonNonCoded?: string;
  voided?: boolean;
  orderType?: OrdertypeGet;
  patient?: PatientGet;
  concept?: ConceptGet;
  encounter?: EncounterGet;
  orderer?: UserGet;
  discontinuedBy?: UserGet;
  discontinuedReason?: ConceptGet;
}

export interface PatientidentifiertypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  format?: string;
  formatDescription?: string;
  required?: boolean;
  checkDigit?: boolean;
  validator?: string;
  locationBehavior?: "REQUIRED" | "NOT_USED";
  uniquenessBehavior?: string;
}

export interface PatientidentifiertypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface PatientidentifiertypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  format?: string;
  formatDescription?: string;
  required?: boolean;
  checkDigit?: boolean;
  validator?: string;
  locationBehavior?: "REQUIRED" | "NOT_USED";
  uniquenessBehavior?: string;
}

export interface PatientidentifiertypeCreate {
  name: string;
  description?: string;
  format?: string;
  formatDescription?: string;
  required?: boolean;
  checkDigit?: boolean;
  validator?: string;
  locationBehavior?: "REQUIRED" | "NOT_USED";
  uniquenessBehavior?: string;
}

export interface PatientidentifiertypeCreateFull {
  name: string;
  description?: string;
  format?: string;
  formatDescription?: string;
  required?: boolean;
  checkDigit?: boolean;
  validator?: string;
  locationBehavior?: "REQUIRED" | "NOT_USED";
  uniquenessBehavior?: string;
}

export interface PatientidentifiertypeUpdate {
  name: string;
  description?: string;
  format?: string;
  formatDescription?: string;
  required?: boolean;
  checkDigit?: boolean;
  validator?: string;
  locationBehavior?: "REQUIRED" | "NOT_USED";
  uniquenessBehavior?: string;
}

export interface ReportingrestCohortDefinitionGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ReportingrestCohortDefinitionGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ReportingrestCohortDefinitionGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface ReportingrestCohortDefinitionCreate {
  name: string;
  description?: string;
}

export interface ReportingrestCohortDefinitionCreateFull {
  name: string;
  description?: string;
}

export interface ReportingrestCohortDefinitionUpdate {
  name: string;
  description?: string;
}

export interface AttachmentGet {
  links?: { rel?: string; uri?: string }[];
}

export interface AttachmentGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface AttachmentGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface ObsCreate {
  person: string;
  obsDatetime: string;
  concept: string;
  location?: string;
  order?: string;
  encounter?: string;
  accessionNumber?: string;
  groupMembers?: string[];
  valueCodedName?: string;
  comment?: string;
  voided?: boolean;
  value?: string;
  valueModifier?: string;
  formFieldPath?: string;
  formFieldNamespace?: string;
  status?: "PRELIMINARY" | "FINAL" | "AMENDED";
  interpretation?:
    | "NORMAL"
    | "ABNORMAL"
    | "CRITICALLY_ABNORMAL"
    | "NEGATIVE"
    | "POSITIVE"
    | "CRITICALLY_LOW"
    | "LOW"
    | "HIGH"
    | "CRITICALLY_HIGH"
    | "VERY_SUSCEPTIBLE"
    | "SUSCEPTIBLE"
    | "INTERMEDIATE"
    | "RESISTANT"
    | "SIGNIFICANT_CHANGE_DOWN"
    | "SIGNIFICANT_CHANGE_UP"
    | "OFF_SCALE_LOW"
    | "OFF_SCALE_HIGH";
}

export interface ObsCreateFull {
  person: string;
  obsDatetime: string;
  concept: string;
  location?: string;
  order?: string;
  encounter?: string;
  accessionNumber?: string;
  groupMembers?: string[];
  valueCodedName?: string;
  comment?: string;
  voided?: boolean;
  value?: string;
  valueModifier?: string;
  formFieldPath?: string;
  formFieldNamespace?: string;
  status?: "PRELIMINARY" | "FINAL" | "AMENDED";
  interpretation?:
    | "NORMAL"
    | "ABNORMAL"
    | "CRITICALLY_ABNORMAL"
    | "NEGATIVE"
    | "POSITIVE"
    | "CRITICALLY_LOW"
    | "LOW"
    | "HIGH"
    | "CRITICALLY_HIGH"
    | "VERY_SUSCEPTIBLE"
    | "SUSCEPTIBLE"
    | "INTERMEDIATE"
    | "RESISTANT"
    | "SIGNIFICANT_CHANGE_DOWN"
    | "SIGNIFICANT_CHANGE_UP"
    | "OFF_SCALE_LOW"
    | "OFF_SCALE_HIGH";
}

export interface ObsGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  obsDatetime?: string;
  accessionNumber?: string;
  comment?: string;
  voided?: boolean;
  value?: string;
  valueModifier?: string;
  concept?: ConceptGetRef;
  person?: PersonGetRef;
  obsGroup?: ObsGetRef;
  groupMembers?: ObsGetRef[];
  valueCodedName?: ConceptNameGetRef;
  location?: LocationGetRef;
  order?: OrderGetRef;
  encounter?: EncounterGetRef;
  formFieldPath?: string;
  formFieldNamespace?: string;
  status?: "PRELIMINARY" | "FINAL" | "AMENDED";
  interpretation?:
    | "NORMAL"
    | "ABNORMAL"
    | "CRITICALLY_ABNORMAL"
    | "NEGATIVE"
    | "POSITIVE"
    | "CRITICALLY_LOW"
    | "LOW"
    | "HIGH"
    | "CRITICALLY_HIGH"
    | "VERY_SUSCEPTIBLE"
    | "SUSCEPTIBLE"
    | "INTERMEDIATE"
    | "RESISTANT"
    | "SIGNIFICANT_CHANGE_DOWN"
    | "SIGNIFICANT_CHANGE_UP"
    | "OFF_SCALE_LOW"
    | "OFF_SCALE_HIGH";
}

export interface ObsGetRef {
  links?: { rel?: string; uri?: string }[];
  formFieldPath?: string;
  formFieldNamespace?: string;
  status?: "PRELIMINARY" | "FINAL" | "AMENDED";
  interpretation?:
    | "NORMAL"
    | "ABNORMAL"
    | "CRITICALLY_ABNORMAL"
    | "NEGATIVE"
    | "POSITIVE"
    | "CRITICALLY_LOW"
    | "LOW"
    | "HIGH"
    | "CRITICALLY_HIGH"
    | "VERY_SUSCEPTIBLE"
    | "SUSCEPTIBLE"
    | "INTERMEDIATE"
    | "RESISTANT"
    | "SIGNIFICANT_CHANGE_DOWN"
    | "SIGNIFICANT_CHANGE_UP"
    | "OFF_SCALE_LOW"
    | "OFF_SCALE_HIGH";
}

export interface ObsGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  obsDatetime?: string;
  accessionNumber?: string;
  comment?: string;
  voided?: boolean;
  value?: string;
  valueModifier?: string;
  concept?: ConceptGet;
  person?: PersonGet;
  obsGroup?: ObsGet;
  groupMembers?: ObsGet[];
  valueCodedName?: ConceptNameGet;
  location?: LocationGet;
  order?: OrderGet;
  encounter?: EncounterGet;
  formFieldPath?: string;
  formFieldNamespace?: string;
  status?: "PRELIMINARY" | "FINAL" | "AMENDED";
  interpretation?:
    | "NORMAL"
    | "ABNORMAL"
    | "CRITICALLY_ABNORMAL"
    | "NEGATIVE"
    | "POSITIVE"
    | "CRITICALLY_LOW"
    | "LOW"
    | "HIGH"
    | "CRITICALLY_HIGH"
    | "VERY_SUSCEPTIBLE"
    | "SUSCEPTIBLE"
    | "INTERMEDIATE"
    | "RESISTANT"
    | "SIGNIFICANT_CHANGE_DOWN"
    | "SIGNIFICANT_CHANGE_UP"
    | "OFF_SCALE_LOW"
    | "OFF_SCALE_HIGH";
}

export type ObsUpdate = any;

export interface ConceptattributetypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeClassname?: string;
  preferredHandlerClassname?: string;
}

export interface ConceptattributetypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ConceptattributetypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeClassname?: string;
  preferredHandlerClassname?: string;
  datatypeConfig?: string;
  handlerConfig?: string;
}

export interface ConceptattributetypeCreate {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface ConceptattributetypeCreateFull {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface ConceptattributetypeUpdate {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface ProgramattributetypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeClassname?: string;
  preferredHandlerClassname?: string;
}

export interface ProgramattributetypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ProgramattributetypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeClassname?: string;
  preferredHandlerClassname?: string;
  datatypeConfig?: string;
  handlerConfig?: string;
}

export interface ProgramattributetypeCreate {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface ProgramattributetypeCreateFull {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface ProgramattributetypeUpdate {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface CustomdatatypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  datatypeClassname?: string;
  handlers?: CustomdatatypeHandlersGetRef[];
}

export interface CustomdatatypeGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface CustomdatatypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  datatypeClassname?: string;
  handlers?: CustomdatatypeHandlersGet[];
}

export interface LocationattributetypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeClassname?: string;
  preferredHandlerClassname?: string;
}

export interface LocationattributetypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface LocationattributetypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeClassname?: string;
  preferredHandlerClassname?: string;
  datatypeConfig?: string;
  handlerConfig?: string;
}

export interface LocationattributetypeCreate {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface LocationattributetypeCreateFull {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface LocationattributetypeUpdate {
  name: string;
  description?: string;
  datatypeClassname: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface PrivilegeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface PrivilegeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface PrivilegeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface PrivilegeCreate {
  name?: string;
  uuid?: string;
  description?: string;
}

export interface PrivilegeCreateFull {
  name: string;
  description?: string;
}

export interface PrivilegeUpdate {
  description?: string;
}

export interface RelationshipGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  voided?: boolean;
  personA?: PersonGetRef;
  relationshipType?: RelationshiptypeGetRef;
  personB?: PersonGetRef;
}

export interface RelationshipGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface RelationshipGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  voided?: boolean;
  personA?: PersonGet;
  relationshipType?: RelationshiptypeGet;
  personB?: PersonGet;
}

export interface RelationshipCreate {
  personA: string;
  relationshipType: string;
  personB: string;
  startDate?: string;
  endDate?: string;
}

export interface RelationshipCreateFull {
  personA: PersonCreate;
  relationshipType: RelationshiptypeCreate;
  personB: PersonCreate;
  startDate?: string;
  endDate?: string;
}

export interface RelationshipUpdate {
  voided?: boolean;
}

export interface WorkflowCreate {
  name: string;
  description?: string;
}

export interface WorkflowCreateFull {
  name: string;
  description?: string;
}

export interface WorkflowGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  concept?: ConceptGetRef;
  states?: WorkflowStateGetRef[];
}

export interface WorkflowGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  concept?: ConceptGet;
  states?: WorkflowStateGet[];
}

export interface WorkflowGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  concept?: ConceptGet;
  states?: WorkflowStateGet[];
}

export interface WorkflowUpdate {
  name: string;
  description?: string;
}

export interface ConceptreferencetermmapCreate {
  termA: ConceptreferencetermCreate;
  termB: ConceptreferencetermCreate;
  conceptMapType: ConceptmaptypeCreate;
}

export interface ConceptreferencetermmapCreateFull {
  termA: ConceptreferencetermCreate;
  termB: ConceptreferencetermCreate;
  conceptMapType: ConceptmaptypeCreate;
}

export interface ConceptreferencetermmapGet {
  links?: { rel?: string; uri?: string }[];
  termA?: ConceptreferencetermGetRef;
  termB?: ConceptreferencetermGetRef;
  conceptMapType?: ConceptmaptypeGetRef;
}

export interface ConceptreferencetermmapGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ConceptreferencetermmapGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  termA?: ConceptreferencetermGet;
  termB?: ConceptreferencetermGet;
  conceptMapType?: ConceptmaptypeGet;
}

export type ConceptreferencetermmapUpdate = any;

export interface SystemsettingGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  property?: string;
  value?: string;
  description?: string;
  display?: string;
}

export interface SystemsettingGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface SystemsettingGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  property?: string;
  value?: string;
  description?: string;
  display?: string;
  datatypeClassname?: string;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
}

export interface SystemsettingCreate {
  property: string;
  description?: string;
  datatypeClassname?: string;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
  value?: string;
}

export interface SystemsettingCreateFull {
  property: string;
  description?: string;
  datatypeClassname?: string;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
  value?: string;
}

export interface SystemsettingUpdate {
  description?: string;
  datatypeClassname?: string;
  datatypeConfig?: string;
  preferredHandlerClassname?: string;
  handlerConfig?: string;
  value?: string;
}

export interface AppointmentschedulingAppointmenttypeGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface AppointmentschedulingAppointmenttypeGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface AppointmentschedulingAppointmenttypeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
}

export interface AppointmentschedulingAppointmenttypeCreate {
  name: string;
  description?: string;
}

export interface AppointmentschedulingAppointmenttypeCreateFull {
  name: string;
  description?: string;
}

export interface AppointmentschedulingAppointmenttypeUpdate {
  name: string;
  description?: string;
}

export interface ExtensionGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  appId?: string;
  extensionPointId?: string;
  type?: string;
  label?: string;
  url?: string;
  icon?: string;
  order?: number;
  requiredPrivilege?: string;
  featureToggle?: string;
  require?: string;
  script?: string;
  extensionParams?: Record<string, string>;
  belongsTo?: AppGetRef;
}

export interface ExtensionGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ExtensionGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface AppGet {
  links?: { rel?: string; uri?: string }[];
}

export interface AppGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface AppGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
}

export interface RoleGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  privileges?: PrivilegeGetRef[];
  inheritedRoles?: RoleGetRef[];
}

export interface RoleGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface RoleGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  description?: string;
  retired?: boolean;
  privileges?: PrivilegeGet[];
  inheritedRoles?: RoleGet[];
  allInheritedRoles?: RoleGet[];
}

export interface RoleCreate {
  name?: string;
  uuid?: string;
  description?: string;
  privileges?: PrivilegeCreate[];
  inheritedRoles?: RoleCreate[];
  display?: string;
}

export interface RoleCreateFull {
  name: string;
  description?: string;
  privileges?: PrivilegeCreate[];
  inheritedRoles?: RoleCreate[];
}

export interface RoleUpdate {
  description?: string;
  privileges?: PrivilegeCreate[];
  inheritedRoles?: RoleCreate[];
}

export interface ConceptGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: ConceptNameGet;
  datatype?: ConceptdatatypeGetRef;
  conceptClass?: ConceptclassGetRef;
  set?: boolean;
  version?: string;
  retired?: boolean;
  names?: ConceptNameGetRef[];
  descriptions?: ConceptDescriptionGetRef[];
  mappings?: ConceptMappingGetRef[];
  answers?: object[];
  setMembers?: object[];
  units?: any;
}

export interface ConceptGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ConceptGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  setMembers?: any;
  answers?: any[];
  mappings?: any[];
  conceptClass?: any;
  datatype?: any;
  descriptions?: any[];
  name?: any;
  names?: any[];
  set?: boolean;
}

export interface ConceptCreate {
  names: ConceptNameCreate[];
  datatype: string;
  set?: boolean;
  version?: string;
  answers?: string[];
  setMembers?: string[];
  hiNormal?: string;
  hiAbsolute?: string;
  hiCritical?: string;
  lowNormal?: string;
  lowAbsolute?: string;
  lowCritical?: string;
  units?: string;
  allowDecimal?: string;
  displayPrecision?: string;
  conceptClass: string;
  descriptions?: any[];
  mappings?: string[];
}

export interface ConceptCreateFull {
  names: ConceptNameCreate[];
  datatype: string;
  set?: boolean;
  version?: string;
  answers?: string[];
  setMembers?: string[];
  hiNormal?: string;
  hiAbsolute?: string;
  hiCritical?: string;
  lowNormal?: string;
  lowAbsolute?: string;
  lowCritical?: string;
  units?: string;
  allowDecimal?: string;
  displayPrecision?: string;
  conceptClass: ConceptclassCreate;
  descriptions?: ConceptDescriptionCreate[];
  mappings?: ConceptMappingCreate[];
}

export interface ConceptUpdate {
  name?: ConceptNameCreate;
  names?: ConceptNameCreate[];
  descriptions?: ConceptDescriptionCreate[];
}

export interface ProgramenrollmentStateCreate {
  state: WorkflowStateCreate;
}

export interface ProgramenrollmentStateCreateFull {
  state: WorkflowStateCreate;
}

export interface ProgramenrollmentStateGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  startDate?: string;
  endDate?: string;
  voided?: boolean;
  state?: WorkflowStateGet;
}

export interface ProgramenrollmentStateGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  startDate?: string;
  endDate?: string;
  voided?: boolean;
  state?: WorkflowStateGetRef;
  patientProgram?: object;
}

export interface ProgramenrollmentStateGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  startDate?: string;
  endDate?: string;
  voided?: boolean;
  state?: WorkflowStateGetRef;
  patientProgram?: object;
}

export interface ProgramenrollmentStateUpdate {
  startDate?: string;
  endDate?: string;
  voided?: boolean;
}

export interface VisitAttributeGet {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  attributeType?: string;
  value?: string;
  voided?: boolean;
}

export interface VisitAttributeGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface VisitAttributeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  attributeType?: string;
  value?: string;
  voided?: boolean;
}

export interface VisitAttributeCreate {
  attributeType: string;
  value: string;
}

export interface VisitAttributeCreateFull {
  attributeType: string;
  value: string;
}

export interface VisitAttributeUpdate {
  attributeType: string;
  value: string;
}

export interface FormResourceGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  valueReference?: string;
}

export interface FormResourceGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface FormResourceGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  valueReference?: string;
  dataType?: string;
  handler?: string;
  handlerConfig?: string;
}

export interface FormResourceCreate {
  form?: string;
  name?: string;
  dataType?: string;
  handler?: string;
  handlerConfig?: string;
  value?: string;
  valueReference?: string;
}

export interface FormResourceCreateFull {
  form?: FormCreate;
  name?: string;
  dataType?: string;
  handler?: string;
  handlerConfig?: string;
  value?: string;
  valueReference?: string;
}

export interface FormResourceUpdate {
  form?: string;
  name?: string;
  dataType?: string;
  handler?: string;
  handlerConfig?: string;
  value?: string;
  valueReference?: string;
}

export interface PersonAttributeGet {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  value?: string;
  attributeType?: PersonattributetypeGetRef;
  voided?: boolean;
}

export interface PersonAttributeGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface PersonAttributeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  value?: string;
  attributeType?: PersonattributetypeGetRef;
  voided?: boolean;
  hydratedObject?: string;
}

export interface PersonAttributeCreate {
  attributeType: string;
  value?: string;
  hydratedObject?: string;
}

export interface PersonAttributeCreateFull {
  attributeType: PersonattributetypeCreate;
  value?: string;
  hydratedObject?: string;
}

export interface PersonAttributeUpdate {
  attributeType: string;
  value?: string;
  hydratedObject?: string;
}

export interface FieldAnswerGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  concept?: ConceptGetRef;
  field?: FieldGetRef;
}

export interface FieldAnswerGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface FieldAnswerGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  concept?: ConceptGet;
  field?: FieldGet;
}

export interface FieldAnswerCreate {
  concept: string;
  field: string;
}

export interface FieldAnswerCreateFull {
  concept: ConceptCreate;
  field: FieldCreate;
}

export interface FieldAnswerUpdate {
  concept: string;
  field: string;
}

export interface ProviderAttributeGet {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  attributeType?: string;
  value?: string;
  voided?: boolean;
}

export interface ProviderAttributeGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ProviderAttributeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  attributeType?: string;
  value?: string;
  voided?: boolean;
}

export interface ProviderAttributeCreate {
  attributeType: string;
  value: string;
}

export interface ProviderAttributeCreateFull {
  attributeType: string;
  value: string;
}

export interface ProviderAttributeUpdate {
  attributeType: string;
  value: string;
}

export interface ConceptDescriptionGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  description?: string;
  locale?: string;
}

export interface ConceptDescriptionGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ConceptDescriptionGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  description?: string;
  locale?: string;
}

export interface ConceptDescriptionCreate {
  description: string;
  locale: string;
}

export interface ConceptDescriptionCreateFull {
  description: string;
  locale: string;
}

export interface ConceptDescriptionUpdate {
  description: string;
  locale: string;
}

export interface EncounterEncounterproviderGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  provider?: ProviderGetRef;
  encounterRole?: EncounterroleGetRef;
  voided?: boolean;
}

export interface EncounterEncounterproviderGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface EncounterEncounterproviderGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  provider?: ProviderGet;
  encounterRole?: EncounterroleGet;
  voided?: boolean;
}

export interface EncounterEncounterproviderCreate {
  provider?: string;
  encounterRole?: string;
  encounter?: string;
}

export interface EncounterEncounterproviderCreateFull {
  provider?: ProviderCreate;
  encounterRole?: EncounterroleCreate;
  encounter?: EncounterCreate;
}

export interface EncounterEncounterproviderUpdate {
  encounterRole?: string;
  voided?: boolean;
  voidReason?: string;
}

export interface OrdersetOrdersetmemberGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  retired?: boolean;
  orderTemplate?: string;
  orderTemplateType?: string;
  orderType?: OrdertypeGetRef;
  concept?: ConceptGetRef;
}

export interface OrdersetOrdersetmemberGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface OrdersetOrdersetmemberGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  retired?: boolean;
  orderTemplate?: string;
  orderTemplateType?: string;
  orderType?: OrdertypeGet;
  concept?: ConceptGet;
}

export interface OrdersetOrdersetmemberCreate {
  orderType?: { uuid?: string };
  orderTemplate?: string;
  concept?: string;
  retired?: boolean;
}

export interface OrdersetOrdersetmemberCreateFull {
  orderType?: { uuid?: string };
  orderTemplate?: string;
  concept?: string;
  retired?: boolean;
}

export interface OrdersetOrdersetmemberUpdate {
  orderType?: { uuid?: string };
  orderTemplate?: string;
  concept?: string;
  retired?: boolean;
}

export interface ProgramenrollmentAttributeGet {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  attributeType?: string;
  value?: string;
  voided?: boolean;
}

export interface ProgramenrollmentAttributeGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ProgramenrollmentAttributeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  attributeType?: string;
  value?: string;
  voided?: boolean;
}

export interface ProgramenrollmentAttributeCreate {
  attributeType: string;
  value: string;
}

export interface ProgramenrollmentAttributeCreateFull {
  attributeType: string;
  value: string;
}

export interface ProgramenrollmentAttributeUpdate {
  attributeType: string;
  value: string;
}

export interface ConceptAttributeGet {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  attributeType?: string;
  value?: string;
  voided?: boolean;
}

export interface ConceptAttributeGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ConceptAttributeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  attributeType?: string;
  value?: string;
  voided?: boolean;
}

export interface ConceptAttributeCreate {
  attributeType: string;
  value: string;
}

export interface ConceptAttributeCreateFull {
  attributeType: string;
  value: string;
}

export interface ConceptAttributeUpdate {
  attributeType: string;
  value: string;
}

export interface LocationAttributeGet {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  attributeType?: string;
  value?: string;
  voided?: boolean;
}

export interface LocationAttributeGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface LocationAttributeGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  attributeType?: string;
  value?: string;
  voided?: boolean;
}

export interface LocationAttributeCreate {
  attributeType: string;
  value: string;
}

export interface LocationAttributeCreateFull {
  attributeType: string;
  value: string;
}

export interface LocationAttributeUpdate {
  attributeType: string;
  value: string;
}

export interface WorkflowStateGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  description?: string;
  retired?: boolean;
  concept?: ConceptGetRef;
}

export interface WorkflowStateGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  retired?: boolean;
  concept?: ConceptGetRef;
}

export interface WorkflowStateGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  description?: string;
  retired?: boolean;
  concept?: ConceptGet;
}

export type WorkflowStateCreate = any;

export type WorkflowStateCreateFull = any;

export interface PersonAddressGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  preferred?: boolean;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  startDate?: string;
  endDate?: string;
  latitude?: string;
  longitude?: string;
  voided?: boolean;
}

export interface PersonAddressGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface PersonAddressGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  preferred?: boolean;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  startDate?: string;
  endDate?: string;
  latitude?: string;
  longitude?: string;
  voided?: boolean;
}

export interface PersonAddressCreate {
  preferred?: boolean;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  startDate?: string;
  endDate?: string;
  latitude?: string;
  longitude?: string;
}

export interface PersonAddressCreateFull {
  preferred?: boolean;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  startDate?: string;
  endDate?: string;
  latitude?: string;
  longitude?: string;
}

export interface PersonAddressUpdate {
  preferred?: boolean;
  address1?: string;
  address2?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  startDate?: string;
  endDate?: string;
  latitude?: string;
  longitude?: string;
}

export interface CustomdatatypeHandlersGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  handlerClassname?: string;
  display?: string;
}

export interface CustomdatatypeHandlersGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface CustomdatatypeHandlersGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  handlerClassname?: string;
  display?: string;
}

export interface ConceptNameGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  locale?: string;
  localePreferred?: boolean;
  conceptNameType?: "FULLY_SPECIFIED" | "SHORT" | "INDEX_TERM";
}

export interface ConceptNameGetRef {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
}

export interface ConceptNameGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  name?: string;
  locale?: string;
  localePreferred?: boolean;
  conceptNameType?: "FULLY_SPECIFIED" | "SHORT" | "INDEX_TERM";
}

export interface ConceptNameCreate {
  name: string;
  locale: string;
  localePreferred?: boolean;
  conceptNameType?: "FULLY_SPECIFIED" | "SHORT" | "INDEX_TERM";
}

export interface ConceptNameCreateFull {
  name: string;
  locale: string;
  localePreferred?: boolean;
  conceptNameType?: "FULLY_SPECIFIED" | "SHORT" | "INDEX_TERM";
}

export interface ConceptNameUpdate {
  name?: string;
}

export interface ConceptMappingGet {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  conceptReferenceTerm?: ConceptreferencetermGetRef;
  conceptMapType?: ConceptmaptypeGetRef;
}

export interface ConceptMappingGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface ConceptMappingGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  conceptReferenceTerm?: ConceptreferencetermGet;
  conceptMapType?: ConceptmaptypeGet;
}

export interface ConceptMappingCreate {
  conceptReferenceTerm: ConceptreferencetermCreate;
  conceptMapType: ConceptmaptypeCreate;
}

export interface ConceptMappingCreateFull {
  conceptReferenceTerm: ConceptreferencetermCreate;
  conceptMapType: ConceptmaptypeCreate;
}

export interface ConceptMappingUpdate {
  conceptReferenceTerm: ConceptreferencetermCreate;
  conceptMapType: ConceptmaptypeCreate;
}

export interface PatientIdentifierGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  identifier?: string;
  preferred?: boolean;
  voided?: boolean;
  identifierType?: PatientidentifiertypeGetRef;
  location?: LocationGetRef;
}

export interface PatientIdentifierGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface PatientIdentifierGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  identifier?: string;
  preferred?: boolean;
  voided?: boolean;
  identifierType?: PatientidentifiertypeGet;
  location?: LocationGet;
}

export interface PatientIdentifierCreate {
  identifier: string;
  identifierType: string;
  location?: string;
  preferred?: boolean;
}

export interface PatientIdentifierCreateFull {
  identifier: string;
  identifierType: PatientidentifiertypeCreate;
  location?: LocationCreate;
  preferred?: boolean;
}

export interface PatientIdentifierUpdate {
  identifier: string;
  identifierType: string;
  location?: string;
  preferred?: boolean;
}

export interface FormFormfieldGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  fieldNumber?: number;
  fieldPart?: string;
  pageNumber?: number;
  minOccurs?: number;
  maxOccurs?: number;
  required?: boolean;
  sortWeight?: number;
  retired?: boolean;
  parent?: FormFormfieldGetRef;
  form?: FormGetRef;
  field?: FieldGetRef;
}

export interface FormFormfieldGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface FormFormfieldGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  fieldNumber?: number;
  fieldPart?: string;
  pageNumber?: number;
  minOccurs?: number;
  maxOccurs?: number;
  required?: boolean;
  sortWeight?: number;
  retired?: boolean;
  parent?: FormFormfieldGet;
  form?: FormGet;
  field?: FieldGet;
}

export interface FormFormfieldCreate {
  form: string;
  field: string;
  required: boolean;
  parent?: string;
  fieldNumber?: number;
  fieldPart?: string;
  pageNumber?: number;
  minOccurs?: number;
  maxOccurs?: number;
  sortWeight?: boolean;
}

export interface FormFormfieldCreateFull {
  form: FormCreate;
  field: FieldCreate;
  required: boolean;
  parent?: FormFormfieldCreate;
  fieldNumber?: number;
  fieldPart?: string;
  pageNumber?: number;
  minOccurs?: number;
  maxOccurs?: number;
  sortWeight?: boolean;
}

export type FormFormfieldUpdate = any;

export interface PatientAllergyCreate {
  allergen: object;
  severity?: { uuid?: string };
  comment?: string;
  reactions?: { allergy?: { uuid?: string }; reaction?: { uuid?: string } }[];
}

export interface PatientAllergyCreateFull {
  allergen: object;
  severity?: { uuid?: string };
  comment?: string;
  reactions?: { allergy?: { uuid?: string }; reaction?: { uuid?: string } }[];
}

export interface PatientAllergyGet {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  allergen?: object;
  severity?: ConceptGetRef;
  comment?: string;
  reactions?: ConceptGetRef[];
  patient?: PatientGetRef;
}

export interface PatientAllergyGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface PatientAllergyGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  allergen?: object;
  severity?: ConceptGet;
  comment?: string;
  reactions?: ConceptGet[];
  patient?: PatientGet;
}

export interface PatientAllergyUpdate {
  allergen: object;
  severity?: { uuid?: string };
  comment?: string;
  reactions?: { allergy?: { uuid?: string }; reaction?: { uuid?: string } }[];
}

export interface CohortMembershipGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  startDate?: string;
  endDate?: string;
  patientUuid?: string;
}

export interface CohortMembershipGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface CohortMembershipGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  startDate?: string;
  endDate?: string;
  patientUuid?: string;
}

export interface CohortMembershipCreate {
  patientUuid?: string;
  startDate?: string;
  endDate?: string;
}

export interface CohortMembershipCreateFull {
  patientUuid?: string;
  startDate?: string;
  endDate?: string;
}

export interface CohortMembershipUpdate {
  startDate?: string;
  endDate?: string;
}

export interface PersonNameGet {
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  givenName?: string;
  middleName?: string;
  familyName?: string;
  familyName2?: string;
  voided?: boolean;
}

export interface PersonNameGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface PersonNameGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  display?: string;
  uuid?: string;
  givenName?: string;
  middleName?: string;
  familyName?: string;
  familyName2?: string;
  voided?: boolean;
  preferred?: boolean;
  prefix?: string;
  familyNamePrefix?: string;
  familyNameSuffix?: string;
  degree?: string;
}

export interface PersonNameCreate {
  givenName: string;
  middleName?: string;
  familyName?: string;
  familyName2?: string;
  preferred?: boolean;
  prefix?: string;
  familyNamePrefix?: string;
  familyNameSuffix?: string;
  degree?: string;
}

export interface PersonNameCreateFull {
  givenName: string;
  middleName?: string;
  familyName?: string;
  familyName2?: string;
  preferred?: boolean;
  prefix?: string;
  familyNamePrefix?: string;
  familyNameSuffix?: string;
  degree?: string;
}

export interface PersonNameUpdate {
  givenName: string;
  middleName?: string;
  familyName?: string;
  familyName2?: string;
  preferred?: boolean;
  prefix?: string;
  familyNamePrefix?: string;
  familyNameSuffix?: string;
  degree?: string;
}

export interface DrugIngredientGet {
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  strength?: number;
  ingredient?: ConceptGetRef;
  units?: ConceptGetRef;
}

export interface DrugIngredientGetRef {
  links?: { rel?: string; uri?: string }[];
}

export interface DrugIngredientGetFull {
  auditInfo?: string;
  links?: { rel?: string; uri?: string }[];
  uuid?: string;
  display?: string;
  strength?: number;
  ingredient?: ConceptGet;
  units?: ConceptGet;
}

export interface DrugIngredientCreate {
  ingredient: string;
  strength?: number;
  units?: string;
}

export interface DrugIngredientCreateFull {
  ingredient: string;
  strength?: number;
  units?: string;
}

export interface DrugIngredientUpdate {
  ingredient: string;
  strength?: number;
  units?: string;
}

export interface OrderFulfillerdetailsCreate {
  fulfillerComment?: string;
  fulfillerStatus?: "RECEIVED" | "IN_PROGRESS" | "EXCEPTION" | "COMPLETED";
}

export interface OrderFulfillerdetailsCreateFull {
  fulfillerComment?: string;
  fulfillerStatus?: "RECEIVED" | "IN_PROGRESS" | "EXCEPTION" | "COMPLETED";
}

export interface FetchAll {
  results?: {
    display?: string;
    links?: { rel?: string; uri?: string }[];
    uuid?: string;
  }[];
}

export type RequestParams = Omit<RequestInit, "body" | "method"> & {
  secure?: boolean;
};

export type RequestQueryParamsType = Record<string | number, any>;

type ApiConfig<SecurityDataType> = {
  baseUrl?: string;
  baseApiParams?: RequestParams;
  securityWorker?: (securityData: SecurityDataType) => RequestParams;
};

enum BodyType {
  Json,
}

class HttpClient<SecurityDataType> {
  public baseUrl: string = "../../../openmrs/ws/rest/v1";
  private securityData: SecurityDataType = null as any;
  private securityWorker: ApiConfig<SecurityDataType>["securityWorker"] =
    (() => {}) as any;

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor({
    baseUrl,
    baseApiParams,
    securityWorker,
  }: ApiConfig<SecurityDataType> = {}) {
    this.baseUrl = baseUrl || this.baseUrl;
    this.baseApiParams = baseApiParams || this.baseApiParams;
    this.securityWorker = securityWorker || this.securityWorker;
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: RequestQueryParamsType, key: string) {
    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(
        Array.isArray(query[key]) ? query[key].join(",") : query[key]
      )
    );
  }

  protected addQueryParams(rawQuery?: RequestQueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys.length
      ? `?${keys
          .map((key) =>
            typeof query[key] === "object" && !Array.isArray(query[key])
              ? this.addQueryParams(query[key] as object).substring(1)
              : this.addQueryParam(query, key)
          )
          .join("&")}`
      : "";
  }

  private bodyFormatters: Record<BodyType, (input: any) => any> = {
    [BodyType.Json]: JSON.stringify,
  };

  private mergeRequestOptions(
    params: RequestParams,
    securityParams?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params,
      ...(securityParams || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params.headers || {}),
        ...((securityParams && securityParams.headers) || {}),
      },
    };
  }

  private safeParseResponse = <T = any, E = any>(
    response: Response
  ): Promise<T> =>
    response
      .json()
      .then((data) => data)
      .catch((e) => response.text);

  public request = <T = any, E = any>(
    path: string,
    method: string,
    { secure, ...params }: RequestParams = {},
    body?: any,
    bodyType?: BodyType,
    secureByDefault?: boolean
  ): Promise<T> =>
    fetch(`${this.baseUrl}${path}`, {
      // @ts-ignore
      ...this.mergeRequestOptions(
        params,
        (secureByDefault || secure) && this.securityWorker(this.securityData)
      ),
      method,
      body: body ? this.bodyFormatters[bodyType || BodyType.Json](body) : null,
    }).then(async (response) => {
      const data = await this.safeParseResponse<T, E>(response);
      if (!response.ok) throw data;
      return data;
    });
}

/**
 * @title OpenMRS API Docs
 * @version 2.3.0
 * @baseUrl http://icare:8080/openmrs/ws/rest/v1
 * OpenMRS RESTful API documentation generated by Swagger
 */
@Injectable({
  providedIn: "root",
})
export class Api<SecurityDataType = any> extends HttpClient<SecurityDataType> {
  person = {
    /**
     * @tags person
     * @name getAllPersons
     * @summary Search for person
     * @request GET:/person
     * @description At least one search parameter must be specified
     */
    getAllPersons: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/person${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags person
     * @name createPerson
     * @summary Create with properties in request
     * @request POST:/person
     */
    createPerson: (resource: PersonCreate, params?: RequestParams) =>
      this.request<any, any>(`/person`, "POST", params, resource),

    /**
     * @tags person
     * @name getPerson
     * @summary Fetch by uuid
     * @request GET:/person/{uuid}
     */
    getPerson: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PersonGet, any>(
        `/person/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags person
     * @name updatePerson
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/person/{uuid}
     */
    updatePerson: (
      uuid: string,
      resource: PersonUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/person/${uuid}`, "POST", params, resource),

    /**
     * @tags person
     * @name deletePerson
     * @summary Delete or purge resource by uuid
     * @request DELETE:/person/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePerson: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/person/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags person
     * @name getAllPersonAttributes
     * @summary Fetch all non-retired attribute subresources
     * @request GET:/person/{parentUuid}/attribute
     */
    getAllPersonAttributes: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: PersonAttributeGet[] }, any>(
        `/person/${parentUuid}/attribute${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags person
     * @name createPersonAttribute
     * @summary Create attribute subresource with properties in request
     * @request POST:/person/{parentUuid}/attribute
     */
    createPersonAttribute: (
      parentUuid: string,
      resource: PersonAttributeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/person/${parentUuid}/attribute`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags person
     * @name getPersonAttribute
     * @summary Fetch attribute subresources by uuid
     * @request GET:/person/{parentUuid}/attribute/{uuid}
     */
    getPersonAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PersonAttributeGet, any>(
        `/person/${parentUuid}/attribute/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags person
     * @name updatePersonAttribute
     * @summary edit attribute subresource with given uuid, only modifying properties in request
     * @request POST:/person/{parentUuid}/attribute/{uuid}
     */
    updatePersonAttribute: (
      parentUuid: string,
      uuid: string,
      resource: PersonAttributeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/person/${parentUuid}/attribute/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags person
     * @name deletePersonAttribute
     * @summary Delete or purge resource by uuid
     * @request DELETE:/person/{parentUuid}/attribute/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePersonAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/person/${parentUuid}/attribute/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags person
     * @name getAllPersonAddresses
     * @summary Fetch all non-retired address subresources
     * @request GET:/person/{parentUuid}/address
     */
    getAllPersonAddresses: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: PersonAddressGet[] }, any>(
        `/person/${parentUuid}/address${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags person
     * @name createPersonAddress
     * @summary Create address subresource with properties in request
     * @request POST:/person/{parentUuid}/address
     */
    createPersonAddress: (
      parentUuid: string,
      resource: PersonAddressCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/person/${parentUuid}/address`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags person
     * @name getPersonAddress
     * @summary Fetch address subresources by uuid
     * @request GET:/person/{parentUuid}/address/{uuid}
     */
    getPersonAddress: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PersonAddressGet, any>(
        `/person/${parentUuid}/address/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags person
     * @name updatePersonAddress
     * @summary edit address subresource with given uuid, only modifying properties in request
     * @request POST:/person/{parentUuid}/address/{uuid}
     */
    updatePersonAddress: (
      parentUuid: string,
      uuid: string,
      resource: PersonAddressUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/person/${parentUuid}/address/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags person
     * @name deletePersonAddress
     * @summary Delete or purge resource by uuid
     * @request DELETE:/person/{parentUuid}/address/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePersonAddress: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/person/${parentUuid}/address/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags person
     * @name getAllPersonNames
     * @summary Fetch all non-retired name subresources
     * @request GET:/person/{parentUuid}/name
     */
    getAllPersonNames: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: PersonNameGet[] }, any>(
        `/person/${parentUuid}/name${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags person
     * @name createPersonName
     * @summary Create name subresource with properties in request
     * @request POST:/person/{parentUuid}/name
     */
    createPersonName: (
      parentUuid: string,
      resource: PersonNameCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/person/${parentUuid}/name`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags person
     * @name getPersonName
     * @summary Fetch name subresources by uuid
     * @request GET:/person/{parentUuid}/name/{uuid}
     */
    getPersonName: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PersonNameGet, any>(
        `/person/${parentUuid}/name/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags person
     * @name updatePersonName
     * @summary edit name subresource with given uuid, only modifying properties in request
     * @request POST:/person/{parentUuid}/name/{uuid}
     */
    updatePersonName: (
      parentUuid: string,
      uuid: string,
      resource: PersonNameUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/person/${parentUuid}/name/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags person
     * @name deletePersonName
     * @summary Delete or purge resource by uuid
     * @request DELETE:/person/{parentUuid}/name/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePersonName: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/person/${parentUuid}/name/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  personattributetype = {
    /**
     * @tags personattributetype
     * @name getAllPersonAttributeTypes
     * @summary Fetch all non-retired personattributetype resources or perform search
     * @request GET:/personattributetype
     * @description All search parameters are optional
     */
    getAllPersonAttributeTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/personattributetype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags personattributetype
     * @name createPersonAttributeType
     * @summary Create with properties in request
     * @request POST:/personattributetype
     */
    createPersonAttributeType: (
      resource: PersonattributetypeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/personattributetype`, "POST", params, resource),

    /**
     * @tags personattributetype
     * @name getPersonAttributeType
     * @summary Fetch by uuid
     * @request GET:/personattributetype/{uuid}
     */
    getPersonAttributeType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PersonattributetypeGet, any>(
        `/personattributetype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags personattributetype
     * @name updatePersonAttributeType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/personattributetype/{uuid}
     */
    updatePersonAttributeType: (
      uuid: string,
      resource: PersonattributetypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/personattributetype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags personattributetype
     * @name deletePersonAttributeType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/personattributetype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePersonAttributeType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/personattributetype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  ordergroup = {
    /**
     * @tags ordergroup
     * @name getAllOrderGroups
     * @summary Search for ordergroup
     * @request GET:/ordergroup
     * @description At least one search parameter must be specified
     */
    getAllOrderGroups: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/ordergroup${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags ordergroup
     * @name createOrderGroup
     * @summary Create with properties in request
     * @request POST:/ordergroup
     */
    createOrderGroup: (resource: OrdergroupCreate, params?: RequestParams) =>
      this.request<any, any>(`/ordergroup`, "POST", params, resource),

    /**
     * @tags ordergroup
     * @name getOrderGroup
     * @summary Fetch by uuid
     * @request GET:/ordergroup/{uuid}
     */
    getOrderGroup: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<OrdergroupGet, any>(
        `/ordergroup/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags ordergroup
     * @name updateOrderGroup
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/ordergroup/{uuid}
     */
    updateOrderGroup: (
      uuid: string,
      resource: OrdergroupUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/ordergroup/${uuid}`, "POST", params, resource),

    /**
     * @tags ordergroup
     * @name deleteOrderGroup
     * @summary Delete or purge resource by uuid
     * @request DELETE:/ordergroup/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteOrderGroup: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/ordergroup/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  provider = {
    /**
     * @tags provider
     * @name getAllProviders
     * @summary Fetch all non-retired provider resources or perform search
     * @request GET:/provider
     * @description All search parameters are optional
     */
    getAllProviders: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        user?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/provider${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags provider
     * @name createProvider
     * @summary Create with properties in request
     * @request POST:/provider
     */
    createProvider: (resource: ProviderCreate, params?: RequestParams) =>
      this.request<any, any>(`/provider`, "POST", params, resource),

    /**
     * @tags provider
     * @name getProvider
     * @summary Fetch by uuid
     * @request GET:/provider/{uuid}
     */
    getProvider: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ProviderGet, any>(
        `/provider/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags provider
     * @name updateProvider
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/provider/{uuid}
     */
    updateProvider: (
      uuid: string,
      resource: ProviderUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/provider/${uuid}`, "POST", params, resource),

    /**
     * @tags provider
     * @name deleteProvider
     * @summary Delete or purge resource by uuid
     * @request DELETE:/provider/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteProvider: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/provider/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags provider
     * @name getAllProviderAttributes
     * @summary Fetch all non-retired attribute subresources
     * @request GET:/provider/{parentUuid}/attribute
     */
    getAllProviderAttributes: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: ProviderAttributeGet[] }, any>(
        `/provider/${parentUuid}/attribute${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags provider
     * @name createProviderAttribute
     * @summary Create attribute subresource with properties in request
     * @request POST:/provider/{parentUuid}/attribute
     */
    createProviderAttribute: (
      parentUuid: string,
      resource: ProviderAttributeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/provider/${parentUuid}/attribute`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags provider
     * @name getProviderAttribute
     * @summary Fetch attribute subresources by uuid
     * @request GET:/provider/{parentUuid}/attribute/{uuid}
     */
    getProviderAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ProviderAttributeGet, any>(
        `/provider/${parentUuid}/attribute/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags provider
     * @name updateProviderAttribute
     * @summary edit attribute subresource with given uuid, only modifying properties in request
     * @request POST:/provider/{parentUuid}/attribute/{uuid}
     */
    updateProviderAttribute: (
      parentUuid: string,
      uuid: string,
      resource: ProviderAttributeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/provider/${parentUuid}/attribute/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags provider
     * @name deleteProviderAttribute
     * @summary Delete or purge resource by uuid
     * @request DELETE:/provider/{parentUuid}/attribute/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteProviderAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/provider/${parentUuid}/attribute/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),
  };
  condition = {
    /**
     * @tags condition
     * @name getAllConditions
     * @summary Search for condition
     * @request GET:/condition
     * @description At least one search parameter must be specified
     */
    getAllConditions: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/condition${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags condition
     * @name createCondition
     * @summary Create with properties in request
     * @request POST:/condition
     */
    createCondition: (resource: ConditionCreate, params?: RequestParams) =>
      this.request<any, any>(`/condition`, "POST", params, resource),

    /**
     * @tags condition
     * @name getCondition
     * @summary Fetch by uuid
     * @request GET:/condition/{uuid}
     */
    getCondition: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConditionGet, any>(
        `/condition/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags condition
     * @name updateCondition
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/condition/{uuid}
     */
    updateCondition: (
      uuid: string,
      resource: ConditionUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/condition/${uuid}`, "POST", params, resource),

    /**
     * @tags condition
     * @name deleteCondition
     * @summary Delete or purge resource by uuid
     * @request DELETE:/condition/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteCondition: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/condition/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  hl7Source = {
    /**
     * @tags hl7source
     * @name getAllHL7Sources
     * @summary Search for hl7source
     * @request GET:/hl7source
     * @description At least one search parameter must be specified
     */
    getAllHl7Sources: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/hl7source${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags hl7source
     * @name createHL7Source
     * @summary Create with properties in request
     * @request POST:/hl7source
     */
    createHl7Source: (resource: Hl7SourceCreate, params?: RequestParams) =>
      this.request<any, any>(`/hl7source`, "POST", params, resource),

    /**
     * @tags hl7source
     * @name getHL7Source
     * @summary Fetch by uuid
     * @request GET:/hl7source/{uuid}
     */
    getHl7Source: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<Hl7SourceGet, any>(
        `/hl7source/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags hl7source
     * @name updateHL7Source
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/hl7source/{uuid}
     */
    updateHl7Source: (
      uuid: string,
      resource: Hl7SourceUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/hl7source/${uuid}`, "POST", params, resource),

    /**
     * @tags hl7source
     * @name deleteHL7Source
     * @summary Delete or purge resource by uuid
     * @request DELETE:/hl7source/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteHl7Source: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/hl7source/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  appointmentscheduling = {
    /**
     * @tags appointmentscheduling/appointmentblock
     * @name getAllAppointmentBlocks
     * @summary Fetch all non-retired appointmentscheduling/appointmentblock resources or perform search
     * @request GET:/appointmentscheduling/appointmentblock
     * @description All search parameters are optional
     */
    getAllAppointmentBlocks: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/appointmentscheduling/appointmentblock${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmentblock
     * @name createAppointmentBlock
     * @summary Create with properties in request
     * @request POST:/appointmentscheduling/appointmentblock
     */
    createAppointmentBlock: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmentblock`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/appointmentblock
     * @name getAppointmentBlock
     * @summary Fetch by uuid
     * @request GET:/appointmentscheduling/appointmentblock/{uuid}
     */
    getAppointmentBlock: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<AppointmentschedulingAppointmentblockGet, any>(
        `/appointmentscheduling/appointmentblock/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmentblock
     * @name updateAppointmentBlock
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/appointmentscheduling/appointmentblock/{uuid}
     */
    updateAppointmentBlock: (
      uuid: string,
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmentblock/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/appointmentblock
     * @name deleteAppointmentBlock
     * @summary Delete or purge resource by uuid
     * @request DELETE:/appointmentscheduling/appointmentblock/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteAppointmentBlock: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmentblock/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),

    /**
     * @tags appointmentscheduling/timeslot
     * @name getAllTimeSlots
     * @summary Fetch all non-retired appointmentscheduling/timeslot resources or perform search
     * @request GET:/appointmentscheduling/timeslot
     * @description All search parameters are optional
     */
    getAllTimeSlots: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/appointmentscheduling/timeslot${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/timeslot
     * @name createTimeSlot
     * @summary Create with properties in request
     * @request POST:/appointmentscheduling/timeslot
     */
    createTimeSlot: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/timeslot`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/timeslot
     * @name getTimeSlot
     * @summary Fetch by uuid
     * @request GET:/appointmentscheduling/timeslot/{uuid}
     */
    getTimeSlot: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<AppointmentschedulingTimeslotGet, any>(
        `/appointmentscheduling/timeslot/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/timeslot
     * @name updateTimeSlot
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/appointmentscheduling/timeslot/{uuid}
     */
    updateTimeSlot: (
      uuid: string,
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/timeslot/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/timeslot
     * @name deleteTimeSlot
     * @summary Delete or purge resource by uuid
     * @request DELETE:/appointmentscheduling/timeslot/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteTimeSlot: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/timeslot/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmentstatushistory
     * @name getAllAppointmentStatusHistories
     * @summary Fetch all non-retired appointmentscheduling/appointmentstatushistory resources or perform search
     * @request GET:/appointmentscheduling/appointmentstatushistory
     * @description All search parameters are optional
     */
    getAllAppointmentStatusHistories: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/appointmentscheduling/appointmentstatushistory${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmentstatushistory
     * @name createAppointmentStatusHistory
     * @summary Create with properties in request
     * @request POST:/appointmentscheduling/appointmentstatushistory
     */
    createAppointmentStatusHistory: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmentstatushistory`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/appointmentstatushistory
     * @name getAppointmentStatusHistory
     * @summary Fetch by uuid
     * @request GET:/appointmentscheduling/appointmentstatushistory/{uuid}
     */
    getAppointmentStatusHistory: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<AppointmentschedulingAppointmentstatushistoryGet, any>(
        `/appointmentscheduling/appointmentstatushistory/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmentstatushistory
     * @name deleteAppointmentStatusHistory
     * @summary Delete or purge resource by uuid
     * @request DELETE:/appointmentscheduling/appointmentstatushistory/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteAppointmentStatusHistory: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmentstatushistory/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmentrequest
     * @name getAllAppointmentRequests
     * @summary Fetch all non-retired appointmentscheduling/appointmentrequest resources or perform search
     * @request GET:/appointmentscheduling/appointmentrequest
     * @description All search parameters are optional
     */
    getAllAppointmentRequests: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/appointmentscheduling/appointmentrequest${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmentrequest
     * @name createAppointmentRequest
     * @summary Create with properties in request
     * @request POST:/appointmentscheduling/appointmentrequest
     */
    createAppointmentRequest: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmentrequest`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/appointmentrequest
     * @name getAppointmentRequest
     * @summary Fetch by uuid
     * @request GET:/appointmentscheduling/appointmentrequest/{uuid}
     */
    getAppointmentRequest: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<AppointmentschedulingAppointmentrequestGet, any>(
        `/appointmentscheduling/appointmentrequest/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmentrequest
     * @name updateAppointmentRequest
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/appointmentscheduling/appointmentrequest/{uuid}
     */
    updateAppointmentRequest: (
      uuid: string,
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmentrequest/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/appointmentrequest
     * @name deleteAppointmentRequest
     * @summary Delete or purge resource by uuid
     * @request DELETE:/appointmentscheduling/appointmentrequest/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteAppointmentRequest: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmentrequest/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),

    /**
     * @tags appointmentscheduling/providerschedule
     * @name getAllProviderSchedules
     * @summary Fetch all non-retired appointmentscheduling/providerschedule resources or perform search
     * @request GET:/appointmentscheduling/providerschedule
     * @description All search parameters are optional
     */
    getAllProviderSchedules: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/appointmentscheduling/providerschedule${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/providerschedule
     * @name createProviderSchedule
     * @summary Create with properties in request
     * @request POST:/appointmentscheduling/providerschedule
     */
    createProviderSchedule: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/providerschedule`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/providerschedule
     * @name getProviderSchedule
     * @summary Fetch by uuid
     * @request GET:/appointmentscheduling/providerschedule/{uuid}
     */
    getProviderSchedule: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<AppointmentschedulingProviderscheduleGet, any>(
        `/appointmentscheduling/providerschedule/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/providerschedule
     * @name updateProviderSchedule
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/appointmentscheduling/providerschedule/{uuid}
     */
    updateProviderSchedule: (
      uuid: string,
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/providerschedule/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/providerschedule
     * @name deleteProviderSchedule
     * @summary Delete or purge resource by uuid
     * @request DELETE:/appointmentscheduling/providerschedule/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteProviderSchedule: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/providerschedule/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),

    /**
     * @tags appointmentscheduling/appointment
     * @name getAllAppointments
     * @summary Fetch all non-retired appointmentscheduling/appointment resources or perform search
     * @request GET:/appointmentscheduling/appointment
     * @description All search parameters are optional
     */
    getAllAppointments: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        fromDate?: string;
        appointmentType?: string;
        provider?: string;
        statusValue?: string;
        toDate?: string;
        location?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/appointmentscheduling/appointment${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/appointment
     * @name createAppointment
     * @summary Create with properties in request
     * @request POST:/appointmentscheduling/appointment
     */
    createAppointment: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointment`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/appointment
     * @name getAppointment
     * @summary Fetch by uuid
     * @request GET:/appointmentscheduling/appointment/{uuid}
     */
    getAppointment: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<AppointmentschedulingAppointmentGet, any>(
        `/appointmentscheduling/appointment/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/appointment
     * @name updateAppointment
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/appointmentscheduling/appointment/{uuid}
     */
    updateAppointment: (
      uuid: string,
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointment/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/appointment
     * @name deleteAppointment
     * @summary Delete or purge resource by uuid
     * @request DELETE:/appointmentscheduling/appointment/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteAppointment: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointment/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmenttype
     * @name getAllAppointmentTypes
     * @summary Fetch all non-retired appointmentscheduling/appointmenttype resources or perform search
     * @request GET:/appointmentscheduling/appointmenttype
     * @description All search parameters are optional
     */
    getAllAppointmentTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/appointmentscheduling/appointmenttype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmenttype
     * @name createAppointmentType
     * @summary Create with properties in request
     * @request POST:/appointmentscheduling/appointmenttype
     */
    createAppointmentType: (
      resource: AppointmentschedulingAppointmenttypeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmenttype`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/appointmenttype
     * @name getAppointmentType
     * @summary Fetch by uuid
     * @request GET:/appointmentscheduling/appointmenttype/{uuid}
     */
    getAppointmentType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<AppointmentschedulingAppointmenttypeGet, any>(
        `/appointmentscheduling/appointmenttype/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags appointmentscheduling/appointmenttype
     * @name updateAppointmentType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/appointmentscheduling/appointmenttype/{uuid}
     */
    updateAppointmentType: (
      uuid: string,
      resource: AppointmentschedulingAppointmenttypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmenttype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags appointmentscheduling/appointmenttype
     * @name deleteAppointmentType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/appointmentscheduling/appointmenttype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteAppointmentType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/appointmentscheduling/appointmenttype/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),
  };
  visittype = {
    /**
     * @tags visittype
     * @name getAllVisitTypes
     * @summary Fetch all non-retired visittype resources or perform search
     * @request GET:/visittype
     * @description All search parameters are optional
     */
    getAllVisitTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/visittype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags visittype
     * @name createVisitType
     * @summary Create with properties in request
     * @request POST:/visittype
     */
    createVisitType: (resource: VisittypeCreate, params?: RequestParams) =>
      this.request<any, any>(`/visittype`, "POST", params, resource),

    /**
     * @tags visittype
     * @name getVisitType
     * @summary Fetch by uuid
     * @request GET:/visittype/{uuid}
     */
    getVisitType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<VisittypeGet, any>(
        `/visittype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags visittype
     * @name updateVisitType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/visittype/{uuid}
     */
    updateVisitType: (
      uuid: string,
      resource: VisittypeUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/visittype/${uuid}`, "POST", params, resource),

    /**
     * @tags visittype
     * @name deleteVisitType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/visittype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteVisitType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/visittype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  conceptdatatype = {
    /**
     * @tags conceptdatatype
     * @name getAllConceptDatatypes
     * @summary Fetch all non-retired conceptdatatype resources or perform search
     * @request GET:/conceptdatatype
     * @description All search parameters are optional
     */
    getAllConceptDatatypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/conceptdatatype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptdatatype
     * @name getConceptDatatype
     * @summary Fetch by uuid
     * @request GET:/conceptdatatype/{uuid}
     */
    getConceptDatatype: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptdatatypeGet, any>(
        `/conceptdatatype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptdatatype
     * @name deleteConceptDatatype
     * @summary Delete or purge resource by uuid
     * @request DELETE:/conceptdatatype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptDatatype: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptdatatype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  programenrollment = {
    /**
     * @tags programenrollment
     * @name getAllProgramEnrollments
     * @summary Search for programenrollment
     * @request GET:/programenrollment
     * @description At least one search parameter must be specified
     */
    getAllProgramEnrollments: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/programenrollment${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags programenrollment
     * @name createProgramEnrollment
     * @summary Create with properties in request
     * @request POST:/programenrollment
     */
    createProgramEnrollment: (
      resource: ProgramenrollmentCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/programenrollment`, "POST", params, resource),

    /**
     * @tags programenrollment
     * @name getProgramEnrollment
     * @summary Fetch by uuid
     * @request GET:/programenrollment/{uuid}
     */
    getProgramEnrollment: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ProgramenrollmentGet, any>(
        `/programenrollment/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags programenrollment
     * @name updateProgramEnrollment
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/programenrollment/{uuid}
     */
    updateProgramEnrollment: (
      uuid: string,
      resource: ProgramenrollmentUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/programenrollment/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags programenrollment
     * @name deleteProgramEnrollment
     * @summary Delete or purge resource by uuid
     * @request DELETE:/programenrollment/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteProgramEnrollment: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/programenrollment/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags programenrollment
     * @name createPatientState
     * @summary Create state subresource with properties in request
     * @request POST:/programenrollment/{parentUuid}/state
     */
    createPatientState: (
      parentUuid: string,
      resource: ProgramenrollmentStateCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/programenrollment/${parentUuid}/state`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags programenrollment
     * @name getPatientState
     * @summary Fetch state subresources by uuid
     * @request GET:/programenrollment/{parentUuid}/state/{uuid}
     */
    getPatientState: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ProgramenrollmentStateGet, any>(
        `/programenrollment/${parentUuid}/state/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags programenrollment
     * @name updatePatientState
     * @summary edit state subresource with given uuid, only modifying properties in request
     * @request POST:/programenrollment/{parentUuid}/state/{uuid}
     */
    updatePatientState: (
      parentUuid: string,
      uuid: string,
      resource: ProgramenrollmentStateUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/programenrollment/${parentUuid}/state/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags programenrollment
     * @name deletePatientState
     * @summary Delete or purge resource by uuid
     * @request DELETE:/programenrollment/{parentUuid}/state/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePatientState: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/programenrollment/${parentUuid}/state/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),

    /**
     * @tags programenrollment
     * @name getAllPatientProgramAttributes
     * @summary Fetch all non-retired attribute subresources
     * @request GET:/programenrollment/{parentUuid}/attribute
     */
    getAllPatientProgramAttributes: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: ProgramenrollmentAttributeGet[] }, any>(
        `/programenrollment/${parentUuid}/attribute${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags programenrollment
     * @name createPatientProgramAttribute
     * @summary Create attribute subresource with properties in request
     * @request POST:/programenrollment/{parentUuid}/attribute
     */
    createPatientProgramAttribute: (
      parentUuid: string,
      resource: ProgramenrollmentAttributeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/programenrollment/${parentUuid}/attribute`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags programenrollment
     * @name getPatientProgramAttribute
     * @summary Fetch attribute subresources by uuid
     * @request GET:/programenrollment/{parentUuid}/attribute/{uuid}
     */
    getPatientProgramAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ProgramenrollmentAttributeGet, any>(
        `/programenrollment/${parentUuid}/attribute/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags programenrollment
     * @name updatePatientProgramAttribute
     * @summary edit attribute subresource with given uuid, only modifying properties in request
     * @request POST:/programenrollment/{parentUuid}/attribute/{uuid}
     */
    updatePatientProgramAttribute: (
      parentUuid: string,
      uuid: string,
      resource: ProgramenrollmentAttributeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/programenrollment/${parentUuid}/attribute/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags programenrollment
     * @name deletePatientProgramAttribute
     * @summary Delete or purge resource by uuid
     * @request DELETE:/programenrollment/{parentUuid}/attribute/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePatientProgramAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/programenrollment/${parentUuid}/attribute/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),
  };
  encounter = {
    /**
     * @tags encounter
     * @name getAllEncounters
     * @summary Search for encounter
     * @request GET:/encounter
     * @description At least one search parameter must be specified
     */
    getAllEncounters: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        obsConcept?: string;
        obsValues?: string;
        todate?: string;
        patient?: string;
        encounterType?: string;
        fromdate?: string;
        order?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/encounter${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags encounter
     * @name createEncounter
     * @summary Create with properties in request
     * @request POST:/encounter
     */
    createEncounter: (resource: EncounterCreate, params?: RequestParams) =>
      this.request<any, any>(`/encounter`, "POST", params, resource),

    /**
     * @tags encounter
     * @name getEncounter
     * @summary Fetch by uuid
     * @request GET:/encounter/{uuid}
     */
    getEncounter: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<EncounterGet, any>(
        `/encounter/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags encounter
     * @name updateEncounter
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/encounter/{uuid}
     */
    updateEncounter: (
      uuid: string,
      resource: EncounterUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/encounter/${uuid}`, "POST", params, resource),

    /**
     * @tags encounter
     * @name deleteEncounter
     * @summary Delete or purge resource by uuid
     * @request DELETE:/encounter/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteEncounter: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/encounter/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags encounter
     * @name getAllEncounterProviders
     * @summary Fetch all non-retired encounterprovider subresources
     * @request GET:/encounter/{parentUuid}/encounterprovider
     */
    getAllEncounterProviders: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: EncounterEncounterproviderGet[] }, any>(
        `/encounter/${parentUuid}/encounterprovider${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags encounter
     * @name createEncounterProvider
     * @summary Create encounterprovider subresource with properties in request
     * @request POST:/encounter/{parentUuid}/encounterprovider
     */
    createEncounterProvider: (
      parentUuid: string,
      resource: EncounterEncounterproviderCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/encounter/${parentUuid}/encounterprovider`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags encounter
     * @name getEncounterProvider
     * @summary Fetch encounterprovider subresources by uuid
     * @request GET:/encounter/{parentUuid}/encounterprovider/{uuid}
     */
    getEncounterProvider: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<EncounterEncounterproviderGet, any>(
        `/encounter/${parentUuid}/encounterprovider/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags encounter
     * @name updateEncounterProvider
     * @summary edit encounterprovider subresource with given uuid, only modifying properties in request
     * @request POST:/encounter/{parentUuid}/encounterprovider/{uuid}
     */
    updateEncounterProvider: (
      parentUuid: string,
      uuid: string,
      resource: EncounterEncounterproviderUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/encounter/${parentUuid}/encounterprovider/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags encounter
     * @name deleteEncounterProvider
     * @summary Delete or purge resource by uuid
     * @request DELETE:/encounter/{parentUuid}/encounterprovider/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteEncounterProvider: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/encounter/${parentUuid}/encounterprovider/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),
  };
  patient = {
    /**
     * @tags patient
     * @name getAllPatients
     * @summary Search for patient
     * @request GET:/patient
     * @description At least one search parameter must be specified
     */
    getAllPatients: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        matchSimilar?: string;
        country?: string;
        identifier?: string;
        birthdate?: string;
        gender?: string;
        city?: string;
        address2?: string;
        searchType?: string;
        address1?: string;
        familyname?: string;
        middlename?: string;
        lastviewed?: string;
        includeDead?: string;
        postalcode?: string;
        givenname?: string;
        state?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/patient${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags patient
     * @name createPatient
     * @summary Create with properties in request
     * @request POST:/patient
     */
    createPatient: (resource: PatientCreate, params?: RequestParams) =>
      this.request<any, any>(`/patient`, "POST", params, resource),

    /**
     * @tags patient
     * @name getPatient
     * @summary Fetch by uuid
     * @request GET:/patient/{uuid}
     */
    getPatient: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PatientGet, any>(
        `/patient/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags patient
     * @name updatePatient
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/patient/{uuid}
     */
    updatePatient: (
      uuid: string,
      resource: PatientUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/patient/${uuid}`, "POST", params, resource),

    /**
     * @tags patient
     * @name deletePatient
     * @summary Delete or purge resource by uuid
     * @request DELETE:/patient/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePatient: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patient/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags patient
     * @name getAllPatientIdentifiers
     * @summary Fetch all non-retired identifier subresources
     * @request GET:/patient/{parentUuid}/identifier
     */
    getAllPatientIdentifiers: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: PatientIdentifierGet[] }, any>(
        `/patient/${parentUuid}/identifier${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags patient
     * @name createPatientIdentifier
     * @summary Create identifier subresource with properties in request
     * @request POST:/patient/{parentUuid}/identifier
     */
    createPatientIdentifier: (
      parentUuid: string,
      resource: PatientIdentifierCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patient/${parentUuid}/identifier`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags patient
     * @name getPatientIdentifier
     * @summary Fetch identifier subresources by uuid
     * @request GET:/patient/{parentUuid}/identifier/{uuid}
     */
    getPatientIdentifier: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PatientIdentifierGet, any>(
        `/patient/${parentUuid}/identifier/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags patient
     * @name updatePatientIdentifier
     * @summary edit identifier subresource with given uuid, only modifying properties in request
     * @request POST:/patient/{parentUuid}/identifier/{uuid}
     */
    updatePatientIdentifier: (
      parentUuid: string,
      uuid: string,
      resource: PatientIdentifierUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patient/${parentUuid}/identifier/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags patient
     * @name deletePatientIdentifier
     * @summary Delete or purge resource by uuid
     * @request DELETE:/patient/{parentUuid}/identifier/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePatientIdentifier: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patient/${parentUuid}/identifier/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),

    /**
     * @tags patient
     * @name createPatientAllergy
     * @summary Create allergy subresource with properties in request
     * @request POST:/patient/{parentUuid}/allergy
     */
    createPatientAllergy: (
      parentUuid: string,
      resource: PatientAllergyCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patient/${parentUuid}/allergy`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags patient
     * @name getPatientAllergy
     * @summary Fetch allergy subresources by uuid
     * @request GET:/patient/{parentUuid}/allergy/{uuid}
     */
    getPatientAllergy: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PatientAllergyGet, any>(
        `/patient/${parentUuid}/allergy/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags patient
     * @name updatePatientAllergy
     * @summary edit allergy subresource with given uuid, only modifying properties in request
     * @request POST:/patient/{parentUuid}/allergy/{uuid}
     */
    updatePatientAllergy: (
      parentUuid: string,
      uuid: string,
      resource: PatientAllergyUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patient/${parentUuid}/allergy/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags patient
     * @name deletePatientAllergy
     * @summary Delete or purge resource by uuid
     * @request DELETE:/patient/{parentUuid}/allergy/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePatientAllergy: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patient/${parentUuid}/allergy/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  relationshiptype = {
    /**
     * @tags relationshiptype
     * @name getAllRelationShipTypes
     * @summary Fetch all non-retired relationshiptype resources or perform search
     * @request GET:/relationshiptype
     * @description All search parameters are optional
     */
    getAllRelationShipTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/relationshiptype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags relationshiptype
     * @name createRelationShipType
     * @summary Create with properties in request
     * @request POST:/relationshiptype
     */
    createRelationShipType: (
      resource: RelationshiptypeCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/relationshiptype`, "POST", params, resource),

    /**
     * @tags relationshiptype
     * @name getRelationShipType
     * @summary Fetch by uuid
     * @request GET:/relationshiptype/{uuid}
     */
    getRelationShipType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<RelationshiptypeGet, any>(
        `/relationshiptype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags relationshiptype
     * @name updateRelationShipType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/relationshiptype/{uuid}
     */
    updateRelationShipType: (
      uuid: string,
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/relationshiptype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags relationshiptype
     * @name deleteRelationShipType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/relationshiptype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteRelationShipType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/relationshiptype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  reportingrest = {
    /**
     * @tags reportingrest/cohort
     * @name getAllEvaluatedCohorts
     * @summary Search for reportingrest/cohort
     * @request GET:/reportingrest/cohort
     * @description At least one search parameter must be specified
     */
    getAllEvaluatedCohorts: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/reportingrest/cohort${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/cohort
     * @name createEvaluatedCohort
     * @summary Create with properties in request
     * @request POST:/reportingrest/cohort
     */
    createEvaluatedCohort: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/reportingrest/cohort`, "POST", params, resource),

    /**
     * @tags reportingrest/cohort
     * @name getEvaluatedCohort
     * @summary Fetch by uuid
     * @request GET:/reportingrest/cohort/{uuid}
     */
    getEvaluatedCohort: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ReportingrestCohortGet, any>(
        `/reportingrest/cohort/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/cohort
     * @name deleteEvaluatedCohort
     * @summary Delete or purge resource by uuid
     * @request DELETE:/reportingrest/cohort/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteEvaluatedCohort: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/cohort/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags reportingrest/dataSet
     * @name getAllEvaluatedDataSets
     * @summary Search for reportingrest/dataSet
     * @request GET:/reportingrest/dataSet
     * @description At least one search parameter must be specified
     */
    getAllEvaluatedDataSets: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/reportingrest/dataSet${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/dataSet
     * @name createEvaluatedDataSet
     * @summary Create with properties in request
     * @request POST:/reportingrest/dataSet
     */
    createEvaluatedDataSet: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/dataSet`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags reportingrest/dataSet
     * @name getEvaluatedDataSet
     * @summary Fetch by uuid
     * @request GET:/reportingrest/dataSet/{uuid}
     */
    getEvaluatedDataSet: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ReportingrestDataSetGet, any>(
        `/reportingrest/dataSet/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/dataSet
     * @name deleteEvaluatedDataSet
     * @summary Delete or purge resource by uuid
     * @request DELETE:/reportingrest/dataSet/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteEvaluatedDataSet: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/dataSet/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags reportingrest/reportDefinition
     * @name getAllReportDefinitions
     * @summary Fetch all non-retired reportingrest/reportDefinition resources or perform search
     * @request GET:/reportingrest/reportDefinition
     * @description All search parameters are optional
     */
    getAllReportDefinitions: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/reportingrest/reportDefinition${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/reportDefinition
     * @name createReportDefinition
     * @summary Create with properties in request
     * @request POST:/reportingrest/reportDefinition
     */
    createReportDefinition: (
      resource: ReportingrestReportDefinitionCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/reportDefinition`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags reportingrest/reportDefinition
     * @name getReportDefinition
     * @summary Fetch by uuid
     * @request GET:/reportingrest/reportDefinition/{uuid}
     */
    getReportDefinition: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ReportingrestReportDefinitionGet, any>(
        `/reportingrest/reportDefinition/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/reportDefinition
     * @name updateReportDefinition
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/reportingrest/reportDefinition/{uuid}
     */
    updateReportDefinition: (
      uuid: string,
      resource: ReportingrestReportDefinitionUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/reportDefinition/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags reportingrest/reportDefinition
     * @name deleteReportDefinition
     * @summary Delete or purge resource by uuid
     * @request DELETE:/reportingrest/reportDefinition/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteReportDefinition: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/reportDefinition/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags reportingrest/reportRequest
     * @name getAllReportRequests
     * @summary Search for reportingrest/reportRequest
     * @request GET:/reportingrest/reportRequest
     * @description At least one search parameter must be specified
     */
    getAllReportRequests: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/reportingrest/reportRequest${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/reportRequest
     * @name createReportRequest
     * @summary Create with properties in request
     * @request POST:/reportingrest/reportRequest
     */
    createReportRequest: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/reportRequest`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags reportingrest/reportRequest
     * @name getReportRequest
     * @summary Fetch by uuid
     * @request GET:/reportingrest/reportRequest/{uuid}
     */
    getReportRequest: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ReportingrestReportRequestGet, any>(
        `/reportingrest/reportRequest/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/reportRequest
     * @name updateReportRequest
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/reportingrest/reportRequest/{uuid}
     */
    updateReportRequest: (
      uuid: string,
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/reportRequest/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags reportingrest/reportRequest
     * @name deleteReportRequest
     * @summary Delete or purge resource by uuid
     * @request DELETE:/reportingrest/reportRequest/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteReportRequest: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/reportRequest/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags reportingrest/dataSetDefinition
     * @name getAllDataSetDefinitions
     * @summary Fetch all non-retired reportingrest/dataSetDefinition resources or perform search
     * @request GET:/reportingrest/dataSetDefinition
     * @description All search parameters are optional
     */
    getAllDataSetDefinitions: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/reportingrest/dataSetDefinition${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/dataSetDefinition
     * @name createDataSetDefinition
     * @summary Create with properties in request
     * @request POST:/reportingrest/dataSetDefinition
     */
    createDataSetDefinition: (
      resource: ReportingrestDataSetDefinitionCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/dataSetDefinition`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags reportingrest/dataSetDefinition
     * @name getDataSetDefinition
     * @summary Fetch by uuid
     * @request GET:/reportingrest/dataSetDefinition/{uuid}
     */
    getDataSetDefinition: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ReportingrestDataSetDefinitionGet, any>(
        `/reportingrest/dataSetDefinition/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/dataSetDefinition
     * @name updateDataSetDefinition
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/reportingrest/dataSetDefinition/{uuid}
     */
    updateDataSetDefinition: (
      uuid: string,
      resource: ReportingrestDataSetDefinitionUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/dataSetDefinition/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags reportingrest/dataSetDefinition
     * @name deleteDataSetDefinition
     * @summary Delete or purge resource by uuid
     * @request DELETE:/reportingrest/dataSetDefinition/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteDataSetDefinition: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/dataSetDefinition/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags reportingrest/reportdata
     * @name getAllEvaluatedReportDefinitions
     * @summary Search for reportingrest/reportdata
     * @request GET:/reportingrest/reportdata
     * @description At least one search parameter must be specified
     */
    getAllEvaluatedReportDefinitions: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/reportingrest/reportdata${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/reportdata
     * @name createEvaluatedReportDefinition
     * @summary Create with properties in request
     * @request POST:/reportingrest/reportdata
     */
    createEvaluatedReportDefinition: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/reportdata`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags reportingrest/reportdata
     * @name getEvaluatedReportDefinition
     * @summary Fetch by uuid
     * @request GET:/reportingrest/reportdata/{uuid}
     */
    getEvaluatedReportDefinition: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ReportingrestReportdataGet, any>(
        `/reportingrest/reportdata/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/reportdata
     * @name deleteEvaluatedReportDefinition
     * @summary Delete or purge resource by uuid
     * @request DELETE:/reportingrest/reportdata/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteEvaluatedReportDefinition: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/reportdata/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags reportingrest/cohortDefinition
     * @name getAllCohortDefinitions
     * @summary Fetch all non-retired reportingrest/cohortDefinition resources or perform search
     * @request GET:/reportingrest/cohortDefinition
     * @description All search parameters are optional
     */
    getAllCohortDefinitions: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/reportingrest/cohortDefinition${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/cohortDefinition
     * @name createCohortDefinition
     * @summary Create with properties in request
     * @request POST:/reportingrest/cohortDefinition
     */
    createCohortDefinition: (
      resource: ReportingrestCohortDefinitionCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/cohortDefinition`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags reportingrest/cohortDefinition
     * @name getCohortDefinition
     * @summary Fetch by uuid
     * @request GET:/reportingrest/cohortDefinition/{uuid}
     */
    getCohortDefinition: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ReportingrestCohortDefinitionGet, any>(
        `/reportingrest/cohortDefinition/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reportingrest/cohortDefinition
     * @name updateCohortDefinition
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/reportingrest/cohortDefinition/{uuid}
     */
    updateCohortDefinition: (
      uuid: string,
      resource: ReportingrestCohortDefinitionUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/cohortDefinition/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags reportingrest/cohortDefinition
     * @name deleteCohortDefinition
     * @summary Delete or purge resource by uuid
     * @request DELETE:/reportingrest/cohortDefinition/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteCohortDefinition: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/reportingrest/cohortDefinition/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  visit = {
    /**
     * @tags visit
     * @name getAllVisits
     * @summary Fetch all non-retired visit resources or perform search
     * @request GET:/visit
     * @description All search parameters are optional
     */
    getAllVisits: (
      query?: {
        limit?: number;
        startIndex?: number;
        includeInactive?: boolean;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/visit${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags visit
     * @name createVisit
     * @summary Create with properties in request
     * @request POST:/visit
     */
    createVisit: (resource: VisitCreate, params?: RequestParams) =>
      this.request<any, any>(`/visit`, "POST", params, resource),

    /**
     * @tags visit
     * @name getVisit
     * @summary Fetch by uuid
     * @request GET:/visit/{uuid}
     */
    getVisit: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<VisitGet, any>(
        `/visit/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags visit
     * @name updateVisit
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/visit/{uuid}
     */
    updateVisit: (
      uuid: string,
      resource: VisitUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/visit/${uuid}`, "POST", params, resource),

    /**
     * @tags visit
     * @name deleteVisit
     * @summary Delete or purge resource by uuid
     * @request DELETE:/visit/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteVisit: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/visit/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags visit
     * @name getAllVisitAttributes
     * @summary Fetch all non-retired attribute subresources
     * @request GET:/visit/{parentUuid}/attribute
     */
    getAllVisitAttributes: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: VisitAttributeGet[] }, any>(
        `/visit/${parentUuid}/attribute${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags visit
     * @name createVisitAttribute
     * @summary Create attribute subresource with properties in request
     * @request POST:/visit/{parentUuid}/attribute
     */
    createVisitAttribute: (
      parentUuid: string,
      resource: VisitAttributeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/visit/${parentUuid}/attribute`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags visit
     * @name getVisitAttribute
     * @summary Fetch attribute subresources by uuid
     * @request GET:/visit/{parentUuid}/attribute/{uuid}
     */
    getVisitAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<VisitAttributeGet, any>(
        `/visit/${parentUuid}/attribute/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags visit
     * @name updateVisitAttribute
     * @summary edit attribute subresource with given uuid, only modifying properties in request
     * @request POST:/visit/{parentUuid}/attribute/{uuid}
     */
    updateVisitAttribute: (
      parentUuid: string,
      uuid: string,
      resource: VisitAttributeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/visit/${parentUuid}/attribute/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags visit
     * @name deleteVisitAttribute
     * @summary Delete or purge resource by uuid
     * @request DELETE:/visit/{parentUuid}/attribute/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteVisitAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/visit/${parentUuid}/attribute/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  location = {
    /**
     * @tags location
     * @name getAllLocations
     * @summary Fetch all non-retired location resources or perform search
     * @request GET:/location
     * @description All search parameters are optional
     */
    getAllLocations: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        tag?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/location${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags location
     * @name createLocation
     * @summary Create with properties in request
     * @request POST:/location
     */
    createLocation: (resource: LocationCreate, params?: RequestParams) =>
      this.request<any, any>(`/location`, "POST", params, resource),

    /**
     * @tags location
     * @name getLocation
     * @summary Fetch by uuid
     * @request GET:/location/{uuid}
     */
    getLocation: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<LocationGet, any>(
        `/location/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags location
     * @name updateLocation
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/location/{uuid}
     */
    updateLocation: (
      uuid: string,
      resource: LocationUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/location/${uuid}`, "POST", params, resource),

    /**
     * @tags location
     * @name deleteLocation
     * @summary Delete or purge resource by uuid
     * @request DELETE:/location/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteLocation: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/location/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags location
     * @name getAllLocationAttributes
     * @summary Fetch all non-retired attribute resources or perform search
     * @request GET:/location/{parentUuid}/attribute
     * @description All search parameters are optional
     */
    getAllLocationAttributes: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: LocationAttributeGet[] }, any>(
        `/location/${parentUuid}/attribute${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags location
     * @name createLocationAttribute
     * @summary Create attribute subresource with properties in request
     * @request POST:/location/{parentUuid}/attribute
     */
    createLocationAttribute: (
      parentUuid: string,
      resource: LocationAttributeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/location/${parentUuid}/attribute`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags location
     * @name getLocationAttribute
     * @summary Fetch attribute subresources by uuid
     * @request GET:/location/{parentUuid}/attribute/{uuid}
     */
    getLocationAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<LocationAttributeGet, any>(
        `/location/${parentUuid}/attribute/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags location
     * @name updateLocationAttribute
     * @summary edit attribute subresource with given uuid, only modifying properties in request
     * @request POST:/location/{parentUuid}/attribute/{uuid}
     */
    updateLocationAttribute: (
      parentUuid: string,
      uuid: string,
      resource: LocationAttributeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/location/${parentUuid}/attribute/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags location
     * @name deleteLocationAttribute
     * @summary Delete or purge resource by uuid
     * @request DELETE:/location/{parentUuid}/attribute/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteLocationAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/location/${parentUuid}/attribute/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),
  };
  patientdiagnoses = {
    /**
     * @tags patientdiagnoses
     * @name getAllDiagnoses
     * @summary Search for patientdiagnoses
     * @request GET:/patientdiagnoses
     * @description At least one search parameter must be specified
     */
    getAllDiagnoses: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/patientdiagnoses${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags patientdiagnoses
     * @name createDiagnosis
     * @summary Create with properties in request
     * @request POST:/patientdiagnoses
     */
    createDiagnosis: (
      resource: PatientdiagnosesCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/patientdiagnoses`, "POST", params, resource),

    /**
     * @tags patientdiagnoses
     * @name getDiagnosis
     * @summary Fetch by uuid
     * @request GET:/patientdiagnoses/{uuid}
     */
    getDiagnosis: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PatientdiagnosesGet, any>(
        `/patientdiagnoses/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags patientdiagnoses
     * @name updateDiagnosis
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/patientdiagnoses/{uuid}
     */
    updateDiagnosis: (
      uuid: string,
      resource: PatientdiagnosesUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patientdiagnoses/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags patientdiagnoses
     * @name deleteDiagnosis
     * @summary Delete or purge resource by uuid
     * @request DELETE:/patientdiagnoses/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteDiagnosis: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patientdiagnoses/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  user = {
    /**
     * @tags user
     * @name getAllUsers
     * @summary Fetch all non-retired user resources or perform search
     * @request GET:/user
     * @description All search parameters are optional
     */
    getAllUsers: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        username?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/user${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags user
     * @name createUser
     * @summary Create with properties in request
     * @request POST:/user
     */
    createUser: (resource: UserCreate, params?: RequestParams) =>
      this.request<any, any>(`/user`, "POST", params, resource),

    /**
     * @tags user
     * @name getUser
     * @summary Fetch by uuid
     * @request GET:/user/{uuid}
     */
    getUser: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<UserGet, any>(
        `/user/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags user
     * @name updateUser
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/user/{uuid}
     */
    updateUser: (uuid: string, resource: UserUpdate, params?: RequestParams) =>
      this.request<any, any>(`/user/${uuid}`, "POST", params, resource),

    /**
     * @tags user
     * @name deleteUser
     * @summary Delete or purge resource by uuid
     * @request DELETE:/user/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteUser: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/user/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  providerattributetype = {
    /**
     * @tags providerattributetype
     * @name getAllProviderAttributeTypes
     * @summary Fetch all non-retired providerattributetype resources or perform search
     * @request GET:/providerattributetype
     * @description All search parameters are optional
     */
    getAllProviderAttributeTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/providerattributetype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags providerattributetype
     * @name createProviderAttributeType
     * @summary Create with properties in request
     * @request POST:/providerattributetype
     */
    createProviderAttributeType: (
      resource: ProviderattributetypeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/providerattributetype`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags providerattributetype
     * @name getProviderAttributeType
     * @summary Fetch by uuid
     * @request GET:/providerattributetype/{uuid}
     */
    getProviderAttributeType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ProviderattributetypeGet, any>(
        `/providerattributetype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags providerattributetype
     * @name updateProviderAttributeType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/providerattributetype/{uuid}
     */
    updateProviderAttributeType: (
      uuid: string,
      resource: ProviderattributetypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/providerattributetype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags providerattributetype
     * @name deleteProviderAttributeType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/providerattributetype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteProviderAttributeType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/providerattributetype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  conceptmaptype = {
    /**
     * @tags conceptmaptype
     * @name getAllConceptMapTypes
     * @summary Fetch all non-retired conceptmaptype resources or perform search
     * @request GET:/conceptmaptype
     * @description All search parameters are optional
     */
    getAllConceptMapTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/conceptmaptype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptmaptype
     * @name createConceptMapType
     * @summary Create with properties in request
     * @request POST:/conceptmaptype
     */
    createConceptMapType: (
      resource: ConceptmaptypeCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/conceptmaptype`, "POST", params, resource),

    /**
     * @tags conceptmaptype
     * @name getConceptMapType
     * @summary Fetch by uuid
     * @request GET:/conceptmaptype/{uuid}
     */
    getConceptMapType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptmaptypeGet, any>(
        `/conceptmaptype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptmaptype
     * @name updateConceptMapType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/conceptmaptype/{uuid}
     */
    updateConceptMapType: (
      uuid: string,
      resource: ConceptmaptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptmaptype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags conceptmaptype
     * @name deleteConceptMapType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/conceptmaptype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptMapType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptmaptype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  patientprofile = {
    /**
     * @tags patientprofile
     * @name getAllPatientProfiles
     * @summary Search for patientprofile
     * @request GET:/patientprofile
     * @description At least one search parameter must be specified
     */
    getAllPatientProfiles: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/patientprofile${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags patientprofile
     * @name createPatientProfile
     * @summary Create with properties in request
     * @request POST:/patientprofile
     */
    createPatientProfile: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/patientprofile`, "POST", params, resource),

    /**
     * @tags patientprofile
     * @name updatePatientProfile
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/patientprofile/{uuid}
     */
    updatePatientProfile: (
      uuid: string,
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patientprofile/${uuid}`,
        "POST",
        params,
        resource
      ),
  };
  conceptreferenceterm = {
    /**
     * @tags conceptreferenceterm
     * @name getAllConceptReferenceTerms
     * @summary Fetch all non-retired conceptreferenceterm resources or perform search
     * @request GET:/conceptreferenceterm
     * @description All search parameters are optional
     */
    getAllConceptReferenceTerms: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        codeOrName?: string;
        searchType?: string;
        source?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/conceptreferenceterm${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptreferenceterm
     * @name createConceptReferenceTerm
     * @summary Create with properties in request
     * @request POST:/conceptreferenceterm
     */
    createConceptReferenceTerm: (
      resource: ConceptreferencetermCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/conceptreferenceterm`, "POST", params, resource),

    /**
     * @tags conceptreferenceterm
     * @name getConceptReferenceTerm
     * @summary Fetch by uuid
     * @request GET:/conceptreferenceterm/{uuid}
     */
    getConceptReferenceTerm: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptreferencetermGet, any>(
        `/conceptreferenceterm/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptreferenceterm
     * @name updateConceptReferenceTerm
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/conceptreferenceterm/{uuid}
     */
    updateConceptReferenceTerm: (
      uuid: string,
      resource: ConceptreferencetermUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptreferenceterm/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags conceptreferenceterm
     * @name deleteConceptReferenceTerm
     * @summary Delete or purge resource by uuid
     * @request DELETE:/conceptreferenceterm/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptReferenceTerm: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptreferenceterm/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  encountertype = {
    /**
     * @tags encountertype
     * @name getAllEncounterTypes
     * @summary Fetch all non-retired encountertype resources or perform search
     * @request GET:/encountertype
     * @description All search parameters are optional
     */
    getAllEncounterTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/encountertype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags encountertype
     * @name createEncounterType
     * @summary Create with properties in request
     * @request POST:/encountertype
     */
    createEncounterType: (
      resource: EncountertypeCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/encountertype`, "POST", params, resource),

    /**
     * @tags encountertype
     * @name getEncounterType
     * @summary Fetch by uuid
     * @request GET:/encountertype/{uuid}
     */
    getEncounterType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<EncountertypeGet, any>(
        `/encountertype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags encountertype
     * @name updateEncounterType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/encountertype/{uuid}
     */
    updateEncounterType: (
      uuid: string,
      resource: EncountertypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/encountertype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags encountertype
     * @name deleteEncounterType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/encountertype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteEncounterType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/encountertype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  cohort = {
    /**
     * @tags cohort
     * @name getAllCohorts
     * @summary Fetch all non-retired cohort resources or perform search
     * @request GET:/cohort
     * @description All search parameters are optional
     */
    getAllCohorts: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/cohort${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags cohort
     * @name createCohort
     * @summary Create with properties in request
     * @request POST:/cohort
     */
    createCohort: (resource: CohortCreate, params?: RequestParams) =>
      this.request<any, any>(`/cohort`, "POST", params, resource),

    /**
     * @tags cohort
     * @name getCohort
     * @summary Fetch by uuid
     * @request GET:/cohort/{uuid}
     */
    getCohort: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<CohortGet, any>(
        `/cohort/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags cohort
     * @name updateCohort
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/cohort/{uuid}
     */
    updateCohort: (
      uuid: string,
      resource: CohortUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/cohort/${uuid}`, "POST", params, resource),

    /**
     * @tags cohort
     * @name deleteCohort
     * @summary Delete or purge resource by uuid
     * @request DELETE:/cohort/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteCohort: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/cohort/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags cohort
     * @name getAllCohortMemberships
     * @summary Fetch all non-retired membership subresources
     * @request GET:/cohort/{parentUuid}/membership
     */
    getAllCohortMemberships: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: CohortMembershipGet[] }, any>(
        `/cohort/${parentUuid}/membership${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags cohort
     * @name createCohortMembership
     * @summary Create membership subresource with properties in request
     * @request POST:/cohort/{parentUuid}/membership
     */
    createCohortMembership: (
      parentUuid: string,
      resource: CohortMembershipCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/cohort/${parentUuid}/membership`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags cohort
     * @name getCohortMembership
     * @summary Fetch membership subresources by uuid
     * @request GET:/cohort/{parentUuid}/membership/{uuid}
     */
    getCohortMembership: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<CohortMembershipGet, any>(
        `/cohort/${parentUuid}/membership/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags cohort
     * @name updateCohortMembership
     * @summary edit membership subresource with given uuid, only modifying properties in request
     * @request POST:/cohort/{parentUuid}/membership/{uuid}
     */
    updateCohortMembership: (
      parentUuid: string,
      uuid: string,
      resource: CohortMembershipUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/cohort/${parentUuid}/membership/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags cohort
     * @name deleteCohortMembership
     * @summary Delete or purge resource by uuid
     * @request DELETE:/cohort/{parentUuid}/membership/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteCohortMembership: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/cohort/${parentUuid}/membership/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  encounterrole = {
    /**
     * @tags encounterrole
     * @name getAllEncounterRoles
     * @summary Fetch all non-retired encounterrole resources or perform search
     * @request GET:/encounterrole
     * @description All search parameters are optional
     */
    getAllEncounterRoles: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/encounterrole${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags encounterrole
     * @name createEncounterRole
     * @summary Create with properties in request
     * @request POST:/encounterrole
     */
    createEncounterRole: (
      resource: EncounterroleCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/encounterrole`, "POST", params, resource),

    /**
     * @tags encounterrole
     * @name getEncounterRole
     * @summary Fetch by uuid
     * @request GET:/encounterrole/{uuid}
     */
    getEncounterRole: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<EncounterroleGet, any>(
        `/encounterrole/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags encounterrole
     * @name updateEncounterRole
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/encounterrole/{uuid}
     */
    updateEncounterRole: (
      uuid: string,
      resource: EncounterroleUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/encounterrole/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags encounterrole
     * @name deleteEncounterRole
     * @summary Delete or purge resource by uuid
     * @request DELETE:/encounterrole/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteEncounterRole: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/encounterrole/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  field = {
    /**
     * @tags field
     * @name getAllFields
     * @summary Fetch all non-retired field resources or perform search
     * @request GET:/field
     * @description All search parameters are optional
     */
    getAllFields: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/field${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags field
     * @name createField
     * @summary Create with properties in request
     * @request POST:/field
     */
    createField: (resource: FieldCreate, params?: RequestParams) =>
      this.request<any, any>(`/field`, "POST", params, resource),

    /**
     * @tags field
     * @name getField
     * @summary Fetch by uuid
     * @request GET:/field/{uuid}
     */
    getField: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<FieldGet, any>(
        `/field/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags field
     * @name updateField
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/field/{uuid}
     */
    updateField: (
      uuid: string,
      resource: FieldUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/field/${uuid}`, "POST", params, resource),

    /**
     * @tags field
     * @name deleteField
     * @summary Delete or purge resource by uuid
     * @request DELETE:/field/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteField: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/field/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags field
     * @name getAllFieldAnswers
     * @summary Fetch all non-retired answer subresources
     * @request GET:/field/{parentUuid}/answer
     */
    getAllFieldAnswers: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: FieldAnswerGet[] }, any>(
        `/field/${parentUuid}/answer${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags field
     * @name createFieldAnswer
     * @summary Create answer subresource with properties in request
     * @request POST:/field/{parentUuid}/answer
     */
    createFieldAnswer: (
      parentUuid: string,
      resource: FieldAnswerCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/field/${parentUuid}/answer`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags field
     * @name getFieldAnswer
     * @summary Fetch answer subresources by uuid
     * @request GET:/field/{parentUuid}/answer/{uuid}
     */
    getFieldAnswer: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<FieldAnswerGet, any>(
        `/field/${parentUuid}/answer/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags field
     * @name updateFieldAnswer
     * @summary edit answer subresource with given uuid, only modifying properties in request
     * @request POST:/field/{parentUuid}/answer/{uuid}
     */
    updateFieldAnswer: (
      parentUuid: string,
      uuid: string,
      resource: FieldAnswerUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/field/${parentUuid}/answer/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags field
     * @name deleteFieldAnswer
     * @summary Delete or purge resource by uuid
     * @request DELETE:/field/{parentUuid}/answer/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteFieldAnswer: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/field/${parentUuid}/answer/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  conceptclass = {
    /**
     * @tags conceptclass
     * @name getAllConceptClasses
     * @summary Fetch all non-retired conceptclass resources or perform search
     * @request GET:/conceptclass
     * @description All search parameters are optional
     */
    getAllConceptClasses: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/conceptclass${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptclass
     * @name createConceptClass
     * @summary Create with properties in request
     * @request POST:/conceptclass
     */
    createConceptClass: (
      resource: ConceptclassCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/conceptclass`, "POST", params, resource),

    /**
     * @tags conceptclass
     * @name getConceptClass
     * @summary Fetch by uuid
     * @request GET:/conceptclass/{uuid}
     */
    getConceptClass: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptclassGet, any>(
        `/conceptclass/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptclass
     * @name updateConceptClass
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/conceptclass/{uuid}
     */
    updateConceptClass: (
      uuid: string,
      resource: ConceptclassUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/conceptclass/${uuid}`, "POST", params, resource),

    /**
     * @tags conceptclass
     * @name deleteConceptClass
     * @summary Delete or purge resource by uuid
     * @request DELETE:/conceptclass/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptClass: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptclass/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  caresetting = {
    /**
     * @tags caresetting
     * @name getAllCareSettings
     * @summary Fetch all non-retired caresetting resources or perform search
     * @request GET:/caresetting
     * @description All search parameters are optional
     */
    getAllCareSettings: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/caresetting${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags caresetting
     * @name getCareSetting
     * @summary Fetch by uuid
     * @request GET:/caresetting/{uuid}
     */
    getCareSetting: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<CaresettingGet, any>(
        `/caresetting/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags caresetting
     * @name deleteCareSetting
     * @summary Delete or purge resource by uuid
     * @request DELETE:/caresetting/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteCareSetting: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/caresetting/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  taskdefinition = {
    /**
     * @tags taskdefinition
     * @name getAllTaskDefinitions
     * @summary Fetch all non-retired taskdefinition resources or perform search
     * @request GET:/taskdefinition
     * @description All search parameters are optional
     */
    getAllTaskDefinitions: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/taskdefinition${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags taskdefinition
     * @name createTaskDefinition
     * @summary Create with properties in request
     * @request POST:/taskdefinition
     */
    createTaskDefinition: (
      resource: TaskdefinitionCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/taskdefinition`, "POST", params, resource),

    /**
     * @tags taskdefinition
     * @name getTaskDefinition
     * @summary Fetch by uuid
     * @request GET:/taskdefinition/{uuid}
     */
    getTaskDefinition: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<TaskdefinitionGet, any>(
        `/taskdefinition/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags taskdefinition
     * @name updateTaskDefinition
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/taskdefinition/{uuid}
     */
    updateTaskDefinition: (
      uuid: string,
      resource: TaskdefinitionUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/taskdefinition/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags taskdefinition
     * @name deleteTaskDefinition
     * @summary Delete or purge resource by uuid
     * @request DELETE:/taskdefinition/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteTaskDefinition: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/taskdefinition/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  apptemplate = {
    /**
     * @tags apptemplate
     * @name getAllAppTemplates
     * @summary Fetch all non-retired
     * @request GET:/apptemplate
     */
    getAllAppTemplates: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/apptemplate${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags apptemplate
     * @name getAppTemplate
     * @summary Fetch by uuid
     * @request GET:/apptemplate/{uuid}
     */
    getAppTemplate: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ApptemplateGet, any>(
        `/apptemplate/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  serverlog = {
    /**
     * @tags serverlog
     * @name getAllServerLogs
     * @summary Fetch all non-retired
     * @request GET:/serverlog
     */
    getAllServerLogs: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/serverlog${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags serverlog
     * @name getServerLog
     * @summary Fetch by uuid
     * @request GET:/serverlog/{uuid}
     */
    getServerLog: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ServerlogGet, any>(
        `/serverlog/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  taskaction = {
    /**
     * @tags taskaction
     * @name createTaskAction
     * @summary Create with properties in request
     * @request POST:/taskaction
     */
    createTaskAction: (resource: TaskactionCreate, params?: RequestParams) =>
      this.request<any, any>(`/taskaction`, "POST", params, resource),

    /**
     * @tags taskaction
     * @name getTaskAction
     * @summary Fetch by uuid
     * @request GET:/taskaction/{uuid}
     */
    getTaskAction: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<TaskactionGet, any>(
        `/taskaction/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  moduleaction = {
    /**
     * @tags moduleaction
     * @name createModuleAction
     * @summary Create with properties in request
     * @request POST:/moduleaction
     */
    createModuleAction: (
      resource: ModuleactionCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/moduleaction`, "POST", params, resource),
  };
  personimage = {
    /**
     * @tags personimage
     * @name getAllPersonImages
     * @summary Search for personimage
     * @request GET:/personimage
     * @description At least one search parameter must be specified
     */
    getAllPersonImages: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/personimage${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags personimage
     * @name createPersonImage
     * @summary Create with properties in request
     * @request POST:/personimage
     */
    createPersonImage: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/personimage`, "POST", params, resource),

    /**
     * @tags personimage
     * @name getPersonImage
     * @summary Fetch by uuid
     * @request GET:/personimage/{uuid}
     */
    getPersonImage: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PersonimageGet, any>(
        `/personimage/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags personimage
     * @name updatePersonImage
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/personimage/{uuid}
     */
    updatePersonImage: (
      uuid: string,
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/personimage/${uuid}`, "POST", params, resource),

    /**
     * @tags personimage
     * @name deletePersonImage
     * @summary Delete or purge resource by uuid
     * @request DELETE:/personimage/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePersonImage: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/personimage/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  form = {
    /**
     * @tags form
     * @name getAllForms
     * @summary Fetch all non-retired form resources or perform search
     * @request GET:/form
     * @description All search parameters are optional
     */
    getAllForms: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/form${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags form
     * @name createForm
     * @summary Create with properties in request
     * @request POST:/form
     */
    createForm: (resource: FormCreate, params?: RequestParams) =>
      this.request<any, any>(`/form`, "POST", params, resource),

    /**
     * @tags form
     * @name getForm
     * @summary Fetch by uuid
     * @request GET:/form/{uuid}
     */
    getForm: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<FormGet, any>(
        `/form/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags form
     * @name updateForm
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/form/{uuid}
     */
    updateForm: (uuid: string, resource: FormUpdate, params?: RequestParams) =>
      this.request<any, any>(`/form/${uuid}`, "POST", params, resource),

    /**
     * @tags form
     * @name deleteForm
     * @summary Delete or purge resource by uuid
     * @request DELETE:/form/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteForm: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/form/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags form
     * @name getAllFormResources
     * @summary Fetch all non-retired resource subresources
     * @request GET:/form/{parentUuid}/resource
     */
    getAllFormResources: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: FormResourceGet[] }, any>(
        `/form/${parentUuid}/resource${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags form
     * @name createFormResource
     * @summary Create resource subresource with properties in request
     * @request POST:/form/{parentUuid}/resource
     */
    createFormResource: (
      parentUuid: string,
      resource: FormResourceCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/form/${parentUuid}/resource`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags form
     * @name getFormResource
     * @summary Fetch resource subresources by uuid
     * @request GET:/form/{parentUuid}/resource/{uuid}
     */
    getFormResource: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<FormResourceGet, any>(
        `/form/${parentUuid}/resource/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags form
     * @name updateFormResource
     * @summary edit resource subresource with given uuid, only modifying properties in request
     * @request POST:/form/{parentUuid}/resource/{uuid}
     */
    updateFormResource: (
      parentUuid: string,
      uuid: string,
      resource: FormResourceUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/form/${parentUuid}/resource/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags form
     * @name deleteFormResource
     * @summary Delete or purge resource by uuid
     * @request DELETE:/form/{parentUuid}/resource/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteFormResource: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/form/${parentUuid}/resource/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags form
     * @name getAllFormFields
     * @summary Fetch all non-retired formfield subresources
     * @request GET:/form/{parentUuid}/formfield
     */
    getAllFormFields: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: FormFormfieldGet[] }, any>(
        `/form/${parentUuid}/formfield${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags form
     * @name createFormField
     * @summary Create formfield subresource with properties in request
     * @request POST:/form/{parentUuid}/formfield
     */
    createFormField: (
      parentUuid: string,
      resource: FormFormfieldCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/form/${parentUuid}/formfield`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags form
     * @name getFormField
     * @summary Fetch formfield subresources by uuid
     * @request GET:/form/{parentUuid}/formfield/{uuid}
     */
    getFormField: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<FormFormfieldGet, any>(
        `/form/${parentUuid}/formfield/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags form
     * @name updateFormField
     * @summary edit formfield subresource with given uuid, only modifying properties in request
     * @request POST:/form/{parentUuid}/formfield/{uuid}
     */
    updateFormField: (
      parentUuid: string,
      uuid: string,
      resource: FormFormfieldUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/form/${parentUuid}/formfield/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags form
     * @name deleteFormField
     * @summary Delete or purge resource by uuid
     * @request DELETE:/form/{parentUuid}/formfield/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteFormField: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/form/${parentUuid}/formfield/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  orderfrequency = {
    /**
     * @tags orderfrequency
     * @name getAllOrderFrequencies
     * @summary Fetch all non-retired orderfrequency resources or perform search
     * @request GET:/orderfrequency
     * @description All search parameters are optional
     */
    getAllOrderFrequencies: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/orderfrequency${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags orderfrequency
     * @name createOrderFrequency
     * @summary Create with properties in request
     * @request POST:/orderfrequency
     */
    createOrderFrequency: (
      resource: OrderfrequencyCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/orderfrequency`, "POST", params, resource),

    /**
     * @tags orderfrequency
     * @name getOrderFrequency
     * @summary Fetch by uuid
     * @request GET:/orderfrequency/{uuid}
     */
    getOrderFrequency: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<OrderfrequencyGet, any>(
        `/orderfrequency/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags orderfrequency
     * @name updateOrderFrequency
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/orderfrequency/{uuid}
     */
    updateOrderFrequency: (
      uuid: string,
      resource: OrderfrequencyUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/orderfrequency/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags orderfrequency
     * @name deleteOrderFrequency
     * @summary Delete or purge resource by uuid
     * @request DELETE:/orderfrequency/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteOrderFrequency: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/orderfrequency/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  visitattributetype = {
    /**
     * @tags visitattributetype
     * @name getAllVisitAttributeTypes
     * @summary Fetch all non-retired visitattributetype resources or perform search
     * @request GET:/visitattributetype
     * @description All search parameters are optional
     */
    getAllVisitAttributeTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/visitattributetype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags visitattributetype
     * @name createVisitAttributeType
     * @summary Create with properties in request
     * @request POST:/visitattributetype
     */
    createVisitAttributeType: (
      resource: VisitattributetypeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/visitattributetype`, "POST", params, resource),

    /**
     * @tags visitattributetype
     * @name getVisitAttributeType
     * @summary Fetch by uuid
     * @request GET:/visitattributetype/{uuid}
     */
    getVisitAttributeType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<VisitattributetypeGet, any>(
        `/visitattributetype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags visitattributetype
     * @name updateVisitAttributeType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/visitattributetype/{uuid}
     */
    updateVisitAttributeType: (
      uuid: string,
      resource: VisitattributetypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/visitattributetype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags visitattributetype
     * @name deleteVisitAttributeType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/visitattributetype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteVisitAttributeType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/visitattributetype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  module = {
    /**
     * @tags module
     * @name getAllModules
     * @summary Fetch all non-retired
     * @request GET:/module
     */
    getAllModules: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/module${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags module
     * @name getModule
     * @summary Fetch by uuid
     * @request GET:/module/{uuid}
     */
    getModule: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ModuleGet, any>(
        `/module/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  locationtag = {
    /**
     * @tags locationtag
     * @name getAllLocationTags
     * @summary Fetch all non-retired locationtag resources or perform search
     * @request GET:/locationtag
     * @description All search parameters are optional
     */
    getAllLocationTags: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/locationtag${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags locationtag
     * @name createLocationTag
     * @summary Create with properties in request
     * @request POST:/locationtag
     */
    createLocationTag: (resource: LocationtagCreate, params?: RequestParams) =>
      this.request<any, any>(`/locationtag`, "POST", params, resource),

    /**
     * @tags locationtag
     * @name getLocationTag
     * @summary Fetch by uuid
     * @request GET:/locationtag/{uuid}
     */
    getLocationTag: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<LocationtagGet, any>(
        `/locationtag/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags locationtag
     * @name updateLocationTag
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/locationtag/{uuid}
     */
    updateLocationTag: (
      uuid: string,
      resource: LocationtagUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/locationtag/${uuid}`, "POST", params, resource),

    /**
     * @tags locationtag
     * @name deleteLocationTag
     * @summary Delete or purge resource by uuid
     * @request DELETE:/locationtag/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteLocationTag: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/locationtag/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  orderset = {
    /**
     * @tags orderset
     * @name getAllOrderSets
     * @summary Fetch all non-retired orderset resources or perform search
     * @request GET:/orderset
     * @description All search parameters are optional
     */
    getAllOrderSets: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/orderset${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags orderset
     * @name createOrderSet
     * @summary Create with properties in request
     * @request POST:/orderset
     */
    createOrderSet: (resource: OrdersetCreate, params?: RequestParams) =>
      this.request<any, any>(`/orderset`, "POST", params, resource),

    /**
     * @tags orderset
     * @name getOrderSet
     * @summary Fetch by uuid
     * @request GET:/orderset/{uuid}
     */
    getOrderSet: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<OrdersetGet, any>(
        `/orderset/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags orderset
     * @name updateOrderSet
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/orderset/{uuid}
     */
    updateOrderSet: (
      uuid: string,
      resource: OrdersetUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/orderset/${uuid}`, "POST", params, resource),

    /**
     * @tags orderset
     * @name deleteOrderSet
     * @summary Delete or purge resource by uuid
     * @request DELETE:/orderset/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteOrderSet: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/orderset/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags orderset
     * @name getAllOrderSetMembers
     * @summary Fetch all non-retired ordersetmember subresources
     * @request GET:/orderset/{parentUuid}/ordersetmember
     */
    getAllOrderSetMembers: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: OrdersetOrdersetmemberGet[] }, any>(
        `/orderset/${parentUuid}/ordersetmember${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags orderset
     * @name createOrderSetMember
     * @summary Create ordersetmember subresource with properties in request
     * @request POST:/orderset/{parentUuid}/ordersetmember
     */
    createOrderSetMember: (
      parentUuid: string,
      resource: OrdersetOrdersetmemberCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/orderset/${parentUuid}/ordersetmember`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags orderset
     * @name getOrderSetMember
     * @summary Fetch ordersetmember subresources by uuid
     * @request GET:/orderset/{parentUuid}/ordersetmember/{uuid}
     */
    getOrderSetMember: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<OrdersetOrdersetmemberGet, any>(
        `/orderset/${parentUuid}/ordersetmember/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags orderset
     * @name updateOrderSetMember
     * @summary edit ordersetmember subresource with given uuid, only modifying properties in request
     * @request POST:/orderset/{parentUuid}/ordersetmember/{uuid}
     */
    updateOrderSetMember: (
      parentUuid: string,
      uuid: string,
      resource: OrdersetOrdersetmemberUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/orderset/${parentUuid}/ordersetmember/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags orderset
     * @name deleteOrderSetMember
     * @summary Delete or purge resource by uuid
     * @request DELETE:/orderset/{parentUuid}/ordersetmember/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteOrderSetMember: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/orderset/${parentUuid}/ordersetmember/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),
  };
  orderable = {
    /**
     * @tags orderable
     * @name getAllOrderables
     * @summary Search for orderable
     * @request GET:/orderable
     * @description At least one search parameter must be specified
     */
    getAllOrderables: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/orderable${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  hl7 = {
    /**
     * @tags hl7
     * @name getAllHL7Messages
     * @summary Search for hl7
     * @request GET:/hl7
     * @description At least one search parameter must be specified
     */
    getAllHl7Messages: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/hl7${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags hl7
     * @name createHL7Message
     * @summary Create with properties in request
     * @request POST:/hl7
     */
    createHl7Message: (resource: Hl7Create, params?: RequestParams) =>
      this.request<any, any>(`/hl7`, "POST", params, resource),
  };
  drug = {
    /**
     * @tags drug
     * @name getAllDrugs
     * @summary Fetch all non-retired drug resources or perform search
     * @request GET:/drug
     * @description All search parameters are optional
     */
    getAllDrugs: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        code?: string;
        preferredMapTypes?: string;
        source?: string;
        locale?: string;
        exactLocale?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/drug${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags drug
     * @name createDrug
     * @summary Create with properties in request
     * @request POST:/drug
     */
    createDrug: (resource: DrugCreate, params?: RequestParams) =>
      this.request<any, any>(`/drug`, "POST", params, resource),

    /**
     * @tags drug
     * @name getDrug
     * @summary Fetch by uuid
     * @request GET:/drug/{uuid}
     */
    getDrug: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<DrugGet, any>(
        `/drug/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags drug
     * @name updateDrug
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/drug/{uuid}
     */
    updateDrug: (uuid: string, resource: DrugUpdate, params?: RequestParams) =>
      this.request<any, any>(`/drug/${uuid}`, "POST", params, resource),

    /**
     * @tags drug
     * @name deleteDrug
     * @summary Delete or purge resource by uuid
     * @request DELETE:/drug/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteDrug: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/drug/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags drug
     * @name getAllDrugIngredients
     * @summary Fetch all non-retired ingredient subresources
     * @request GET:/drug/{parentUuid}/ingredient
     */
    getAllDrugIngredients: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: DrugIngredientGet[] }, any>(
        `/drug/${parentUuid}/ingredient${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags drug
     * @name createDrugIngredient
     * @summary Create ingredient subresource with properties in request
     * @request POST:/drug/{parentUuid}/ingredient
     */
    createDrugIngredient: (
      parentUuid: string,
      resource: DrugIngredientCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/drug/${parentUuid}/ingredient`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags drug
     * @name getDrugIngredient
     * @summary Fetch ingredient subresources by uuid
     * @request GET:/drug/{parentUuid}/ingredient/{uuid}
     */
    getDrugIngredient: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<DrugIngredientGet, any>(
        `/drug/${parentUuid}/ingredient/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags drug
     * @name updateDrugIngredient
     * @summary edit ingredient subresource with given uuid, only modifying properties in request
     * @request POST:/drug/{parentUuid}/ingredient/{uuid}
     */
    updateDrugIngredient: (
      parentUuid: string,
      uuid: string,
      resource: DrugIngredientUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/drug/${parentUuid}/ingredient/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags drug
     * @name deleteDrugIngredient
     * @summary Delete or purge resource by uuid
     * @request DELETE:/drug/{parentUuid}/ingredient/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteDrugIngredient: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/drug/${parentUuid}/ingredient/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  program = {
    /**
     * @tags program
     * @name getAllPrograms
     * @summary Fetch all non-retired program resources or perform search
     * @request GET:/program
     * @description All search parameters are optional
     */
    getAllPrograms: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/program${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags program
     * @name createProgram
     * @summary Create with properties in request
     * @request POST:/program
     */
    createProgram: (resource: ProgramCreate, params?: RequestParams) =>
      this.request<any, any>(`/program`, "POST", params, resource),

    /**
     * @tags program
     * @name getProgram
     * @summary Fetch by uuid
     * @request GET:/program/{uuid}
     */
    getProgram: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ProgramGet, any>(
        `/program/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags program
     * @name updateProgram
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/program/{uuid}
     */
    updateProgram: (
      uuid: string,
      resource: ProgramUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/program/${uuid}`, "POST", params, resource),

    /**
     * @tags program
     * @name deleteProgram
     * @summary Delete or purge resource by uuid
     * @request DELETE:/program/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteProgram: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/program/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  drugreferencemap = {
    /**
     * @tags drugreferencemap
     * @name getAllDrugReferenceMaps
     * @summary Search for drugreferencemap
     * @request GET:/drugreferencemap
     * @description At least one search parameter must be specified
     */
    getAllDrugReferenceMaps: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/drugreferencemap${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags drugreferencemap
     * @name createDrugReferenceMap
     * @summary Create with properties in request
     * @request POST:/drugreferencemap
     */
    createDrugReferenceMap: (
      resource: DrugreferencemapCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/drugreferencemap`, "POST", params, resource),

    /**
     * @tags drugreferencemap
     * @name getDrugReferenceMap
     * @summary Fetch by uuid
     * @request GET:/drugreferencemap/{uuid}
     */
    getDrugReferenceMap: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<DrugreferencemapGet, any>(
        `/drugreferencemap/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags drugreferencemap
     * @name updateDrugReferenceMap
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/drugreferencemap/{uuid}
     */
    updateDrugReferenceMap: (
      uuid: string,
      resource: DrugreferencemapUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/drugreferencemap/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags drugreferencemap
     * @name deleteDrugReferenceMap
     * @summary Delete or purge resource by uuid
     * @request DELETE:/drugreferencemap/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteDrugReferenceMap: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/drugreferencemap/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  conceptsource = {
    /**
     * @tags conceptsource
     * @name getAllConceptSources
     * @summary Fetch all non-retired conceptsource resources or perform search
     * @request GET:/conceptsource
     * @description All search parameters are optional
     */
    getAllConceptSources: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/conceptsource${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptsource
     * @name createConceptSource
     * @summary Create with properties in request
     * @request POST:/conceptsource
     */
    createConceptSource: (
      resource: ConceptsourceCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/conceptsource`, "POST", params, resource),

    /**
     * @tags conceptsource
     * @name getConceptSource
     * @summary Fetch by uuid
     * @request GET:/conceptsource/{uuid}
     */
    getConceptSource: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptsourceGet, any>(
        `/conceptsource/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptsource
     * @name updateConceptSource
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/conceptsource/{uuid}
     */
    updateConceptSource: (
      uuid: string,
      resource: ConceptsourceUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptsource/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags conceptsource
     * @name deleteConceptSource
     * @summary Delete or purge resource by uuid
     * @request DELETE:/conceptsource/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptSource: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptsource/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  ordertype = {
    /**
     * @tags ordertype
     * @name getAllOrderTypes
     * @summary Fetch all non-retired ordertype resources or perform search
     * @request GET:/ordertype
     * @description All search parameters are optional
     */
    getAllOrderTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/ordertype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags ordertype
     * @name createOrderType
     * @summary Create with properties in request
     * @request POST:/ordertype
     */
    createOrderType: (resource: OrdertypeCreate, params?: RequestParams) =>
      this.request<any, any>(`/ordertype`, "POST", params, resource),

    /**
     * @tags ordertype
     * @name getOrderType
     * @summary Fetch by uuid
     * @request GET:/ordertype/{uuid}
     */
    getOrderType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<OrdertypeGet, any>(
        `/ordertype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags ordertype
     * @name updateOrderType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/ordertype/{uuid}
     */
    updateOrderType: (
      uuid: string,
      resource: OrdertypeUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/ordertype/${uuid}`, "POST", params, resource),

    /**
     * @tags ordertype
     * @name deleteOrderType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/ordertype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteOrderType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/ordertype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  conceptstopword = {
    /**
     * @tags conceptstopword
     * @name getAllConceptStopwords
     * @summary Fetch all non-retired conceptstopword resources or perform search
     * @request GET:/conceptstopword
     * @description All search parameters are optional
     */
    getAllConceptStopwords: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/conceptstopword${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptstopword
     * @name createConceptStopword
     * @summary Create with properties in request
     * @request POST:/conceptstopword
     */
    createConceptStopword: (
      resource: ConceptstopwordCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/conceptstopword`, "POST", params, resource),

    /**
     * @tags conceptstopword
     * @name getConceptStopword
     * @summary Fetch by uuid
     * @request GET:/conceptstopword/{uuid}
     */
    getConceptStopword: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptstopwordGet, any>(
        `/conceptstopword/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptstopword
     * @name updateConceptStopword
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/conceptstopword/{uuid}
     */
    updateConceptStopword: (
      uuid: string,
      resource: ConceptstopwordUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptstopword/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags conceptstopword
     * @name deleteConceptStopword
     * @summary Delete or purge resource by uuid
     * @request DELETE:/conceptstopword/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptStopword: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptstopword/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  fieldtype = {
    /**
     * @tags fieldtype
     * @name getAllFieldTypes
     * @summary Fetch all non-retired fieldtype resources or perform search
     * @request GET:/fieldtype
     * @description All search parameters are optional
     */
    getAllFieldTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/fieldtype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags fieldtype
     * @name createFieldType
     * @summary Create with properties in request
     * @request POST:/fieldtype
     */
    createFieldType: (resource: FieldtypeCreate, params?: RequestParams) =>
      this.request<any, any>(`/fieldtype`, "POST", params, resource),

    /**
     * @tags fieldtype
     * @name getFieldType
     * @summary Fetch by uuid
     * @request GET:/fieldtype/{uuid}
     */
    getFieldType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<FieldtypeGet, any>(
        `/fieldtype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags fieldtype
     * @name updateFieldType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/fieldtype/{uuid}
     */
    updateFieldType: (
      uuid: string,
      resource: FieldtypeUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/fieldtype/${uuid}`, "POST", params, resource),

    /**
     * @tags fieldtype
     * @name deleteFieldType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/fieldtype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteFieldType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/fieldtype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  order = {
    /**
     * @tags order
     * @name getAllOrders
     * @summary Search for order
     * @request GET:/order
     * @description At least one search parameter must be specified
     */
    getAllOrders: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        t?: string;
        isStopped?: string;
        includeVoided?: string;
        excludeDiscontinueOrders?: string;
        fulfillerStatus?: string;
        excludeCanceledAndExpired?: string;
        careSetting?: string;
        concepts?: string;
        autoExpireOnOrBeforeDate?: string;
        patient?: string;
        orderTypes?: string;
        orderType?: string;
        activatedOnOrBeforeDate?: string;
        action?: string;
        canceledOrExpiredOnOrBeforeDate?: string;
        includeNullFulfillerStatus?: string;
        activatedOnOrAfterDate?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/order${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags order
     * @name createOrder
     * @summary Create with properties in request
     * @request POST:/order
     */
    createOrder: (resource: OrderCreate, params?: RequestParams) =>
      this.request<any, any>(`/order`, "POST", params, resource),

    /**
     * @tags order
     * @name getOrder
     * @summary Fetch by uuid
     * @request GET:/order/{uuid}
     */
    getOrder: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<OrderGet, any>(
        `/order/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags order
     * @name deleteOrder
     * @summary Delete or purge resource by uuid
     * @request DELETE:/order/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteOrder: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/order/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags order
     * @name createFulfillerDetails
     * @summary Create fulfillerdetails subresource with properties in request
     * @request POST:/order/{parentUuid}/fulfillerdetails
     */
    createFulfillerDetails: (
      parentUuid: string,
      resource: OrderFulfillerdetailsCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/order/${parentUuid}/fulfillerdetails`,
        "POST",
        params,
        resource
      ),
  };
  patientidentifiertype = {
    /**
     * @tags patientidentifiertype
     * @name getAllPatientIdentifierTypes
     * @summary Fetch all non-retired patientidentifiertype resources or perform search
     * @request GET:/patientidentifiertype
     * @description All search parameters are optional
     */
    getAllPatientIdentifierTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/patientidentifiertype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags patientidentifiertype
     * @name createPatientIdentifierType
     * @summary Create with properties in request
     * @request POST:/patientidentifiertype
     */
    createPatientIdentifierType: (
      resource: PatientidentifiertypeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patientidentifiertype`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags patientidentifiertype
     * @name getPatientIdentifierType
     * @summary Fetch by uuid
     * @request GET:/patientidentifiertype/{uuid}
     */
    getPatientIdentifierType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PatientidentifiertypeGet, any>(
        `/patientidentifiertype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags patientidentifiertype
     * @name updatePatientIdentifierType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/patientidentifiertype/{uuid}
     */
    updatePatientIdentifierType: (
      uuid: string,
      resource: PatientidentifiertypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patientidentifiertype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags patientidentifiertype
     * @name deletePatientIdentifierType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/patientidentifiertype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePatientIdentifierType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/patientidentifiertype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  attachment = {
    /**
     * @tags attachment
     * @name getAllAttachments
     * @summary Search for attachment
     * @request GET:/attachment
     * @description At least one search parameter must be specified
     */
    getAllAttachments: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/attachment${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags attachment
     * @name createAttachment
     * @summary Create with properties in request
     * @request POST:/attachment
     */
    createAttachment: (
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/attachment`, "POST", params, resource),

    /**
     * @tags attachment
     * @name getAttachment
     * @summary Fetch by uuid
     * @request GET:/attachment/{uuid}
     */
    getAttachment: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<AttachmentGet, any>(
        `/attachment/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags attachment
     * @name updateAttachment
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/attachment/{uuid}
     */
    updateAttachment: (
      uuid: string,
      resource: RelationshiptypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/attachment/${uuid}`, "POST", params, resource),

    /**
     * @tags attachment
     * @name deleteAttachment
     * @summary Delete or purge resource by uuid
     * @request DELETE:/attachment/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteAttachment: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/attachment/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  obs = {
    /**
     * @tags obs
     * @name getAllObses
     * @summary Search for obs
     * @request GET:/obs
     * @description At least one search parameter must be specified
     */
    getAllObses: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        concepts?: string;
        patient?: string;
        conceptList?: string;
        concept?: string;
        groupingConcepts?: string;
        answers?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/obs${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags obs
     * @name createObs
     * @summary Create with properties in request
     * @request POST:/obs
     */
    createObs: (resource: ObsCreate, params?: RequestParams) =>
      this.request<any, any>(`/obs`, "POST", params, resource),

    /**
     * @tags obs
     * @name getObs
     * @summary Fetch by uuid
     * @request GET:/obs/{uuid}
     */
    getObs: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ObsGet, any>(
        `/obs/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags obs
     * @name updateObs
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/obs/{uuid}
     */
    updateObs: (uuid: string, resource: ObsUpdate, params?: RequestParams) =>
      this.request<any, any>(`/obs/${uuid}`, "POST", params, resource),

    /**
     * @tags obs
     * @name deleteObs
     * @summary Delete or purge resource by uuid
     * @request DELETE:/obs/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteObs: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/obs/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  conceptattributetype = {
    /**
     * @tags conceptattributetype
     * @name getAllConceptAttributeTypes
     * @summary Fetch all non-retired conceptattributetype resources or perform search
     * @request GET:/conceptattributetype
     * @description All search parameters are optional
     */
    getAllConceptAttributeTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/conceptattributetype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptattributetype
     * @name createConceptAttributeType
     * @summary Create with properties in request
     * @request POST:/conceptattributetype
     */
    createConceptAttributeType: (
      resource: ConceptattributetypeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/conceptattributetype`, "POST", params, resource),

    /**
     * @tags conceptattributetype
     * @name getConceptAttributeType
     * @summary Fetch by uuid
     * @request GET:/conceptattributetype/{uuid}
     */
    getConceptAttributeType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptattributetypeGet, any>(
        `/conceptattributetype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptattributetype
     * @name updateConceptAttributeType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/conceptattributetype/{uuid}
     */
    updateConceptAttributeType: (
      uuid: string,
      resource: ConceptattributetypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptattributetype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags conceptattributetype
     * @name deleteConceptAttributeType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/conceptattributetype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptAttributeType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptattributetype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  programattributetype = {
    /**
     * @tags programattributetype
     * @name getAllProgramAttributeTypes
     * @summary Fetch all non-retired programattributetype resources or perform search
     * @request GET:/programattributetype
     * @description All search parameters are optional
     */
    getAllProgramAttributeTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/programattributetype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags programattributetype
     * @name createProgramAttributeType
     * @summary Create with properties in request
     * @request POST:/programattributetype
     */
    createProgramAttributeType: (
      resource: ProgramattributetypeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/programattributetype`, "POST", params, resource),

    /**
     * @tags programattributetype
     * @name getProgramAttributeType
     * @summary Fetch by uuid
     * @request GET:/programattributetype/{uuid}
     */
    getProgramAttributeType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ProgramattributetypeGet, any>(
        `/programattributetype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags programattributetype
     * @name updateProgramAttributeType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/programattributetype/{uuid}
     */
    updateProgramAttributeType: (
      uuid: string,
      resource: ProgramattributetypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/programattributetype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags programattributetype
     * @name deleteProgramAttributeType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/programattributetype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteProgramAttributeType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/programattributetype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  customdatatype = {
    /**
     * @tags customdatatype
     * @name getAllCustomDatatypes
     * @summary Fetch all non-retired customdatatype resources or perform search
     * @request GET:/customdatatype
     * @description All search parameters are optional
     */
    getAllCustomDatatypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/customdatatype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags customdatatype
     * @name getCustomDatatype
     * @summary Fetch by uuid
     * @request GET:/customdatatype/{uuid}
     */
    getCustomDatatype: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<CustomdatatypeGet, any>(
        `/customdatatype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags customdatatype
     * @name deleteCustomDatatype
     * @summary Delete or purge resource by uuid
     * @request DELETE:/customdatatype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteCustomDatatype: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/customdatatype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags customdatatype
     * @name getAllCustomDatatypeHandlers
     * @summary Fetch all non-retired handlers subresources
     * @request GET:/customdatatype/{parentUuid}/handlers
     */
    getAllCustomDatatypeHandlers: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: CustomdatatypeHandlersGet[] }, any>(
        `/customdatatype/${parentUuid}/handlers${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  locationattributetype = {
    /**
     * @tags locationattributetype
     * @name getAllLocationAttributeTypes
     * @summary Fetch all non-retired locationattributetype resources or perform search
     * @request GET:/locationattributetype
     * @description All search parameters are optional
     */
    getAllLocationAttributeTypes: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/locationattributetype${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags locationattributetype
     * @name createLocationAttributeType
     * @summary Create with properties in request
     * @request POST:/locationattributetype
     */
    createLocationAttributeType: (
      resource: LocationattributetypeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/locationattributetype`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags locationattributetype
     * @name getLocationAttributeType
     * @summary Fetch by uuid
     * @request GET:/locationattributetype/{uuid}
     */
    getLocationAttributeType: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<LocationattributetypeGet, any>(
        `/locationattributetype/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags locationattributetype
     * @name updateLocationAttributeType
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/locationattributetype/{uuid}
     */
    updateLocationAttributeType: (
      uuid: string,
      resource: LocationattributetypeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/locationattributetype/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags locationattributetype
     * @name deleteLocationAttributeType
     * @summary Delete or purge resource by uuid
     * @request DELETE:/locationattributetype/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteLocationAttributeType: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/locationattributetype/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  privilege = {
    /**
     * @tags privilege
     * @name getAllPrivileges
     * @summary Fetch all non-retired privilege resources or perform search
     * @request GET:/privilege
     * @description All search parameters are optional
     */
    getAllPrivileges: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/privilege${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags privilege
     * @name createPrivilege
     * @summary Create with properties in request
     * @request POST:/privilege
     */
    createPrivilege: (resource: PrivilegeCreate, params?: RequestParams) =>
      this.request<any, any>(`/privilege`, "POST", params, resource),

    /**
     * @tags privilege
     * @name getPrivilege
     * @summary Fetch by uuid
     * @request GET:/privilege/{uuid}
     */
    getPrivilege: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<PrivilegeGet, any>(
        `/privilege/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags privilege
     * @name updatePrivilege
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/privilege/{uuid}
     */
    updatePrivilege: (
      uuid: string,
      resource: PrivilegeUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/privilege/${uuid}`, "POST", params, resource),

    /**
     * @tags privilege
     * @name deletePrivilege
     * @summary Delete or purge resource by uuid
     * @request DELETE:/privilege/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deletePrivilege: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/privilege/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  relationship = {
    /**
     * @tags relationship
     * @name getAllRelationships
     * @summary Fetch all non-retired relationship resources or perform search
     * @request GET:/relationship
     * @description All search parameters are optional
     */
    getAllRelationships: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        personB?: string;
        personA?: string;
        person?: string;
        relation?: string;
        relatedPerson?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/relationship${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags relationship
     * @name createRelationship
     * @summary Create with properties in request
     * @request POST:/relationship
     */
    createRelationship: (
      resource: RelationshipCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/relationship`, "POST", params, resource),

    /**
     * @tags relationship
     * @name getRelationship
     * @summary Fetch by uuid
     * @request GET:/relationship/{uuid}
     */
    getRelationship: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<RelationshipGet, any>(
        `/relationship/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags relationship
     * @name updateRelationship
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/relationship/{uuid}
     */
    updateRelationship: (
      uuid: string,
      resource: RelationshipUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(`/relationship/${uuid}`, "POST", params, resource),

    /**
     * @tags relationship
     * @name deleteRelationship
     * @summary Delete or purge resource by uuid
     * @request DELETE:/relationship/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteRelationship: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/relationship/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  workflow = {
    /**
     * @tags workflow
     * @name getAllProgramWorkflows
     * @summary Search for workflow
     * @request GET:/workflow
     * @description At least one search parameter must be specified
     */
    getAllProgramWorkflows: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/workflow${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags workflow
     * @name createProgramWorkflow
     * @summary Create with properties in request
     * @request POST:/workflow
     */
    createProgramWorkflow: (resource: WorkflowCreate, params?: RequestParams) =>
      this.request<any, any>(`/workflow`, "POST", params, resource),

    /**
     * @tags workflow
     * @name getProgramWorkflow
     * @summary Fetch by uuid
     * @request GET:/workflow/{uuid}
     */
    getProgramWorkflow: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<WorkflowGet, any>(
        `/workflow/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags workflow
     * @name updateProgramWorkflow
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/workflow/{uuid}
     */
    updateProgramWorkflow: (
      uuid: string,
      resource: WorkflowUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/workflow/${uuid}`, "POST", params, resource),

    /**
     * @tags workflow
     * @name deleteProgramWorkflow
     * @summary Delete or purge resource by uuid
     * @request DELETE:/workflow/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteProgramWorkflow: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/workflow/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags workflow
     * @name getAllProgramWorkflowStates
     * @summary Fetch all non-retired state subresources
     * @request GET:/workflow/{parentUuid}/state
     */
    getAllProgramWorkflowStates: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: WorkflowStateGet[] }, any>(
        `/workflow/${parentUuid}/state${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags workflow
     * @name createProgramWorkflowState
     * @summary Create state subresource with properties in request
     * @request POST:/workflow/{parentUuid}/state
     */
    createProgramWorkflowState: (
      parentUuid: string,
      resource: WorkflowStateCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/workflow/${parentUuid}/state`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags workflow
     * @name getProgramWorkflowState
     * @summary Fetch state subresources by uuid
     * @request GET:/workflow/{parentUuid}/state/{uuid}
     */
    getProgramWorkflowState: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<WorkflowStateGet, any>(
        `/workflow/${parentUuid}/state/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags workflow
     * @name deleteProgramWorkflowState
     * @summary Delete or purge resource by uuid
     * @request DELETE:/workflow/{parentUuid}/state/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteProgramWorkflowState: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/workflow/${parentUuid}/state/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  conceptreferencetermmap = {
    /**
     * @tags conceptreferencetermmap
     * @name getAllConceptReferenceTermMaps
     * @summary Search for conceptreferencetermmap
     * @request GET:/conceptreferencetermmap
     * @description At least one search parameter must be specified
     */
    getAllConceptReferenceTermMaps: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
        maps?: string;
        termB?: string;
        termA?: string;
        maptype?: string;
        to?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/conceptreferencetermmap${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptreferencetermmap
     * @name createConceptReferenceTermMap
     * @summary Create with properties in request
     * @request POST:/conceptreferencetermmap
     */
    createConceptReferenceTermMap: (
      resource: ConceptreferencetermmapCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptreferencetermmap`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags conceptreferencetermmap
     * @name getConceptReferenceTermMap
     * @summary Fetch by uuid
     * @request GET:/conceptreferencetermmap/{uuid}
     */
    getConceptReferenceTermMap: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptreferencetermmapGet, any>(
        `/conceptreferencetermmap/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags conceptreferencetermmap
     * @name updateConceptReferenceTermMap
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/conceptreferencetermmap/{uuid}
     */
    updateConceptReferenceTermMap: (
      uuid: string,
      resource: ConceptreferencetermmapUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptreferencetermmap/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags conceptreferencetermmap
     * @name deleteConceptReferenceTermMap
     * @summary Delete or purge resource by uuid
     * @request DELETE:/conceptreferencetermmap/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptReferenceTermMap: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/conceptreferencetermmap/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  systemsetting = {
    /**
     * @tags systemsetting
     * @name getAllSystemSettings
     * @summary Fetch all non-retired systemsetting resources or perform search
     * @request GET:/systemsetting
     * @description All search parameters are optional
     */
    getAllSystemSettings: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/systemsetting${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags systemsetting
     * @name createSystemSetting
     * @summary Create with properties in request
     * @request POST:/systemsetting
     */
    createSystemSetting: (
      resource: SystemsettingCreate,
      params?: RequestParams
    ) => this.request<any, any>(`/systemsetting`, "POST", params, resource),

    /**
     * @tags systemsetting
     * @name getSystemSetting
     * @summary Fetch by uuid
     * @request GET:/systemsetting/{uuid}
     */
    getSystemSetting: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<SystemsettingGet, any>(
        `/systemsetting/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags systemsetting
     * @name updateSystemSetting
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/systemsetting/{uuid}
     */
    updateSystemSetting: (
      uuid: string,
      resource: SystemsettingUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/systemsetting/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags systemsetting
     * @name deleteSystemSetting
     * @summary Delete or purge resource by uuid
     * @request DELETE:/systemsetting/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteSystemSetting: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/systemsetting/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  extension = {
    /**
     * @tags extension
     * @name getAllExtensions
     * @summary Search for extension
     * @request GET:/extension
     * @description At least one search parameter must be specified
     */
    getAllExtensions: (
      query: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/extension${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags extension
     * @name getExtension
     * @summary Fetch by uuid
     * @request GET:/extension/{uuid}
     */
    getExtension: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ExtensionGet, any>(
        `/extension/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  app = {
    /**
     * @tags app
     * @name getAllApps
     * @summary Fetch all non-retired
     * @request GET:/app
     */
    getAllApps: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/app${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags app
     * @name getApp
     * @summary Fetch by uuid
     * @request GET:/app/{uuid}
     */
    getApp: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<AppGet, any>(
        `/app/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  role = {
    /**
     * @tags role
     * @name getAllRoles
     * @summary Fetch all non-retired role resources or perform search
     * @request GET:/role
     * @description All search parameters are optional
     */
    getAllRoles: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
        q?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/role${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags role
     * @name createRole
     * @summary Create with properties in request
     * @request POST:/role
     */
    createRole: (resource: RoleCreate, params?: RequestParams) =>
      this.request<any, any>(`/role`, "POST", params, resource),

    /**
     * @tags role
     * @name getRole
     * @summary Fetch by uuid
     * @request GET:/role/{uuid}
     */
    getRole: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<RoleGet, any>(
        `/role/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags role
     * @name updateRole
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/role/{uuid}
     */
    updateRole: (uuid: string, resource: RoleUpdate, params?: RequestParams) =>
      this.request<any, any>(`/role/${uuid}`, "POST", params, resource),

    /**
     * @tags role
     * @name deleteRole
     * @summary Delete or purge resource by uuid
     * @request DELETE:/role/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteRole: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/role/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
  concept = {
    /**
     * @tags concept
     * @name getAllConcepts
     * @summary Fetch all non-retired concept resources or perform search
     * @request GET:/concept
     * @description All search parameters are optional
     */
    getAllConcepts: (
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom" | string;
        q?: string;
        code?: string;
        searchType?: string;
        name?: string;
        term?: string;
        source?: string;
        class?: string;
      },
      params?: RequestParams
    ) =>
      this.request<FetchAll, any>(
        `/concept${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags concept
     * @name createConcept
     * @summary Create with properties in request
     * @request POST:/concept
     */
    createConcept: (resource: ConceptCreate, params?: RequestParams) =>
      this.request<any, any>(`/concept`, "POST", params, resource),

    /**
     * @tags concept
     * @name getConcept
     * @summary Fetch by uuid
     * @request GET:/concept/{uuid}
     */
    getConcept: (
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptGet, any>(
        `/concept/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags concept
     * @name updateConcept
     * @summary Edit with given uuid, only modifying properties in request
     * @request POST:/concept/{uuid}
     */
    updateConcept: (
      uuid: string,
      resource: ConceptUpdate,
      params?: RequestParams
    ) => this.request<any, any>(`/concept/${uuid}`, "POST", params, resource),

    /**
     * @tags concept
     * @name deleteConcept
     * @summary Delete or purge resource by uuid
     * @request DELETE:/concept/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConcept: (
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags concept
     * @name getAllConceptDescriptions
     * @summary Fetch all non-retired description subresources
     * @request GET:/concept/{parentUuid}/description
     */
    getAllConceptDescriptions: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: ConceptDescriptionGet[] }, any>(
        `/concept/${parentUuid}/description${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags concept
     * @name createConceptDescription
     * @summary Create description subresource with properties in request
     * @request POST:/concept/{parentUuid}/description
     */
    createConceptDescription: (
      parentUuid: string,
      resource: ConceptDescriptionCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/description`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags concept
     * @name getConceptDescription
     * @summary Fetch description subresources by uuid
     * @request GET:/concept/{parentUuid}/description/{uuid}
     */
    getConceptDescription: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptDescriptionGet, any>(
        `/concept/${parentUuid}/description/${uuid}${this.addQueryParams(
          query
        )}`,
        "GET",
        params
      ),

    /**
     * @tags concept
     * @name updateConceptDescription
     * @summary edit description subresource with given uuid, only modifying properties in request
     * @request POST:/concept/{parentUuid}/description/{uuid}
     */
    updateConceptDescription: (
      parentUuid: string,
      uuid: string,
      resource: ConceptDescriptionUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/description/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags concept
     * @name deleteConceptDescription
     * @summary Delete or purge resource by uuid
     * @request DELETE:/concept/{parentUuid}/description/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptDescription: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/description/${uuid}${this.addQueryParams(
          query
        )}`,
        "DELETE",
        params
      ),

    /**
     * @tags concept
     * @name getAllConceptAttributes
     * @summary Fetch all non-retired attribute subresources
     * @request GET:/concept/{parentUuid}/attribute
     */
    getAllConceptAttributes: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: ConceptAttributeGet[] }, any>(
        `/concept/${parentUuid}/attribute${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags concept
     * @name createConceptAttribute
     * @summary Create attribute subresource with properties in request
     * @request POST:/concept/{parentUuid}/attribute
     */
    createConceptAttribute: (
      parentUuid: string,
      resource: ConceptAttributeCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/attribute`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags concept
     * @name getConceptAttribute
     * @summary Fetch attribute subresources by uuid
     * @request GET:/concept/{parentUuid}/attribute/{uuid}
     */
    getConceptAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptAttributeGet, any>(
        `/concept/${parentUuid}/attribute/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags concept
     * @name updateConceptAttribute
     * @summary edit attribute subresource with given uuid, only modifying properties in request
     * @request POST:/concept/{parentUuid}/attribute/{uuid}
     */
    updateConceptAttribute: (
      parentUuid: string,
      uuid: string,
      resource: ConceptAttributeUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/attribute/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags concept
     * @name deleteConceptAttribute
     * @summary Delete or purge resource by uuid
     * @request DELETE:/concept/{parentUuid}/attribute/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptAttribute: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/attribute/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags concept
     * @name getAllConceptNames
     * @summary Fetch all non-retired name subresources
     * @request GET:/concept/{parentUuid}/name
     */
    getAllConceptNames: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: ConceptNameGet[] }, any>(
        `/concept/${parentUuid}/name${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags concept
     * @name createConceptName
     * @summary Create name subresource with properties in request
     * @request POST:/concept/{parentUuid}/name
     */
    createConceptName: (
      parentUuid: string,
      resource: ConceptNameCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/name`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags concept
     * @name getConceptName
     * @summary Fetch name subresources by uuid
     * @request GET:/concept/{parentUuid}/name/{uuid}
     */
    getConceptName: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptNameGet, any>(
        `/concept/${parentUuid}/name/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags concept
     * @name updateConceptName
     * @summary edit name subresource with given uuid, only modifying properties in request
     * @request POST:/concept/{parentUuid}/name/{uuid}
     */
    updateConceptName: (
      parentUuid: string,
      uuid: string,
      resource: ConceptNameUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/name/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags concept
     * @name deleteConceptName
     * @summary Delete or purge resource by uuid
     * @request DELETE:/concept/{parentUuid}/name/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptName: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/name/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags concept
     * @name getAllConceptMaps
     * @summary Fetch all non-retired mapping subresources
     * @request GET:/concept/{parentUuid}/mapping
     */
    getAllConceptMaps: (
      parentUuid: string,
      query?: {
        limit?: number;
        startIndex?: number;
        v?: "ref" | "default" | "full" | "custom";
      },
      params?: RequestParams
    ) =>
      this.request<{ results?: ConceptMappingGet[] }, any>(
        `/concept/${parentUuid}/mapping${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags concept
     * @name createConceptMap
     * @summary Create mapping subresource with properties in request
     * @request POST:/concept/{parentUuid}/mapping
     */
    createConceptMap: (
      parentUuid: string,
      resource: ConceptMappingCreate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/mapping`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags concept
     * @name getConceptMap
     * @summary Fetch mapping subresources by uuid
     * @request GET:/concept/{parentUuid}/mapping/{uuid}
     */
    getConceptMap: (
      parentUuid: string,
      uuid: string,
      query?: { v?: "ref" | "default" | "full" | "custom" },
      params?: RequestParams
    ) =>
      this.request<ConceptMappingGet, any>(
        `/concept/${parentUuid}/mapping/${uuid}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags concept
     * @name updateConceptMap
     * @summary edit mapping subresource with given uuid, only modifying properties in request
     * @request POST:/concept/{parentUuid}/mapping/{uuid}
     */
    updateConceptMap: (
      parentUuid: string,
      uuid: string,
      resource: ConceptMappingUpdate,
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/mapping/${uuid}`,
        "POST",
        params,
        resource
      ),

    /**
     * @tags concept
     * @name deleteConceptMap
     * @summary Delete or purge resource by uuid
     * @request DELETE:/concept/{parentUuid}/mapping/{uuid}
     * @description The resource will be voided/retired unless purge = 'true'
     */
    deleteConceptMap: (
      parentUuid: string,
      uuid: string,
      query?: { purge?: boolean },
      params?: RequestParams
    ) =>
      this.request<any, any>(
        `/concept/${parentUuid}/mapping/${uuid}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),
  };
}
