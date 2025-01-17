import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { ProviderAttributeModel } from "../../models/provider-attribute.model";

@Component({
  selector: "app-provider-attributes-form",
  templateUrl: "./provider-attributes-form.component.html",
  styleUrls: ["./provider-attributes-form.component.scss"],
})
export class ProviderAttributesFormComponent implements OnInit {
  @Input() providerAttributes: ProviderAttributeModel[];
  attributesFormFields: any[] = [];
  @Output() formFieldValues: EventEmitter<any> = new EventEmitter<any>();
  @Output() isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {
    // TODO: Add support on forms module to capture signature
    this.attributesFormFields = this.providerAttributes
      .map((providerAttribute) => {
        if (
          providerAttribute?.name?.toLocaleLowerCase().indexOf("signature") ===
          -1
        ) {
          return {
            id: providerAttribute?.uuid,
            key: providerAttribute?.uuid,
            label: providerAttribute?.name,
            name: providerAttribute?.name,
            controlType: "textbox",
            type: "text",
            required: true,
            conceptClass: "none",
            shouldHaveLiveSearchForDropDownFields: false,
          };
        }
      })
      .filter((formField) => formField);
  }

  onFormUpdate(formResponse: FormValue): void {
    console.log(formResponse.getValues());
    this.formFieldValues.emit(formResponse.getValues());
    this.isFormValid.emit(formResponse.isValid);
  }
}
