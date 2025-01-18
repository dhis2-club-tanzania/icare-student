import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/reducers";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-new-patient-profile",
  templateUrl: "./new-patient-profile.component.html",
  styleUrls: ["./new-patient-profile.component.scss"],
})
export class NewPatientProfileComponent implements OnInit {
  @Input() currentPatient: any;
  patientDetails: any;
  vitalsIsSet: boolean = false;
  activeVisit$: Observable<any>;
  // @ViewChild(SharedConceptDisplayComponent) conceptDisplay: any[];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    const phoneDetails =
      this.currentPatient.patient.person.attributes &&
      this.currentPatient.patient.person.attributes?.length > 0
        ? (this.currentPatient.patient.person.attributes.filter(
            (attribute) => attribute?.display?.indexOf("phone") === 0
          ) || [])[0]
        : null;
    const middleNameDetails =
      this.currentPatient.patient.person.attributes &&
      this.currentPatient.patient.person.attributes?.length > 0
        ? (this.currentPatient.patient.person.attributes.filter(
            (attribute) => attribute?.display?.indexOf("mname") === 0
          ) || [])[0]
        : null;
    this.patientDetails = {
      ...this.currentPatient.patient,
      person: {
        ...this.currentPatient.patient.person,
        phone: phoneDetails ? phoneDetails?.display.split("= ")[1] : "",
        middleName: middleNameDetails
          ? middleNameDetails?.display.split("= ")[1]
          : "",
      },
      mrn: (this.currentPatient?.patient?.identifiers.filter(
        (identifier) =>
          identifier?.identifierType?.display === "MRN" ||
          identifier?.identifierType?.display === "OpenEMPI ID"
      ) || [])[0]?.identifier,
    };

    this.activeVisit$ = this.store.select(getActiveVisit);
  }

  toggleVitals(event) {
    event.stopPropagation();
    this.vitalsIsSet = !this.vitalsIsSet;
  }
}
