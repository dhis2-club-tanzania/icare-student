import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { Location } from "src/app/core/models";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { go } from "src/app/store/actions";
import { ProgramsService } from "src/app/shared/resources/programs/services/programs.service";
import { ProgramGetFull } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-enrolled-patients-list",
  templateUrl: "./enrolled-patients-list.component.html",
  styleUrls: ["./enrolled-patients-list.component.scss"],
})
export class EnrolledPatientsListComponent implements OnInit {
  @Input() isTabularList: boolean;
  @Input() currentLocation: Location;
  @Input() programs: any[];
  @Output() selectedPatient: EventEmitter<any> = new EventEmitter<any>();
  enrolledPatients$: Observable<any>;
  parameters: string[] = [];
  programsList: any[] = [];
  selectedProgram: ProgramGetFull;
  constructor(
    private programsService: ProgramsService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.selectedProgram = this.programs[0];
    this.parameters = [
      ...this.parameters,
      `program=${this.selectedProgram?.uuid}`,
    ];
    this.getEnrollments();
  }

  getSelectedProgram(event: Event, program: ProgramGetFull): void {
    event.stopPropagation();
    this.selectedProgram = program;
    this.parameters = [
      ...this.parameters,
      `program=${this.selectedProgram?.uuid}`,
    ];
    this.getEnrollments();
  }

  onSearchClient(event: KeyboardEvent): void {
    const searchingText: string = (event?.target as any)?.value;
    this.getEnrollments();
  }

  getEnrollments(): void {
    this.enrolledPatients$ = this.programsService.getPatientsEnrollments(
      this.parameters
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.programs, event.previousIndex, event.currentIndex);
  }

  onViewPatientEnrollment(patientEnrollment: any): void {
    // console.log(patientEnrollment);
    this.store.dispatch(
      go({
        path: [
          `/vertical_programs/dashboard/${patientEnrollment?.uuid}/${patientEnrollment?.patient?.uuid}`,
        ],
      })
    );
  }
}
