import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import * as moment from "moment";
import { LocationService } from "src/app/core/services";
import { LocationGetFull, RoleCreate } from "src/app/shared/resources/openmrs";
import {
  GlobalEventHandlersEvent,
  PersonCreateModel,
  UserCreateModel,
} from "../../../models/user.model";
import { UserService } from "../../../services/users.service";

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.scss"],
})
export class EditUserComponent implements OnInit {
  @ViewChild("table", { static: false }) table: MatTable<any>;
  @ViewChild("filter", { static: false }) filter: ElementRef;
  userForm: FormGroup;
  loading: boolean = true;
  selectedUserId: any;
  selectedUser: UserCreateModel;
  person: PersonCreateModel;
  hide: boolean = true;
  roles: RoleCreate[];
  rolesDataSource: MatTableDataSource<RoleCreate>;
  rolesLoading: boolean = true;
  touchtime: number = 0;
  selectedRoles: any[] = [];
  selectedRolesDatasource: MatTableDataSource<RoleCreate>;
  moveToAvailable: any[] = [];
  moveToSelected: any[] = [];
  displayedColumns: string[] = ["display"];
  clickedRows: any[] = [];
  clickedAvailable: any[] = [];
  searchText: string = "";
  genderClicked: boolean = false;
  today: Date = new Date();
  saving: boolean = false;
  birthdate: Date | string;
  checked: Boolean;
  genderValues = [
    { code: "F", value: "Female" },
    { code: "U", value: "Unknown" },
    { code: "M", value: "Male" },
  ];

  gender: { F: string; M: string } = {
    F: "Femaile",
    M: "Male",
  };
  currentDataAvailable: RoleCreate[];
  selectedLocations: any[] = [];
  locations: any[] = [];
  searching: boolean = false;
  initialization: boolean = true;
  passwordFocusOut: Boolean = false;
  passwordStrong: Boolean = true;
  confirmFocusOut: Boolean = false;
  value: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: UserService,
    private _snackBar: MatSnackBar,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.locationService
      .getLocationsByTagNames(
        ["Treatment+Room", "Admission+Location", "Module+Location"],
        {
          limit: 100,
          startIndex: 0,
          v: "custom:(uuid,display,name)",
        }
      )
      .subscribe((response) => {
        this.locations = response;
      });
    this.selectedUserId = this.router["currentUrlTree"].queryParams;
    if (this.selectedUserId) {
      this.service.getUserById(this.selectedUserId.id).subscribe((user) => {
        if (user && user && user.person && user.person.uuid) {
          this.service.getPersonById(user.person.uuid).subscribe((person) => {
            this.service.getRoles().subscribe((roles) => {
              this.service
                .getPrefferedAddress({ person: person.uuid })
                .subscribe((address) => {
                  if (person.preferredAddress && person.preferredAddress.uuid) {
                    person.preferredAddress = address.results.find(
                      ({ uuid }) => person.preferredAddress.uuid === uuid
                    );
                  }
                  this.rolesDataSource = new MatTableDataSource(roles.results);
                  this.roles = roles.results;
                  this.selectedUser = user;
                  this.selectedUser.person = person;
                  const locations = user.userProperties.locations
                    .split("'")
                    .join('"');
                  for (const location of JSON.parse(locations)) {
                    this.service
                      .getLocationByUuid({ uuid: location })
                      .subscribe((response) => {
                        this.selectedLocations = [
                          ...this.selectedLocations,
                          response,
                        ];
                      });
                  }

                  this.birthdate =
                    person && person.birthdate
                      ? new Date(person.birthdate)
                      : "";
                  this.selectedRoles = user.roles;
                  this.roles = roles.results.filter(
                    (selectedrole: RoleCreate) =>
                      !this.selectedRoles.find(
                        ({ uuid }) => selectedrole.uuid === uuid
                      )
                  );
                  this.rolesDataSource = new MatTableDataSource(this.roles);
                  this.selectedRolesDatasource = new MatTableDataSource(
                    this.selectedRoles
                  );

                  this.userForm = this.generateForm();
                  this.loading = false;
                });
            });
          });
        } else {
          this.selectedUser = user;
          this.userForm = this.generateForm();
        }
      });
    }
  }
  generateForm() {
    return this.fb.group({
      username: new FormControl({
        value: this.selectedUser ? this.selectedUser.username : "",
        disabled: true,
      }),
      systemid: new FormControl({
        value: this.selectedUser ? this.selectedUser.systemId : "",
        disabled: true,
      }),
      password: new FormControl(
        this.selectedUser ? this.selectedUser.password : "",
        Validators.minLength(2)
      ),
      gender: new FormControl(
        this.selectedUser &&
        this.selectedUser.person &&
        this.selectedUser.person.gender &&
        this.selectedUser.person.gender
          ? this.gender[this.selectedUser.person.gender]
          : ""
      ),
      middleName: new FormControl(
        this.selectedUser &&
        this.selectedUser.person &&
        this.selectedUser.person.preferredName
          ? this.selectedUser.person.preferredName.middleName
          : ""
      ),
      firstName: new FormControl(
        this.selectedUser &&
        this.selectedUser.person &&
        this.selectedUser.person.preferredName
          ? this.selectedUser.person.preferredName.givenName
          : "",
        Validators.required
      ),
      surname: new FormControl(
        this.selectedUser &&
        this.selectedUser.person &&
        this.selectedUser.person.preferredName
          ? this.selectedUser.person.preferredName.familyName
          : "",
        Validators.required
      ),
      birthdate: new FormControl(
        this.selectedUser && this.selectedUser.person
          ? this.selectedUser.person.birthdate
          : "",
        Validators.required
      ),
      confirmpassword: new FormControl("", Validators.minLength(2)),

      addressDisplay: new FormControl(
        this.selectedUser.person.preferredAddress
          ? this.selectedUser.person.preferredAddress.display
          : "",
        Validators.required
      ),
      country: new FormControl(
        this.selectedUser.person.preferredAddress
          ? this.selectedUser.person.preferredAddress.country
          : "",
        Validators.required
      ),
      district: new FormControl(
        this.selectedUser.person.preferredAddress
          ? this.selectedUser.person.preferredAddress.cityVillage
          : "",
        Validators.required
      ),
      city: new FormControl(
        this.selectedUser.person.preferredAddress
          ? this.selectedUser.person.preferredAddress.stateProvince
          : "",
        Validators.required
      ),
      postalCode: new FormControl(
        this.selectedUser.person.preferredAddress
          ? this.selectedUser.person.preferredAddress.postalCode
          : ""
      ),
      addressDisplay2: new FormControl(
        this.selectedUser.person.preferredAddress
          ? this.selectedUser.person.preferredAddress.address2
          : ""
      ),
      MCTNumber: new FormControl(""),
      phoneNumber: new FormControl(""),
      qualification: new FormControl(""),
    });
  }

  get passwordInput() {
    return this.userForm.get("password");
  }
  get check() {
    return this.userForm.get("checked");
  }
  get confirmpassword() {
    return this.userForm.get("confirmpassword");
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

  onCancel(e: any) {}
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
  getRoleSingleClick(
    e: GlobalEventHandlersEvent,
    role: RoleCreate,
    action: string
  ) {
    if (action === "selected") {
      this.moveToSelected = [];
      this.getSelected({ e, role });
    } else {
      this.moveToAvailable = [];
      this.getAvailable({ e, role });
    }
  }
  getRoleDoubleClick(
    e: GlobalEventHandlersEvent,
    role: RoleCreate,
    action: string
  ) {
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
  selectedRow(role: RoleCreate) {
    const clicked = this.clickedRows.find(({ uuid }) => role.uuid === uuid);
    return clicked
      ? { background: "#2a8fd1", color: "white" }
      : { background: "", color: "black" };
  }

  selectedRowAvailable(role: RoleCreate) {
    const clicked = this.clickedAvailable.find(
      ({ uuid }) => role.uuid === uuid
    );
    return clicked
      ? { background: "#2a8fd1", color: "white !important" }
      : { background: "", color: "black" };
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
      this.ShiftKeyDown(e, role);
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.rolesDataSource.filter = filterValue.trim().toLowerCase();
    this.selectedRolesDatasource.filter = filterValue.trim().toLowerCase();
  }
  clearSearch(e) {}

  saveData() {
    delete this.selectedUser.privileges;
    delete this.selectedUser.allRoles;
    const data = this.userForm.value;
    const years = moment().diff(data.birthdate, "years", false);
    let person = {
      uuid: this.selectedUser.person.uuid,
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
    };
    const prefferedLocation = {
      display: data.addressDisplay,
      uuid:
        this.selectedUser.person.preferredAddress &&
        this.selectedUser.person.preferredAddress.uuid
          ? this.selectedUser.person.preferredAddress.uuid
          : "",
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
    Object.keys(this.selectedUser.person).forEach((key) => {
      if (data[key]) {
        if (key === "birthdate") {
          person[key] = new Date(data[key]).toISOString().split("T")[0];
        } else {
          person[key] = data[key];
        }
      } else {
        person[key] = this.selectedUser.person[key];
      }
    });
    person["age"] = years.toString();
    person["preferredAddress"] = prefferedLocation;
    const editedUser: UserCreateModel = {
      ...this.selectedUser,
      person,
      roles: this.selectedRoles,
    };

    if (this?.check?.value && this?.passwordStrong) {
      editedUser.password = data.password;
    }

    if (!this.selectedUser.person.preferredAddress) {
      this.saving = true;
      delete prefferedLocation.uuid;
      this.service
        .createPersonAddress({
          address: prefferedLocation,
          uuid: this.selectedUser.person.uuid,
        })
        .subscribe(
          (res) => {
            editedUser.person.preferredAddress = res;
            editedUser.person.addresses = [res];
            editedUser.userProperties.locations = JSON.stringify(
              this.selectedLocations.map(({ uuid }) => uuid)
            );
            this.service
              .updateUser({ data: editedUser, uuid: this.selectedUser.uuid })
              .subscribe(
                (response) => {
                  this._snackBar.open(
                    `${response.display} updated successfully`,
                    "OK",
                    {
                      horizontalPosition: "center",
                      verticalPosition: "bottom",
                      duration: 10000,
                      panelClass: ["snack-color"],
                    }
                  );
                  this.router.navigate(["users"]);
                  this.saving = false;
                },
                (error: { error: any }) => {
                  this._snackBar.open(
                    `An error ocurred. Please try again. Hint: ${error.error.error.message}`,
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
          },
          (error: { error: any }) => {
            this._snackBar.open(`${error.error.error.message}`, "CLOSE", {
              horizontalPosition: "center",
              verticalPosition: "bottom",
              duration: 10000,
              panelClass: ["snack-color-error"],
            });
            this.saving = false;
          }
        );
    } else {
      this.saving = true;
      delete editedUser.person;
      editedUser.userProperties.locations = JSON.stringify(
        this.selectedLocations.map(({ uuid }) => uuid)
      );
      this.service
        .updateUser({ data: editedUser, uuid: this.selectedUser.uuid })
        .subscribe((response) => {
          this._snackBar.open(
            `User ${response.display} updated successfully`,
            "CLOSE",
            {
              horizontalPosition: "center",
              verticalPosition: "bottom",
              duration: 20000,
              panelClass: ["snack-color"],
            }
          );
          window.location.href = "#/maintenance/users/";
          this.saving = false;
        }),
        (error: { error: any }) => {
          this._snackBar.open(
            `An error ocurred. Please try again. Hint: ${error.error.error.message}`,
            "CLOSE",
            {
              horizontalPosition: "center",
              verticalPosition: "bottom",
              duration: 20000,
              panelClass: ["snack-color-error"],
            }
          );
          this.saving = false;
        };
    }
  }
  lastSelectedSegmentRow = 1;
  ShiftKeyDown(event: { shiftKey: any }, lastRow: number) {
    if (event.shiftKey) {
      let obj = Object.assign([], this.roles).filter((val, i) => {
        return i > this.lastSelectedSegmentRow && i < lastRow;
      });
    }
    this.lastSelectedSegmentRow = lastRow;
  }
  onClickGender(e: GlobalEventHandlersEvent) {
    e.stopPropagation();
    this.genderClicked = !this.genderClicked;
  }
  getLocations(e: GlobalEventHandlersEvent, row: LocationGetFull) {
    e.stopPropagation();
    this.locations = this.locations.filter(({ uuid }) => row.uuid !== uuid);
    this.selectedLocations = [...this.selectedLocations, row];
  }
  removeLocation(e: GlobalEventHandlersEvent, row: LocationGetFull) {
    e.stopPropagation();
    this.selectedLocations = this.selectedLocations.filter(
      ({ uuid }) => row.uuid !== uuid
    );
  }
  searchLocation(e: GlobalEventHandlersEvent) {
    this.searching = true;
    this.initialization = false;
    e.stopPropagation();
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue === "") {
      this.searching = false;
    } else {
      this.service.searchLocation(filterValue).subscribe((res) => {
        this.locations = res.results;
        if (this.locations.length === 0) {
          this.searching = true;
        }
      });
    }
  }
  get passwordMatch() {
    if (this.check.value) {
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
  }
  confirmStrongPassword(e: GlobalEventHandlersEvent) {
    this.passwordFocusOut = true;
    e.stopPropagation();
    if (this.passwordInput.value && this.passwordInput.value !== "") {
      const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
      const test = strongPassword.test(this.passwordInput.value);
      this.passwordFocusOut = true;
      if (test) {
        this.passwordStrong = true;
      } else {
        this.passwordStrong = false;
      }
    }
  }
  confirmPassword(e: GlobalEventHandlersEvent) {
    e.stopPropagation();
    this.confirmFocusOut = true;
  }
  showOptions(e: Boolean) {
    this.checked = e;
  }
  providerAccount(value: boolean) {
    this.value = value;
  }
  providerAttributes = {
    attributes: [
      {
        attributeType: "79fa49fc-d584-4b74-9dcd-eb265372ade1",
        value: "",
      },
      {
        attributeType: "685a0d80-25e5-4ed4-8a03-974a1d161bf3",
        value: "",
      },
      {
        attributeType: "9c4420fa-5a22-4249-978c-da6e0f24880b",
        value: "",
      },
    ],
    retired: false,
  };
  parseJSON(json: string) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return false;
    }
  }
}
