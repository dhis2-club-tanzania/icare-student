import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Field } from "../../modules/form/models/field.model";
import { FormValue } from "../../modules/form/models/form-value.model";
import { Textbox } from "../../modules/form/models/text-box.model";

@Component({
  selector: "app-shared-user-profile-management",
  templateUrl: "./shared-user-profile-management.component.html",
  styleUrls: ["./shared-user-profile-management.component.scss"],
})
export class SharedUserProfileManagementComponent implements OnInit {
  @Input() currentUser: any;
  externalSystemCreadentialsFormFields: Field<string>[];
  @Output() isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() userPropertiesToSave: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.externalSystemCreadentialsFormFields = [
      new Textbox({
        id: "username",
        key: "username",
        label: "PimaCOVID username",
        type: "text",
        value: this.currentUser?.userProperties?.pimaCOVIDUsername,
        required: true,
      }),
      new Textbox({
        id: "password",
        key: "password",
        label: "Password",
        type: "password",
        value: this.currentUser?.userProperties?.pimaCOVIDPassword,
        required: true,
      }),
    ];
  }

  onFormUpdate(formValue: FormValue): void {
    const values = formValue.getValues();
    this.isFormValid.emit(formValue.isValid);
    this.userPropertiesToSave.emit({
      username: values?.username?.value,
      password: values?.password?.value,
    });
  }
}
