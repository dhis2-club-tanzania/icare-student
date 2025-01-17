import { Component, Input, OnInit } from "@angular/core";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-parameter-configuration-form",
  templateUrl: "./parameter-configuration-form.component.html",
  styleUrls: ["./parameter-configuration-form.component.scss"],
})
export class ParameterConfigurationFormComponent implements OnInit {
  @Input() parameter: any;
  @Input() parametersConfigurations: any;
  formField: any;
  constructor() {}

  ngOnInit(): void {
    this.createFormField(this.parametersConfigurations);
  }

  createFormField(data?: any): void {
    this.formField = new Textbox({
      id: this.parameter?.id,
      key: this.parameter?.id,
      label: this.parameter?.name,
      required: true,
    });
  }

  onFormUpdate(formValue: FormValue): void {
    console.log(formValue.getValues());
  }
}
