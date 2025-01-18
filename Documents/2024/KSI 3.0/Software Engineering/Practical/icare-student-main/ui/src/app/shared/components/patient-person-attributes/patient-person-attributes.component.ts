import { Component, Input, OnInit } from "@angular/core";
import { capitalize } from "lodash";

@Component({
  selector: "app-patient-person-attributes",
  templateUrl: "./patient-person-attributes.component.html",
  styleUrls: ["./patient-person-attributes.component.scss"],
})
export class PatientPersonAttributesComponent implements OnInit {
  @Input() attributes: any[];
  constructor() {}

  ngOnInit(): void {
    this.attributes = this.attributes.map((attribute) => {
      return {
        ...attribute,
        key: attribute?.display.split(" = ")[0]
          ? capitalize(attribute?.display.split(" = ")[0])
          : null,
        value: attribute?.display.split(" = ")[1]
          ? attribute?.display.split(" = ")[1]
          : null,
      };
    });
  }
}
