import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormValue } from "../../modules/form/models/form-value.model";

@Component({
  selector: "app-add-procedure-form",
  templateUrl: "./add-procedure-form.component.html",
  styleUrls: ["./add-procedure-form.component.scss"],
})
export class AddProcedureFormComponent implements OnInit {
  @Input() proceduresDetails: any;
  formFields: any = [];
  @Output() procedures: EventEmitter<any> = new EventEmitter<any>();
  @Output() isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {
    this.formFields = [
      {
        id: "procedure",
        key: "procedure",
        label: "Procedure",
        name: "Procedure",
        controlType: "dropdown",
        type: "text",
        options: this.proceduresDetails.map((procedure) => {
          return {
            ...procedure,
            key: procedure?.display,
            name: procedure?.display,
          };
        }),
        required: true,
        conceptClass: "procedure",
        searchControlType: "searchFromOptions",
        shouldHaveLiveSearchForDropDownFields: true,
      },
      {
        id: "remarks",
        key: "remarks",
        label: "Remarks / Instructions",
        name: "Remarks / Instructions",
        controlType: "textbox",
        type: "textarea",
      },
    ];
  }

  onFormUpdate(formValues: FormValue): void {
    this.procedures.emit(formValues.getValues());
    this.isFormValid.emit(formValues.isValid);
  }
}
