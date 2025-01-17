import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/reducers";
import {
  getAllForms,
  getOpenMRSForms,
} from "src/app/store/selectors/form.selectors";
import { VisitsService } from "../../resources/visits/services";

@Component({
  selector: "app-patient-visit-history-modal",
  templateUrl: "./patient-visit-history-modal.component.html",
  styleUrls: ["./patient-visit-history-modal.component.scss"],
})
export class PatientVisitHistoryModalComponent implements OnInit {
  visits: any[];
  patientVisits$: Observable<any>;
  patientUuid: string;
  shouldShowVitalsOnly: Boolean;
  omitCurrent: boolean = true;
  forms$: Observable<any[]>;
  constructor(
    private visitService: VisitsService,
    private dialogRef: MatDialogRef<PatientVisitHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<AppState>
  ) {
    this.patientUuid = data?.patientUuid;
    this.shouldShowVitalsOnly = data?.shouldShowVitalsOnly
      ? data?.shouldShowVitalsOnly
      : data?.location?.tags &&
        data?.location?.tags.find(({ name }) => name === "Triage Location")
      ? true
      : false;
  }

  ngOnInit(): void {
    this.forms$ = this.store.select(getOpenMRSForms);
    this.patientVisits$ = this.visitService.getAllPatientVisits(
      this.patientUuid,
      true,
      this.omitCurrent
    );
  }
}
