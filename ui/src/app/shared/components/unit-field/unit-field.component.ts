import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { Dropdown } from "../../modules/form/models/dropdown.model";

@Component({
  selector: "app-unit-field",
  templateUrl: "./unit-field.component.html",
  styleUrls: ["./unit-field.component.scss"],
})
export class UnitFieldComponent implements OnInit {
  @Input() dosingUnits: any;
  @Input() durationUnits: any;
  @Input() drugRoutes: any;
  @Input() dosingFrequencies: any;

  @Output() formUpdate = new EventEmitter();
  unitField: Dropdown;

  constructor() {}

  ngOnInit(): void {
    if (this.dosingUnits) {
      this.unitField = new Dropdown({
        id: "dosingUnit",
        key: "dosingUnit",
        label: `Dose Unit`,
        conceptClass: this.dosingUnits?.conceptClass?.display,
        value: null,
        required: true,
        options: this.dosingUnits?.answers?.map((answer) => {
          return {
            key: answer?.uuid,
            value: answer?.uuid,
            label: answer?.display,
          };
        }),
      });
    }

    if (this.dosingFrequencies) {
      this.unitField = new Dropdown({
        id: "frequency",
        key: "frequency",
        label: `Dosing frequency`,
        required: true,
        conceptClass: this.dosingFrequencies?.conceptClass?.display,
        value: null,
        options: this.dosingFrequencies?.answers?.map((answer) => {
          return {
            key: answer?.uuid,
            value: answer?.uuid,
            label: answer?.display,
          };
        }),
      });
    }

    if (this.durationUnits) {
      this.unitField = new Dropdown({
        id: "durationUnit",
        key: "durationUnit",
        label: `Duration Unit`,
        conceptClass: this.durationUnits?.conceptClass?.display,
        value: null,
        options: this.durationUnits?.answers?.map((answer) => {
          return {
            key: answer?.uuid,
            value: answer?.uuid,
            label: answer?.display,
          };
        }),
      });
    }

    if (this.drugRoutes) {
      this.unitField = new Dropdown({
        id: "route",
        key: "route",
        label: `Drug route`,
        conceptClass: this.drugRoutes?.conceptClass?.display,
        value: null,
        options: this.drugRoutes?.setMembers?.map((member) => {
          return {
            key: member?.uuid,
            value: member?.uuid,
            label: member?.display,
          };
        }),
      });
    }
  }

  onFormUpdate(e: any) {
    this.formUpdate.emit(e);
  }
}
