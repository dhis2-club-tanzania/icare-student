import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-sample-label",
  templateUrl: "./sample-label.component.html",
  styleUrls: ["./sample-label.component.scss"],
})
export class SampleLabelComponent implements OnInit {
  @Input() label: string;
  @Output() sampleLabel: EventEmitter<string> = new EventEmitter<string>();
  labelField: any;
  constructor() {}

  ngOnInit(): void {
    const label = "LIS/TZ/" + this.label;
    this.labelField = new Textbox({
      value: label,
      key: "sampleLabel",
      label: "Sample ID",
      id: "sampleLabel",
      disabled: true,
      type: "text",
    });
    this.sampleLabel.emit(label);
  }

  onFormUpdate(formValues: FormValue): void {
    // console.log(formValues.getValues());
  }
}
