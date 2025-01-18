import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { orderBy } from "lodash";
import { CheckBox } from "../../modules/form/models/check-box.model";
import { Dropdown } from "../../modules/form/models/dropdown.model";
import { Textbox } from "../../modules/form/models/text-box.model";
import { Boolean } from "../../modules/form/models/boolean.model";
import { TextArea } from "../../modules/form/models/text-area.model";

@Component({
  selector: "app-concepts-form",
  templateUrl: "./concepts-form.component.html",
  styleUrls: ["./concepts-form.component.scss"],
})
export class ConceptsFormComponent implements OnInit {
  @Input() conceptFields: any[];
  @Input() textfield: boolean;

  @Output() formUpdate = new EventEmitter();
  conceptFieldsMap: any[];

  constructor() {}

  ngOnInit(): void {
    // console.log("conceptFields::", this.conceptFields);
    if (this.conceptFields?.length > 0) {
      this.conceptFields = orderBy(this.conceptFields, ["order"], ["asc"]);
      this.conceptFieldsMap = this.conceptFields?.map((conceptField) => {
        // TODO: Handle min/max values for numeric fields
        if (
          conceptField?.setMembers?.length === 0 &&
          conceptField?.answers.length === 0 &&
          conceptField?.datatype?.display?.toLowerCase() === "numeric"
        ) {
          return new Textbox({
            id: conceptField?.uuid,
            key: conceptField?.uuid,
            label: conceptField?.display,
            required:
              conceptField?.display === "Dose" ||
              conceptField?.uuid === "frequency" ||
              conceptField?.uuid === "dosingUnit"
                ? true
                : false,
            conceptClass: conceptField?.conceptClass?.display,
            type: "number",
          });
        }
        if (
          conceptField?.setMembers?.length === 0 &&
          conceptField?.answers.length === 0 &&
          conceptField?.datatype?.display?.toLowerCase() === "text" &&
          !this.textfield
        ) {
          // TODO: Change hardcoded check to use configurable
          return new TextArea({
            id: conceptField?.uuid,
            key: conceptField?.uuid,
            label: conceptField?.display,
            required:
              conceptField?.display === "Dose" ||
              conceptField?.uuid === "frequency" ||
              conceptField?.uuid === "dosingUnit"
                ? true
                : false,
            conceptClass: conceptField?.conceptClass?.display,
            type: conceptField?.datatype?.display?.toLowerCase(),
          });
        }
        if (
          conceptField?.setMembers?.length === 0 &&
          conceptField?.answers.length === 0 &&
          conceptField?.datatype?.display?.toLowerCase() === "text" &&
          this.textfield
        ) {
          // TODO: Change hardcoded check to use configurable
          return new Textbox({
            id: conceptField?.uuid,
            key: conceptField?.uuid,
            label: conceptField?.display,
            required:
              conceptField?.display === "Dose" ||
              conceptField?.uuid === "frequency" ||
              conceptField?.uuid === "dosingUnit"
                ? true
                : false,
            conceptClass: conceptField?.conceptClass?.display,
            type: conceptField?.datatype?.display?.toLowerCase(),
          });
        }
        if (
          conceptField?.setMembers?.length === 0 &&
          conceptField?.answers.length === 0 &&
          conceptField?.datatype?.display?.toLowerCase() === "boolean"
        ) {
          return new Boolean({
            id: conceptField?.uuid,
            key: conceptField?.uuid,
            label: conceptField?.display,
            required: false,
            controlType: "boolean",
          });
        }
        if (
          conceptField?.setMembers?.length > 0 &&
          conceptField?.answers.length === 0
        ) {
          return new Dropdown({
            id: conceptField?.uuid,
            key: conceptField?.uuid,
            label: conceptField?.display,
            required:
              conceptField?.display === "Dose" ||
              conceptField?.uuid === "frequency" ||
              conceptField?.uuid === "dosingUnit"
                ? true
                : false,
            conceptClass: conceptField?.conceptClass?.display,
            value: null,
            options: conceptField?.setMembers?.map((member) => {
              return {
                key: member?.uuid,
                value: member?.uuid,
                label: member?.display,
              };
            }),
          });
        }
        if (
          conceptField?.answers.length > 0 &&
          conceptField?.datatype?.display?.toLowerCase() === "coded"
        ) {
          return new Dropdown({
            id: conceptField?.uuid,
            key: conceptField?.uuid,
            label: conceptField?.display,
            required:
              conceptField?.display === "Dose" ||
              conceptField?.uuid === "frequency" ||
              conceptField?.uuid === "dosingUnit"
                ? true
                : false,
            conceptClass: conceptField?.conceptClass?.display,
            value: null,
            options: conceptField?.answers?.map((answer) => {
              return {
                key: answer?.uuid,
                value: answer?.uuid,
                label: answer?.display,
              };
            }),
          });
        }
      });
    }
  }

  onFormUpdate(e: any) {
    this.formUpdate.emit(e);
  }
}
