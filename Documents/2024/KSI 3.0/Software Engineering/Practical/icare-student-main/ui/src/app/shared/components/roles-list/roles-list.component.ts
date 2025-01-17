import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { PrivilegeGetFull, RoleGet } from "../../resources/openmrs";
import { PrivilegesAndRolesService } from "../../services/privileges-and-roles.service";
import { ManageRolesComponent } from "../manage-roles/manage-roles.component";
import { SharedConfirmationDialogComponent } from "../shared-confirmation-dialog/shared-confirmation-dialog.component";

@Component({
  selector: "app-roles-list",
  templateUrl: "./roles-list.component.html",
  styleUrls: ["./roles-list.component.scss"],
})
export class RolesListComponent implements OnInit {
  roles$: Observable<PrivilegeGetFull[]>;
  page: number = 1;
  pageSize: number = 10;
  q: string;
  constructor(
    private privilegeAndRolesService: PrivilegesAndRolesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getRolesList();
  }

  getRolesList(): void {
    this.roles$ = this.privilegeAndRolesService.getRoles({
      q: this.q,
      limit: this.pageSize,
      startIndex: (this.page - 1) * this.pageSize,
      v: "custom:(uuid,display,name,description)",
    });
  }

  getRoles(event: Event, actionType: string): void {
    event.stopPropagation();
    this.page = actionType === "next" ? this.page + 1 : this.page - 1;
    this.getRolesList();
  }

  onAddNew(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(ManageRolesComponent, {
        width: "40%",
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.getRolesList();
        } else {
        }
      });
  }

  searchItem(event: KeyboardEvent): void {
    this.page = 1;
    this.q = (event.target as HTMLInputElement).value;
    this.q = this.q == "" ? null : this.q;
    this.getRolesList();
  }

  onEdit(event: Event, role: RoleGet): void {
    this.dialog.open(ManageRolesComponent, {
      width: "40%",
      data: {
        role: role,
      },
    });
  }

  onRetire(event: Event, privilege: PrivilegeGetFull): void {}

  onDelete(event: Event, privilege: PrivilegeGetFull): void {
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        width: "20%",
        data: {
          header: `Are you sure to delete role <b>${privilege?.display}</b>`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          this.privilegeAndRolesService
            .deleteRole(privilege?.uuid)
            .subscribe((response) => {
              this.getRolesList();
            });
        }
      });
  }
}
