import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Observable } from "rxjs";
import { PasswordRegExpressionReferences } from "src/app/core/constants/password-security.constants";
import { LocationService } from "src/app/core/services";
import { SystemUsersService } from "src/app/core/services/system-users.service";
import { processDateFromMaterialInput } from "src/app/shared/helpers/utils.helpers";
import { LocationGetFull, RoleCreate } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-add-new-user",
  templateUrl: "./add-new-user.component.html",
  styleUrls: ["./add-new-user.component.scss"],
})
export class AddNewUserComponent implements OnInit {
  securitySystemSettings: any[];
  @ViewChild("table", { static: false }) table: MatTable<any>;
  @ViewChild("filter", { static: false }) filter: ElementRef;
  loading: boolean = true;
  userForm: FormGroup;
  hide: boolean = true;
  roles: RoleCreate[];
  selectedRoles: any[] = [];
  displayedColumns: string[] = ["display"];
  selectedUserId: any;
  checked: boolean = false;
  selectedUser: any;
  person: any;
  rolesDataSource: MatTableDataSource<RoleCreate>;
  rolesLoading: boolean = true;
  touchtime: number = 0;
  selectedRolesDatasource: MatTableDataSource<RoleCreate>;
  moveToAvailable: any[] = [];
  moveToSelected: any[] = [];
  clickedAvailable: any[] = [];
  searchText: string = "";
  genderClicked: boolean = false;
  today: Date = new Date();
  saving: boolean = false;
  birthdate: Date | string;
  clickedRows: any[] = [];
  usernames: number = 0;
  initialization: boolean = true;
  searching: boolean = false;
  locations: any[] = [];
  selectedLocations: any = [];
  shouldCreateProvider: boolean = false;
  genderValues = [
    { code: "F", value: "Female" },
    { code: "M", value: "Male" },
  ];

  gender: { Female: string; Male: string } = {
    Female: "F",
    Male: "M",
  };
  currentDataAvailable: RoleCreate[];
  passwordFocusOut: Boolean = false;
  passwordStrong: Boolean = true;
  laboratoryLocations$: Observable<Location[]>;
  roles$: Observable<any[]>;

  passwordStrengthMessage: string = "Password should match required settings";
  constructor(
    private fb: FormBuilder,
    private service: SystemUsersService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddNewUserComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private locationService: LocationService
  ) {
    this.securitySystemSettings = data;
  }

  ngOnInit() {
    this.laboratoryLocations$ =
      this.locationService.getLocationsByTagName("Lab Location");
    this.roles$ = this.service.getRoles();
    this.userForm = this.generateForm();
    this.service.getRoles().subscribe((roles) => {
      this.roles = roles;
      this.rolesDataSource = new MatTableDataSource(this.roles);
      this.selectedRolesDatasource = new MatTableDataSource(this.selectedRoles);
      this.loading = false;
    });
    this.service.getLoginLocations().subscribe((res) => {
      this.locations = res.results;
    });
  }

  generateForm() {
    return this.fb.group({
      username: new FormControl("", Validators.required),
      password: ["", [Validators.required, Validators.minLength(8)]],
      gender: new FormControl(""),
      middleName: new FormControl(""),
      firstName: new FormControl("", Validators.required),
      surname: new FormControl("", Validators.required),
      confirmpassword: new FormControl(""),
      addressDisplay: new FormControl(""),
      country: new FormControl("", Validators.required),
      district: new FormControl("", Validators.required),
      city: new FormControl("", Validators.required),
      postalCode: new FormControl(""),
      addressDisplay2: new FormControl(""),
      checked: false,
      birthdate: new FormControl("", Validators.required),
      MCTNumber: new FormControl(""),
      phoneNumber: new FormControl(""),
      qualification: new FormControl(""),
    });
  }

  get passwordInput() {
    return this.userForm.get("password");
  }

  get confirmpassword() {
    return this.userForm.get("confirmpassword");
  }

  onClickGender(e: any) {
    e.stopPropagation();
    this.genderClicked = !this.genderClicked;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.rolesDataSource.filter = filterValue.trim().toLowerCase();
    this.selectedRolesDatasource.filter = filterValue.trim().toLowerCase();
  }

  saveData(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    const data = this.userForm.value;
    const years = moment().diff(data.birthdate, "years", false);
    const prefferedLocation = {
      display: data.addressDisplay,
      preferred: true,
      address1: data.addressDisplay,
      address2: data.addressDisplay2,
      cityVillage: data.district,
      stateProvince: data.city,
      country: data.country,
      postalCode: data.postalCode,
      countyDistrict: data.district,
      startDate: data.addressStartDate ? data.addressStartDate : null,
      endDate: data.addressEndDate ? data.addressEndDate : null,
      latitude: data.longitude ? data.longitude : null,
      longitude: data.longitude ? data.longitude : null,
    };

    const person = {
      names: [
        {
          givenName: data?.firstName,
          middleName: data?.middleName,
          familyName: data?.surname,
        },
      ],
      age: years.toString(),
      birthdateEstimated: false,
      dead: false,
      display: data.firstName,
      addresses: [prefferedLocation],
      birthdate: processDateFromMaterialInput(data.birthdate),
      gender: this.gender[data.gender],
    };
    const user = {
      userProperties: {
        locations: JSON.stringify(
          this.selectedLocations.map(({ uuid }) => uuid)
        ),
      },
      username: data?.username,
      password: data?.password,
      roles: this.selectedRoles,
      person,
    };
    this.service.createUser({ user }).subscribe(
      (user) => {
        if (user) {
          // create provider
          // TODO: Add support to capture attributes dynamically
          const provider = {
            identifier: data?.username,
            person: user?.person?.uuid,
            attributes: [
              {
                attributeType: "79fa49fc-d584-4b74-9dcd-eb265372ade1",
                value: data?.MCTNumber,
              },
              {
                attributeType: "685a0d80-25e5-4ed4-8a03-974a1d161bf3",
                value: data?.phoneNumber,
              },
              {
                attributeType: "9c4420fa-5a22-4249-978c-da6e0f24880b",
                value: data?.qualification,
              },
            ],
          };
          this.shouldCreateProvider
            ? this.service
                .createProvider({ provider: provider })
                .subscribe((response) => {
                  if (response) {
                    this._snackBar.open(
                      `User ${person.display} created successfully`,
                      "OK",
                      {
                        horizontalPosition: "center",
                        verticalPosition: "bottom",
                        duration: 10000,
                        panelClass: ["snack-color"],
                      }
                    );
                    setTimeout(() => {
                      this.dialogRef.close();
                    }, 200);
                    this.saving = false;
                  }
                })
            : this._snackBar.open(
                `User ${person.display} created successfully`,
                "OK",
                {
                  horizontalPosition: "center",
                  verticalPosition: "bottom",
                  duration: 10000,
                  panelClass: ["snack-color"],
                }
              );

          this.saving = false;
          setTimeout(() => {
            this.dialogRef.close();
          }, 200);
        }
      },
      (error: { error: any }) => {
        this._snackBar.open(
          `An error ocurred. Please try again. Hint: ${
            error.error?.error?.message || error.error.message
          }`,
          "CLOSE",
          {
            horizontalPosition: "center",
            verticalPosition: "bottom",
            duration: 10000,
            panelClass: ["snack-color-error"],
          }
        );
        this.saving = false;
      }
    );
  }

  get fullName() {
    return (
      (this.userForm.get("firstName") && this.userForm.get("firstName").value
        ? this.userForm.get("firstName").value
        : "") +
      " " +
      (this.userForm.get("middleName") && this.userForm.get("middleName").value
        ? this.userForm.get("middleName").value
        : "") +
      " " +
      (this.userForm.get("surname") && this.userForm.get("surname").value
        ? this.userForm.get("surname").value
        : "")
    );
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  selectedRowAvailable(role: RoleCreate) {
    const clicked = this.clickedAvailable.find(
      ({ uuid }) => role.uuid === uuid
    );
    return clicked
      ? { background: "#2a8fd1", color: "white !important" }
      : { background: "", color: "black" };
  }

  assignAll() {
    this.moveToAvailable = [];
    this.moveToSelected = [];
    this.clickedAvailable = [];
    this.selectedRoles = [...this.selectedRoles, ...this.roles];
    this.selectedRolesDatasource = new MatTableDataSource(this.selectedRoles);
    this.roles = [];
    this.rolesDataSource = new MatTableDataSource(this.roles);
  }

  unAssignAll() {
    this.moveToAvailable = [];
    this.moveToSelected = [];
    this.clickedAvailable = [];
    this.roles = [...this.roles, ...this.selectedRoles];
    this.rolesDataSource = new MatTableDataSource(this.roles);
    this.selectedRoles = [];
    this.selectedRolesDatasource = new MatTableDataSource(this.selectedRoles);
  }

  getRoleSingleClick(e: any, role: RoleCreate, action: string): void {
    if (action === "selected") {
      this.moveToSelected = [];
      this.getSelected({ e, role });
    } else {
      this.moveToAvailable = [];
      this.getAvailable({ e, role });
    }
  }

  getRoleDoubleClick(e: any, role: RoleCreate, action: string) {
    if (action === "selected") {
      if (!e.metaKey && !e.crtlKey && !e.shiftKey) {
        this.clickedRows = [];
        this.moveToAvailable = [];
        this.selectedRoles = this.selectedRoles.filter(
          ({ uuid }) => role.uuid !== uuid
        );
        this.roles = [...this.roles, role];
        this.rolesDataSource = new MatTableDataSource(this.roles);
        this.selectedRolesDatasource = new MatTableDataSource(
          this.selectedRoles
        );
      }
    } else {
      if (!e.metaKey && !e.crtlKey && !e.shiftKey) {
        this.clickedRows = [];
        this.moveToSelected = [];
        this.roles = this.roles.filter(({ uuid }) => role.uuid !== uuid);
        this.rolesDataSource = new MatTableDataSource(this.roles);
        this.selectedRoles = [...this.selectedRoles, role];
        this.selectedRolesDatasource = new MatTableDataSource(
          this.selectedRoles
        );
      }
    }
  }

  onClickMoveToAvailable() {
    this.roles = [...this.roles, ...this.moveToAvailable];
    this.selectedRoles = this.selectedRoles.filter(
      (selectedrole: RoleCreate) =>
        !this.moveToAvailable.find(({ uuid }) => selectedrole.uuid === uuid)
    );
    this.selectedRolesDatasource = new MatTableDataSource(this.selectedRoles);
    this.rolesDataSource = new MatTableDataSource(this.roles);
    this.moveToAvailable = [];
  }

  onClickMoveToSelected() {
    this.selectedRoles = [...this.selectedRoles, ...this.moveToSelected];
    this.roles = this.roles.filter(
      (selectedrole: RoleCreate) =>
        !this.moveToSelected.find(({ uuid }) => selectedrole.uuid === uuid)
    );
    this.selectedRolesDatasource = new MatTableDataSource(this.selectedRoles);
    this.rolesDataSource = new MatTableDataSource(this.roles);
    this.moveToSelected = [];
  }

  getSelected({ e, role }) {
    this.clickedAvailable = [];
    e.stopPropagation();
    if ((e.metaKey || e.crtlKey) && !e.shiftKey) {
      this.moveToSelected = [];
      const alreadySelected = this.clickedRows.find(
        ({ uuid }) => role.uuid === uuid
      );
      if (alreadySelected) {
        this.clickedRows = this.clickedRows.filter(
          ({ uuid }) => role.uuid !== uuid
        );
        this.moveToAvailable = this.moveToAvailable.filter(
          ({ uuid }) => role.uuid !== uuid
        );
        this.selectedRow(role);
      } else {
        this.clickedRows = [...this.clickedRows, role];
        this.moveToAvailable = [...this.moveToAvailable, role];
      }
    } else if (e.shiftKey) {
      //this.ShiftKeyDown(e, role);
    } else {
      this.clickedRows = [];
      this.moveToAvailable = [];
      this.moveToAvailable = [role];
      this.clickedRows = [...this.clickedRows, role];
    }
  }

  getAvailable({ e, role }) {
    e.stopPropagation();
    this.moveToAvailable = [];
    this.clickedRows = [];
    if ((e.metaKey || e.crtlKey) && !e.shiftKey) {
      this.moveToAvailable = [];
      const alreadySelected = this.clickedAvailable.find(
        ({ uuid }) => role.uuid === uuid
      );
      if (alreadySelected) {
        this.clickedAvailable = this.clickedAvailable.filter(
          ({ uuid }) => role.uuid !== uuid
        );
        this.moveToSelected = this.moveToSelected.filter(
          ({ uuid }) => role.uuid !== uuid
        );
        this.selectedRow(role);
      } else {
        this.clickedAvailable = [...this.clickedAvailable, role];
        this.moveToSelected = [...this.moveToSelected, role];
      }
    } else if (e.shiftKey) {
    } else {
      this.clickedAvailable = [];
      this.moveToSelected = [];
      this.moveToSelected = [role];
      this.clickedAvailable = [...this.clickedAvailable, role];
    }
  }

  selectedRow(role: RoleCreate) {
    const clicked = this.clickedRows.find(({ uuid }) => role.uuid === uuid);
    return clicked
      ? { background: "#2a8fd1", color: "white" }
      : { background: "", color: "black" };
  }

  search(e: any) {
    this.searching = true;
    this.initialization = false;
    e.stopPropagation();
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue === "") {
      this.searching = false;
    } else {
      this.service.searchUser(filterValue).subscribe((res) => {
        this.usernames = res.results.length;
        if (this.usernames === 0) {
          this.searching = false;
        }
      });
    }
  }

  searchLocation(e: any): void {
    this.searching = true;
    this.initialization = false;
    e.stopPropagation();
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue === "") {
      this.searching = false;
    } else {
      this.service.getLoginLocations().subscribe((res) => {
        this.locations = res.results;
        if (this.locations.length === 0) {
          this.searching = true;
        }
      });
    }
  }

  onGetSelectedLocations(locations: any): void {
    this.selectedLocations = locations;
  }

  onGetSelectedRoles(roles: any): void {
    this.selectedRoles = roles;
  }

  get passwordMatch() {
    if (this.hide) {
      if (this.passwordInput.value === this.confirmpassword.value) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  confirmStrongPassword(e: any): void {
    this.passwordFocusOut = true;
    e.stopPropagation();
    if (this.passwordInput.value && this.passwordInput.value !== "") {
      // const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
      const passwordMinLengthSetting = (this.securitySystemSettings?.filter(
        (setting: any) => setting?.property === "security.passwordMinimumLength"
      ) || [])[0];

      const minLength = passwordMinLengthSetting?.value
        ? Number(passwordMinLengthSetting?.value)
        : 8;
      const regExpressSetting = (this.securitySystemSettings?.filter(
        (setting: any) => setting?.property === "security.passwordCustomRegex"
      ) || [])[0];

      const passwordRequiresUpperAndLowerCaseSetting =
        (this.securitySystemSettings?.filter(
          (setting: any) =>
            setting?.property === "security.passwordRequiresUpperAndLowerCase"
        ) || [])[0];

      const passwordRequiresNonDigit = (this.securitySystemSettings?.filter(
        (setting: any) =>
          setting?.property === "security.passwordRequiresNonDigit"
      ) || [])[0];

      const checkLengthRegExp =
        "\\" +
        (passwordRequiresNonDigit && passwordRequiresNonDigit?.value === "true"
          ? "w"
          : "d") +
        "{" +
        minLength +
        ",}";
      const pattern =
        regExpressSetting && regExpressSetting?.value
          ? regExpressSetting?.value
          : PasswordRegExpressionReferences.AT_LEAST_ONE_DIGIT +
            (passwordRequiresNonDigit &&
            passwordRequiresNonDigit?.value === "true"
              ? passwordRequiresUpperAndLowerCaseSetting &&
                passwordRequiresUpperAndLowerCaseSetting?.value === "true"
                ? PasswordRegExpressionReferences.AT_LEAST_ONE_LOWER_CASE_CHAR +
                  PasswordRegExpressionReferences.AT_LEAST_ONE_UPPER_CASE_CHAR
                : ""
              : "") +
            checkLengthRegExp;
      const strongPassword = new RegExp("^" + pattern + "$");
      const test = strongPassword.test(this.passwordInput.value);
      this.passwordFocusOut = true;
      if (test) {
        this.passwordStrong = true;
        this.passwordStrengthMessage = "";
      } else {
        this.passwordStrong = false;
        this.passwordStrengthMessage =
          "Password should meet the following conditions" +
          (regExpressSetting && regExpressSetting?.value
            ? "Pattern: " + regExpressSetting?.value
            : passwordMinLengthSetting?.value
            ? passwordMinLengthSetting?.value
            : "");
      }
    }
  }

  providerAccount(value: boolean) {
    this.shouldCreateProvider = value;
  }
}
