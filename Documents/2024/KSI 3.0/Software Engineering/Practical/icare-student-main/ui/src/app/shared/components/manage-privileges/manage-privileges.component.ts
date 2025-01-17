import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormValue } from "../../modules/form/models/form-value.model";
import { TextArea } from "../../modules/form/models/text-area.model";
import { Textbox } from "../../modules/form/models/text-box.model";
import { PrivilegesAndRolesService } from "../../services/privileges-and-roles.service";

@Component({
  selector: "app-manage-privileges",
  templateUrl: "./manage-privileges.component.html",
  styleUrls: ["./manage-privileges.component.scss"],
})
export class ManagePrivilegesComponent implements OnInit {
  dialogData: any;
  isFormValid: boolean = false;

  formFields: any[];
  formValues: any = {};

  saving: boolean = false;
  message: string;
  constructor(
    private dialogRef: MatDialogRef<ManagePrivilegesComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private privilegesAndRolesService: PrivilegesAndRolesService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.formFields = [
      new Textbox({
        id: "name",
        key: "name",
        label: "Name",
        placeholder: "Name",
        required: true,
      }),
      new TextArea({
        id: "description",
        key: "description",
        label: "Description",
        placeholder: "Description",
        required: true,
      }),
    ];
  }

  onFormUpdate(formValues: FormValue): void {
    this.isFormValid = formValues.isValid;
    this.formValues = formValues.getValues();
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    const privilege = {
      name: this.formValues["name"]?.value,
      description: this.formValues["description"]?.value,
    };
    this.privilegesAndRolesService
      .addNewPrivilege(privilege)
      .subscribe((response: any) => {
        if (response && !response?.error) {
          this.saving = false;
          this.message = null;
          this.dialogRef.close(true);
        } else {
          this.saving = false;
          this.message = response?.error?.message;
        }
      });
  }
}
