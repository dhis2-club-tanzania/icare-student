import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { PrivilegeGetFull } from "../../resources/openmrs";
import { PrivilegesAndRolesService } from "../../services/privileges-and-roles.service";
import { ManagePrivilegesComponent } from "../manage-privileges/manage-privileges.component";
import { SharedConfirmationDialogComponent } from "../shared-confirmation-dialog/shared-confirmation-dialog.component";

@Component({
  selector: "app-privileges-list",
  templateUrl: "./privileges-list.component.html",
  styleUrls: ["./privileges-list.component.scss"],
})
export class PrivilegesListComponent implements OnInit {
  privileges$: Observable<PrivilegeGetFull[]>;
  page: number = 1;
  pageSize: number = 10;
  q: string;
  constructor(
    private privilegeAndRolesService: PrivilegesAndRolesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPrivilegesList();
  }

  getPrivilegesList(): void {
    this.privileges$ = this.privilegeAndRolesService.getPrivileges({
      q: this.q,
      limit: this.pageSize,
      startIndex: (this.page - 1) * this.pageSize,
      v: "custom:(uuid,display,name,description)",
    });
  }

  getPrivileges(event: Event, actionType: string): void {
    event.stopPropagation();
    this.page = actionType === "next" ? this.page + 1 : this.page - 1;
    this.getPrivilegesList();
  }

  onAddNew(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(ManagePrivilegesComponent, {
        width: "40%",
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.getPrivilegesList();
        } else {
        }
      });
  }

  searchItem(event: KeyboardEvent): void {
    this.page = 1;
    this.q = (event.target as HTMLInputElement).value;
    this.q = this.q == "" ? null : this.q;
    this.getPrivilegesList();
  }

  onRetire(event: Event, privilege: PrivilegeGetFull): void {}

  onDelete(event: Event, privilege: PrivilegeGetFull): void {
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        width: "20%",
        data: {
          header: `Are you sure to delete privilege <b>${privilege?.display}</b>`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          this.privilegeAndRolesService
            .deletePrivilege(privilege?.uuid)
            .subscribe((response) => {
              this.getPrivilegesList();
            });
        }
      });
  }
}
