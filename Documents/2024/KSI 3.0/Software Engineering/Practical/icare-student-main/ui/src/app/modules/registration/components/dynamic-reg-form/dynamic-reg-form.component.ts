import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ConceptGet, LocationGet } from "src/app/shared/resources/openmrs";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { result } from "cypress/types/lodash";
import * as _ from "lodash";

@Component({
  selector: "app-dynamic-reg-form",
  templateUrl: "./dynamic-reg-form.component.html",
  styleUrls: ["./dynamic-reg-form.component.scss"],
})
export class DynamicRegFormComponent implements OnInit {
  @Input() concepts?: ConceptGet[];
  @Input() locations?: LocationGet[];
  @Input() patientInformation?: any;
  @Input() editMode?: boolean;
  formFields: any[];
  valueSelected: any;
  attributeConceptMappingjson: any = [
    {
      attributeTypeUuid: "6c990333-aa2b-4778-846f-9ba6edfd3661",
    },
    {
      attributeTypeUuid: "0eeecb5a-b034-431f-98ec-d2b672719495",
      display: "maritalStatus = Married",
      conceptUuid: "f62b5605-1335-45e9-9574-9487e85b2820",
    },
    {
      attributeTypeUuid: "5549614f-7bc2-49d0-bd1d-94cbdbbd004b",
      conceptUuid: "",
    },
    {
      attributeTypeUuid: "9bd41adb-ee63-49f7-ac54-bb74a7ad8334",
      conceptUuid: "",
    },
    {
      attributeTypeUuid: "c38d5e55-7036-4b7a-8fc7-ad15e8c2d87a",
      display: "kinPhone = 0987654321",
      conceptUuid: "",
    },
    {
      attributeTypeUuid: "aeb3a16c-f5b6-4848-aa51-d7e3146886d6",
      display: "phone = 0987654321",
    },
    {
      attributeTypeUuid: "95f62fcb-6ce4-4578-a419-66c7d2ebfc40",
      display: "education = Secondary Education",
      conceptUuid: "79d20b25-42aa-42a7-a48e-8cd9a96c6064",
    },
    {
      attributeTypeUuid: "83ccb8b8-26cd-4405-aa76-3e159dbb9235",
      display: "areaLeader = Sangatiti",
      conceptUuid: "d45540bc-3270-41bc-ac62-0dacd63db22e",
    },
    {
      attributeTypeUuid: "4a2d8763-b591-498d-a554-bb9650d46cf7",
      display: "areaLeaderNumber = 0987654321",
      conceptUuid: "a8236b6a-86fa-45a2-82db-42b1fd42c477",
    },
    {
      attributeTypeUuid: "e9cceefa-dc4d-4877-9347-9bc9f8e1af5b",
      display: "religion = Muslim",
      conceptUuid: "e8a3910a-1751-4ae6-a904-3d4d539b5c18",
    },
    {
      attributeTypeUuid: "5c774ff9-7dfc-4c84-9509-e5332a1e48de",
      display: "RelationshipType = Spouse",
      conceptUuid: "a74b0803-0aae-43a7-84f9-2daa2cd19332",
    },
  ];

  @Output() selectedValue: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.formFields = this.concepts.map((concept) => {
      if (concept?.answers?.length > 0) {
        // console.log("==> answers: ", this.attributeConceptMapping);

        return new Dropdown({
          // shouldHaveLiveSearchForDropDownFields: true,

          id: concept?.uuid,
          key: concept?.uuid,
          label: concept?.display,
          placeholder: concept?.display,
          value: this.editMode
            ? this.attributeConceptMapping.filter((conceptmap) => {
                return conceptmap?.conceptUuid === concept?.uuid;
              })[0]?.value
            : null,
          // value: !this.editMode
          //   ? ""
          //   : this.attributeConceptMapping[concept?.uuid]?.value ||   "",
          options: concept?.answers?.map((answer: ConceptGet) => {
            return {
              key: answer?.uuid,
              value: answer?.display,
              label: answer?.display,
            };
          }),
        });
      } else {
        return new Textbox({
          id: concept?.uuid,
          key: concept?.uuid,
          label: concept?.display,
          placeholder: concept?.display,
          value: this.editMode
            ? this.attributeConceptMapping.filter((conceptmap) => {
                return conceptmap?.conceptUuid === concept?.uuid;
              })[0]?.value
            : null,
        });
      }
    });
  }

  onFormUpdate(formValue: FormValue): void {
    //console.log("this concepts--->",formValue.getValues())
    this.selectedValue.emit(formValue.getValues());
  }

  // ====== Get all the patient attribute uuids Keyed by======

  keyAttrsByAttrTypeUuid(): any {
    return this.patientInformation?.patient?.person?.attributes?.reduce(
      (attributes, attribute) => ({
        ...attributes,
        [attribute?.attributeType?.uuid]: attribute,
      }),
      []
    );
  }

  get attributeConceptMapping(): any {
    let keysByAttributeType = this.keyAttrsByAttrTypeUuid();
    return this.attributeConceptMappingjson.map((attribute) => {
      let attributeValue = keysByAttributeType[attribute.attributeTypeUuid];
      return {
        attributeType: attributeValue?.attributeType,
        conceptUuid: attribute?.conceptUuid ? attribute?.conceptUuid : "",
        value: attributeValue?.value,
      };
    });
    // return _.keyBy(
    //   this.attributeConceptMappingjson.map((attribute) => {
    //     let attributeValue = keysByAttributeType[attribute.attributeTypeUuid];
    //     return {
    //       attributeType: attributeValue?.attributeType,
    //       conceptUuid: attribute?.conceptUuid ? attribute?.conceptUuid : "",
    //       value: attributeValue?.value,
    //     };
    //   }),
    //   "conceptUuid"
    // );

    // return this.attributeConceptMappingjson.filter((element) =>
    //   this.patientInformation?.patient?.person?.attributes.map((answer) => {
    //     return { uuid: answer?.attributeType.uuid, value: answer?.display };
    //   })
    // );
    // .map((matched) => {
    //   return {
    //     attributeTypeUuid: matched.attributeTypeUuid,
    //     value: matched.value,
    //     display: matched.display,
    //     conceptUuid: matched.conceptUuid,
    //   };
    // });
  }
}
