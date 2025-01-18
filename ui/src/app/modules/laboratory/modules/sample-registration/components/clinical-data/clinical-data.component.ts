import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-clinical-data",
  templateUrl: "./clinical-data.component.html",
  styleUrls: ["./clinical-data.component.scss"],
})
export class ClinicalDataComponent implements OnInit {
  clinicalFormFields: any[] = [];
  @Input() clinicalFields: any;
  @Output() clinicalDataValues: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.clinicalFormFields = Object.keys(this.clinicalFields)
      .map((key) => {
        return this.clinicalFields[key];
      });

  }

  onFormUpdate(formValues: FormValue): void {
    this.clinicalDataValues.emit(formValues.getValues());
  }
}
