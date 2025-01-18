import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { OtherClientLevelSystemsService } from "src/app/modules/laboratory/resources/services/other-client-level-systems.service";
import { UserService } from "src/app/modules/maintenance/services/users.service";
import { AppState } from "src/app/store/reducers";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-manage-user-profile-modal",
  templateUrl: "./manage-user-profile-modal.component.html",
  styleUrls: ["./manage-user-profile-modal.component.scss"],
})
export class ManageUserProfileModalComponent implements OnInit {
  @Input() currentUser$: Observable<any>;
  isFormValid: boolean = false;
  userProperties: any;
  saving: boolean = false;
  updated: boolean = false;
  username: string;
  password: string;
  systemKey: string;
  errors: any[] = [];
  verified: boolean = false;
  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private dialogRef: MatDialogRef<ManageUserProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private externalSystemsService: OtherClientLevelSystemsService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.systemKey = "pimaCOVID";
  }

  onSave(event: Event, currentUser: any): void {
    event.stopPropagation();
    const user = {
      userProperties: {
        ...currentUser?.userProperties,
        ...this.userProperties,
      },
    };
    this.saving = true;
    this.userService
      .updateUser({ data: user, uuid: currentUser?.uuid })
      .subscribe((response) => {
        if (response) {
          this.saving = false;
          this.updated = true;
          setTimeout(() => {
            this.dialogRef.close();
          }, 2000);
        }
      });
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onGetPropertiesToSave(userPropertiesToSave: any): void {
    this.username = userPropertiesToSave?.username?.trim()?.toLowerCase();
    this.password = userPropertiesToSave?.password?.trim();
    this.userProperties = {};
    this.userProperties[this.data?.usernamePropertyKey] =
      userPropertiesToSave?.username?.trim()?.toLowerCase();
    this.userProperties[this.data?.passwordPropertyKey] =
      userPropertiesToSave?.password?.trim()?.toLowerCase();
  }

  onGetFormValid(isValid: boolean): void {
    this.isFormValid = isValid;
  }

  onVerifyCredentials(event: Event): void {
    event.stopPropagation();
    this.errors = [];
    this.externalSystemsService
      .verifyCredentials({
        username: this.username,
        password: this.password,
        systemKey: this.systemKey,
      })
      .subscribe((response) => {
        if (response && !response?.error) {
          this.verified = true;
        } else {
          this.errors = [...this.errors, response?.error];
        }
      });
  }
}
