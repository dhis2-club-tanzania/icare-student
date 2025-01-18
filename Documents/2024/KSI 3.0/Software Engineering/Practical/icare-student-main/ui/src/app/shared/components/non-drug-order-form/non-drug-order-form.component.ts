import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormValue } from "../../modules/form/models/form-value.model";
import { TextArea } from "../../modules/form/models/text-area.model";
import { Textbox } from "../../modules/form/models/text-box.model";

@Component({
  selector: "app-non-drug-order-form",
  templateUrl: "./non-drug-order-form.component.html",
  styleUrls: ["./non-drug-order-form.component.scss"],
})
export class NonDrugOrderFormComponent implements OnInit {
  @Input() nonDrug: any;
  @Input() forRemarks: boolean;
  formField: any;
  @Output() formData: EventEmitter<FormValue> = new EventEmitter<FormValue>();
  constructor() {}

  ngOnInit(): void {
    this.formField = !this.forRemarks
      ? new Textbox({
          id: this.nonDrug?.uuid,
          key: this.nonDrug?.uuid,
          label: "Quantity",
          required: true,
          type: "number",
        })
      : new TextArea({
          id: this.nonDrug?.uuid + "-remarks",
          key: this.nonDrug?.uuid + "-remarks",
          label: "Remarks/instructions",
          required: false,
        });
  }

  onFormUpdate(formValue: FormValue): void {
    this.formData.emit(formValue);
  }
}
