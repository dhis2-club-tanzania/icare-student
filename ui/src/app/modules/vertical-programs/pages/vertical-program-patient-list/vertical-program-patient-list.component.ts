import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ProgramsService } from "src/app/shared/resources/programs/services/programs.service";
import { go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";

@Component({
  selector: "app-vertical-program-patient-list",
  templateUrl: "./vertical-program-patient-list.component.html",
  styleUrls: ["./vertical-program-patient-list.component.scss"],
})
export class VerticalProgramsPatientListComponent implements OnInit {
  currentLocation$: Observable<any>;
  programs$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private programService: ProgramsService
  ) {}

  ngOnInit() {
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation(false)));
    this.programs$ = this.programService.getAllPrograms();
  }

  onSelectPatient(patient: any): void {
    this.store.dispatch(go({ path: ["/vertical_programs/dashboard"] }));
  }
}
