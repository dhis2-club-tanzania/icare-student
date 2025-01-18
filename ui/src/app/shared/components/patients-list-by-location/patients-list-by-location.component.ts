import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { StartVisitModelComponent } from "src/app/modules/registration/components/start-visit-model/start-visit-model.component";
import { addCurrentPatient, go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { PatientService } from "../../resources/patient/services/patients.service";

@Component({
  selector: "app-patients-list-by-location",
  templateUrl: "./patients-list-by-location.component.html",
  styleUrls: ["./patients-list-by-location.component.scss"],
})
export class PatientsListByLocationComponent implements OnInit {
  locationId: string;
  patientSummary$: any;
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params["location"];
  }

  onSelectPatient(patient: any): void {
    this.patientService.getPatient(patient?.patient?.uuid).subscribe(
      (patient) => {
        let patientObject = { ...patient['patient'], id: patient['patient']['uuid']}
        this.store.dispatch(
          addCurrentPatient({
            patient: patientObject,
            isRegistrationPage: true,
          })
        );
        this.dialog
          .open(StartVisitModelComponent, {
            width: "85%",
            data: {
              patient: patientObject,
            },
          })
          .afterClosed()
          .subscribe();
      }
    );
  }

  onClick(e: Event, route: string) {
    this.store.dispatch(go({ path: [`${route}`] }));
  }
}
