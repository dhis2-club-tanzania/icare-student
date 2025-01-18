import * as _ from "lodash";
import * as moment from "moment";
import { PatientGetFull } from "../../openmrs";

enum GenderType {
  M = "Male",
  F = "Female",
}
export class Patient {
  // TODO: Need to find best way to type incoming patient
  constructor(private patient: any) {}

  get id(): string {
    return this.patient?.uuid;
  }

  get personUuid(): string {
    return this.patient?.person.uuid;
  }

  get identifier(): string {
    return (this.patient?.identifiers || [])[0]?.display;
  }

  get MRN(): string {
    return (_.filter(this.patient?.identifiers || []),
    (id) => {
      return id?.identifierType?.display == "MRN";
    })[0]?.identifier;
  }

  get name(): string {
    return this.patient?.person?.display;
  }

  get fname(): string {
    return this.patient?.person?.preferredName?.givenName;
  }

  get lname(): string {
    return this.patient?.person?.preferredName?.familyName;
  }

  get dob(): string {
    return this.patient?.person?.birthdate;
  }

  get birthplace(): any {
    return this.getAttributeByTypeName("birthplace");
  }

  get age(): string {
    return moment(new Date(this.dob)).toNow(true);
  }

  get gender(): string {
    return GenderType[this.patient?.person?.gender];
  }

  get patientFull(): PatientGetFull {
    return this.patient;
  }

  get kinLName(): any {
    return this.getAttributeByTypeName("kinLName");
  }

  get kinFname(): any {
    return this.getAttributeByTypeName("kinFname");
  }

  get kinPhone(): any {
    return this.getAttributeByTypeName("kinPhone");
  }

  get kinRelationship(): any {
    return this.getAttributeByTypeName("kinRelationship");
  }

  get phone(): any {
    return this.getAttributeByTypeName("phone");
  }

  get isNew(): any {
    return this.getAttributeByTypeName("newPatient");
  }

  get relationshipType(): any {
    return this.getAttributeByTypeName("RelationshipType");
  }

  get relatedPersonId(): any {
    return this.getAttributeByTypeName("Id");
  }

  get fileNo(): any {
    return this.getAttributeByTypeName("fileNo");
  }

  get tribe(): any {
    return this.getAttributeByTypeName("tribe");
  }

  get maritalStatus(): any {
    return this.getAttributeByTypeName("maritalStatus");
  }

  get religion(): any {
    return this.getAttributeByTypeName("religion");
  }

  get areaLeaderNumber(): any {
    return this.getAttributeByTypeName("areaLeaderNumber");
  }

  get areaLeader(): any {
    return this.getAttributeByTypeName("areaLeader");
  }

  get education(): any {
    return this.getAttributeByTypeName("education");
  }

  get occupation(): any {
    return this.getAttributeByTypeName("occupation");
  }
  get mname(): any {
    return this.getAttributeByTypeName("mname");
  }

  get gothomisMRN(): any {
    return this.getAttributeByTypeName("GoTHOMIS");
  }

  get noneMandatoryIdentity(): any {
    return null;
  }

  get phoneNumber(): string {
    let phoneNumber = "";
    const attributes = this.patient?.attributes || [];
    if (attributes.length > 0) {
      const numbersObjectArray = _.filter(attributes, (attribute) => {
        return attribute.attributeType &&
          attribute.attributeType.name &&
          attribute.attributeType.name === "Telephone Number"
          ? true
          : false;
      });

      if (numbersObjectArray.length > 0) {
        phoneNumber = numbersObjectArray[0].value;
      }
    }
    return phoneNumber;
  }

  get cityVillage(): string {
    return this.patient?.person?.preferredAddress?.cityVillage;
  }

  get council(): string {
    return this.patient?.person?.preferredAddress?.address1;
  }

  get district(): string {
    return this.patient?.person?.preferredAddress?.address2;
  }

  get region(): string {
    return this.patient?.person?.preferredAddress?.address3;
  }
  get street(): string {
    return this.patient?.person?.preferredAddress?.cityVillage;
  }

  getAttributeByTypeName(name): any {
    let attributeObject = _.filter(
      this.patient?.person?.attributes,
      (attribute) => {
        return attribute?.attributeType?.display
          .toLowerCase()
          .indexOf(name.toLowerCase()) === 0
          ? true
          : false;
      }
    )[0];

    return attributeObject && attributeObject?.display.split("= ")?.length > 1
      ? attributeObject?.display.split("= ")[1]
      : "";
  }
}
