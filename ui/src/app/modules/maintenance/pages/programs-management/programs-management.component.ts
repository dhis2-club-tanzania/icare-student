import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { CurrentUser } from "src/app/shared/models/current-user.models";
import { ProgramGetFull } from "src/app/shared/resources/openmrs";
import { ProgramsService } from "src/app/shared/resources/programs/services/programs.service";
import { AppState } from "src/app/store/reducers";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-programs-management",
  templateUrl: "./programs-management.component.html",
  styleUrls: ["./programs-management.component.scss"],
})
export class ProgramsManagementComponent implements OnInit {
  currentUser$: Observable<CurrentUser>;
  programs$: Observable<any[]>;
  constructor(
    private store: Store<AppState>,
    private programsService: ProgramsService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.programs$ = this.programsService.getAllPrograms();
  }
}
