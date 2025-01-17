import { Component, Inject, OnInit } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { FormValue } from "../../modules/form/models/form-value.model";
import { TextArea } from "../../modules/form/models/text-area.model";
import { Textbox } from "../../modules/form/models/text-box.model";
import {
  PrivilegeGet,
  PrivilegeGetFull,
  RoleCreate,
  RoleGetFull,
} from "../../resources/openmrs";
import { PrivilegesAndRolesService } from "../../services/privileges-and-roles.service";

@Component({
  selector: "app-manage-roles",
  templateUrl: "./manage-roles.component.html",
  styleUrls: ["./manage-roles.component.scss"],
})
export class ManageRolesComponent implements OnInit {
  dialogData: any;
  isFormValid: boolean = false;

  formFields: any[];
  formValues: any = {};

  saving: boolean = false;
  message: string;

  privileges$: Observable<PrivilegeGetFull[]>;
  roles$: Observable<RoleGetFull[]>;
  privilegePage: number = 1;
  privilegePageSize: number = 10;

  rolePage: number = 1;
  rolePageSize: number = 10;

  selectedPrivileges: string[] = [];
  selectedRoles: string[] = [];
  constructor(
    private dialogRef: MatDialogRef<ManageRolesComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private privilegesAndRolesService: PrivilegesAndRolesService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.getPrivilegesList();
    this.getRolesList();
    this.formFields = [
      new Textbox({
        id: "name",
        key: "name",
        label: "Name",
        placeholder: "Name",
        value:
          this.dialogData?.role && this.dialogData?.role?.display
            ? this.dialogData?.role?.display
            : "",
        required: true,
      }),
      new TextArea({
        id: "description",
        key: "description",
        label: "Description",
        placeholder: "Description",
        value:
          this.dialogData?.role && this.dialogData?.role?.description
            ? this.dialogData?.role?.description
            : "",
        required: true,
      }),
    ];

    if (this.dialogData?.role?.uuid) {
      this.privilegesAndRolesService
        .getRoleById(this.dialogData?.role?.uuid)
        .subscribe((response) => {
          if (response) {
            this.selectedPrivileges =
              response?.privileges?.map((privilege) => privilege?.uuid) || [];
            this.selectedRoles =
              response?.inheritedRoles?.map(
                (inheritedRole) => inheritedRole?.uuid
              ) || [];
          }
        });
    }
  }

  getPrivilegesList(): void {
    this.privileges$ = this.privilegesAndRolesService.getPrivileges({
      limit: this.privilegePageSize,
      startIndex: (this.privilegePage - 1) * this.privilegePageSize,
    });
  }

  getRolesList(): void {
    this.roles$ = this.privilegesAndRolesService.getRoles({
      limit: this.rolePageSize,
      startIndex: (this.rolePage - 1) * this.rolePageSize,
    });
  }

  checkBoxSelectionChange(event: MatCheckboxChange, id: string): void {
    this.selectedPrivileges = event?.checked
      ? [...this.selectedPrivileges, id]
      : (this.selectedPrivileges || [])?.filter(
          (privilege) => privilege != id
        ) || [];
  }

  checkBoxForRolesSelectionChange(event: MatCheckboxChange, id: string): void {
    this.selectedRoles = event?.checked
      ? [...this.selectedRoles, id]
      : (this.selectedRoles || [])?.filter((role) => role != id) || [];
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
    const role: RoleCreate = {
      uuid:
        this.dialogData?.role && this.dialogData?.role?.uuid
          ? this.dialogData?.role?.uuid
          : "",
      name: this.formValues["name"]?.value,
      description: this.formValues["description"]?.value,
      privileges: this.selectedPrivileges.map((privilegeId) => {
        return {
          uuid: privilegeId,
        };
      }),
      inheritedRoles: this.selectedRoles.map((inheritedRoleId) => {
        return {
          uuid: inheritedRoleId,
        };
      }),
    };
    this.privilegesAndRolesService
      .addNewOrUpdateRole(role)
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

  getItems(event: Event, actionType: string): void {
    event.stopPropagation();
    this.privilegePage =
      actionType === "next" ? this.privilegePage + 1 : this.privilegePage - 1;

    this.getPrivilegesList();
  }

  getRoleItems(event: Event, actionType: string): void {
    event.stopPropagation();
    this.rolePage =
      actionType === "next" ? this.rolePage + 1 : this.rolePage - 1;

    this.getRolesList();
  }
}
