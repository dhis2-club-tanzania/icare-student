import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { patientObj } from "src/app/shared/models/patient";
import { VisitsService } from "src/app/shared/resources/visits/services";
import {
  getCurrentPatient,
  getCurrentPatientState,
} from "src/app/store/selectors/current-patient.selectors";
import { SelectRoomComponent } from "../select-room/select-room.component";

@Component({
  selector: "app-registration-patient",
  templateUrl: "./registration-patient.component.html",
  styleUrls: ["./registration-patient.component.scss"],
})
export class RegistrationPatientComponent implements OnInit {
  params: any;
  name: string;
  dob: string;
  gender: string;
  age: string;
  phone: string;
  visit: string;
  opdService: string;
  vertService: string;
  Rooms: string;
  Payment: string;

  currentPatient$: Observable<any>;

  visitTypes: any = [
    {
      uuid: "7b0f5697-27e3-40c4-8bae-f4049abfb4ed",
      display: "Facility Visit",
      links: [
        {
          rel: "self",
          uri: "http://icare:8080/openmrs/ws/rest/v1/visittype/7b0f5697-27e3-40c4-8bae-f4049abfb4ed",
        },
      ],
    },
    {
      uuid: "2mnxl2eb-5345-11e8-5555-40b034c3cfee",
      display: "OPD",
      links: [
        {
          rel: "self",
          uri: "http://icare:8080/openmrs/ws/rest/v1/visittype/2mnxl2eb-5345-11e8-5555-40b034c3cfee",
        },
      ],
    },
    {
      uuid: "dde7d770-45fc-46e7-9188-c5f21221987a",
      display: "Vertical Programs",
      links: [
        {
          rel: "self",
          uri: "http://icare:8080/openmrs/ws/rest/v1/visittype/dde7d770-45fc-46e7-9188-c5f21221987a",
        },
      ],
    },
  ];

  visitsHierarchy: any = [
    {
      uuid: "9f54c3ad-0ed6-42b9-bde7-e8eca327f474",
      display: "OPD",
      setMembers: [
        {
          uuid: "a49eb472-ece5-4fd6-a37d-10e64cb00506",
          display: "General OPD",
          setMembers: [],
        },
        {
          uuid: "c95406cd-5097-45cf-922d-4f0bd48fdf75",
          display: "Diagnostic Services",
          setMembers: [],
        },
        {
          uuid: "2e40261f-75c4-431c-9589-93334b74851d",
          display: "Specialized Clinics",
          setMembers: [],
        },
      ],
      answers: [
        {
          uuid: "a49eb472-ece5-4fd6-a37d-10e64cb00506",
          display: "General OPD",
        },
        {
          uuid: "c95406cd-5097-45cf-922d-4f0bd48fdf75",
          display: "Diagnostic Services",
        },
        {
          uuid: "2e40261f-75c4-431c-9589-93334b74851d",
          display: "Specialized Clinics",
        },
      ],
    },
    {
      uuid: "eeab88af-5903-4e7c-ac35-1b9f1c87d778",
      display: "Vertical Programs",
      setMembers: [
        {
          uuid: "a94800a8-da85-4b6c-a809-8ab11dc296e0",
          display: "CTC",
          setMembers: [],
        },
        {
          uuid: "85f06ba7-9eb4-4953-9da6-36c1337a0a94",
          display: "RCH",
          setMembers: [],
        },
        {
          uuid: "e8bd290a-a843-4faa-b519-68dff0f1b128",
          display: "MAT",
          setMembers: [],
        },
        {
          uuid: "e35da684-c4be-4b2b-9f05-45ca3bc1fb33",
          display: "TB",
          setMembers: [],
        },
      ],
      answers: [
        {
          uuid: "a94800a8-da85-4b6c-a809-8ab11dc296e0",
          display: "CTC",
        },
        {
          uuid: "85f06ba7-9eb4-4953-9da6-36c1337a0a94",
          display: "RCH",
        },
        {
          uuid: "e8bd290a-a843-4faa-b519-68dff0f1b128",
          display: "MAT",
        },
        {
          uuid: "e35da684-c4be-4b2b-9f05-45ca3bc1fb33",
          display: "TB",
        },
      ],
    },
  ];

  visitDetails: any = {};

  visitDetailsForm = {
    Rooms: ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6"],
    Payment: ["Cash", "Insurance"],
    Cash: ["Normal", "Fast"],
    Insurance: ["NHIF", "AAR", "STRATERGIES"],
  };

  setOptions(option) {
    this.visitDetails = {
      ...this.visitDetails,
      visitType: { uuid: option.uuid, display: option.display },
    };
  }

  setPaymentOptions(key, value) {
    if (key == "Payment" && value == "Insurance") {
      this.visitDetails["Cash"] = null;
    }

    if (key == "Payment" && value == "Cash") {
      this.visitDetails["Insurance"] = null;
    }

    this.visitDetails[key] = value;
  }

  setService(service) {
    this.visitDetails["service"] = service;
  }

  showVisitStartForn: boolean = false;
  patientt: patientObj;
  formatedServiceDetails: any = {};
  currentLocation: any;
  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private store: Store,
    private visitService: VisitsService
  ) {}

  ngOnInit(): void {
    this.store.select(getCurrentPatientState).subscribe((response) => {
      this.patientt = new patientObj(response);
    });

    this.currentPatient$ = this.store.pipe(select(getCurrentPatient));

    // this.store.select(getCurrentLocation(false)).subscribe((res) => {
    //   this.currentLocation = res;
    // });

    // this.formatServices(this.visitsHierarchy);
  }

  formatServices(servicesArray) {
    _.each(servicesArray, (service) => {
      this.formatedServiceDetails[service.display] = service;
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(SelectRoomComponent, {
      width: "35%",
      data: this.visitDetailsForm["Rooms"],
    });

    dialogRef.afterClosed().subscribe((dialogData) => {
      if (dialogData) {
        this.visitDetails.Room = dialogData["room"];
      }
    });
  }

  startVisit() {
    if (this.visitPayloadViable) {
      let visitPayload = {
        patient: this.patientt.uuid,
        visitType: this.visitDetails?.visitType?.uuid,
        location: this.currentLocation.uuid,
        attributes: [
          {
            attributeType: "45f2ce71-febb-493c-8593-73c6d84a6a48",
            value: this.visitDetails?.Payment,
          },
          {
            attributeType: "32a1d9e1-769e-4d67-bd8b-fc1ae7d17135",
            value: this.visitDetails?.Cash || this.visitDetails?.Insurance,
          },
          {
            attributeType: "87a00ba3-0bee-4629-a963-a3c3e1fb0d61",
            value: this.visitDetails?.service?.display,
          },
        ],
      };

      this.visitService.createVisit(visitPayload).subscribe((res) => {
        // console.log("didi i create a visit? :: ", res);
      });
    } else {
      this.openSnackBar("Error: location is not set", null);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }

  visitPayloadViable() {
    return (
      this.patientt.uuid &&
      this.visitDetails?.visitType?.uuid &&
      this.currentLocation?.uuid &&
      this.visitDetails?.Payment &&
      this.visitDetails?.service?.display &&
      (this.visitDetails?.Cash || this.visitDetails?.Insurance)
    );
  }
}
