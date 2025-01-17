import { Pipe, PipeTransform } from "@angular/core";
import { keyBy } from "lodash";
import { Dropdown } from "../modules/form/models/dropdown.model";
import { Textbox } from "../modules/form/models/text-box.model";

@Pipe({
  name: "createLabFields",
})
export class CreateLabFieldsPipe implements PipeTransform {
  transform(allRegistrationFields: any, ...args: any[]): any {
      if(allRegistrationFields && args.length > 0){
        let fields = {
          ...allRegistrationFields,
          specimenDetailFields: {
            ...allRegistrationFields.specimenDetailFields,
            // agency: new Dropdown({
            //   id: "agency",
            //   key: "agency",
            //   label: "Urgency/Priority",
            //   options: args[1]?.setMembers.map((member) => {
            //     return {
            //       key: member?.uuid,
            //       value: member?.display,
            //       label: member?.display,
            //       name: member?.display,
            //     };
            //   }),
            //   shouldHaveLiveSearchForDropDownFields: false,
            // }),
          },
          referringDoctorFields: keyBy(
            args[0]?.map((attribute) => {
              return new Textbox({
                id: "attribute-" + attribute?.value,
                key: "attribute-" + attribute?.value,
                label: attribute?.name,
                type: "text",
              });
            }),
            "id"
          ),
          personFields: {
            ...allRegistrationFields.personFields,
            ["attribute-" + args[2]]: new Dropdown({
              id: "attribute-" + args[2],
              key: "attribute-" + args[2],
              options: [],
              label: "Facility Name",
              shouldHaveLiveSearchForDropDownFields: true,
              searchControlType: "healthFacility",
              searchTerm: "Health Facility",
              controlType: "location",
            }),
          },
          primaryIdentifierFields: keyBy(
            args[3]
              ?.filter(
                (identifier) => identifier?.uniquenessBehavior === "UNIQUE"
              )
              ?.map((primaryIdentifier) => {
                return new Textbox({
                  id: primaryIdentifier?.id,
                  key: primaryIdentifier?.id,
                  label: primaryIdentifier?.name,
                  required: primaryIdentifier?.required,
                });
              }),
            "id"
          ),
          otherIdentifiersFields: keyBy(
            (args[3]?.filter((identifier) => !identifier?.required) || [])?.map((identifier) => {
                return new Textbox({
                  id: identifier?.id,
                  key: identifier?.id,
                  label: identifier?.name,
                  required: identifier?.required,
                });
              }),
            "id"
          ),
        };
          return fields;
      } else {
        return allRegistrationFields;
      }
    }
}
