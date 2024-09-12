import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PersonattributetypeGetFull } from "../../resources/openmrs";
import { Textbox } from "../../modules/form/models/text-box.model";
import { FormValue } from "../../modules/form/models/form-value.model";

@Component({
  selector: "app-shared-next-of-kins-form-data",
  templateUrl: "./shared-next-of-kins-form-data.component.html",
  styleUrls: ["./shared-next-of-kins-form-data.component.scss"],
})
export class SharedNextOfKinsFormDataComponent implements OnInit {
  @Input() personAttributeTypes: PersonattributetypeGetFull[];
  formFields: any[];
  @Output() nextOfKinsData: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.formFields = this.personAttributeTypes?.map(
      (personAttributeType: PersonattributetypeGetFull) => {
        return new Textbox({
          id: personAttributeType?.uuid,
          key: personAttributeType?.uuid,
          label: personAttributeType?.display,
        });
      }
    );
  }

  onFormUpdate(formValue: FormValue): void {
    this.nextOfKinsData.emit({
      data: formValue.getValues(),
      isFormValid: formValue.isValid,
    });
  }
}
