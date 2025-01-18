import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";
import { AppState } from "src/app/store/reducers";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-update-doctors-room",
  templateUrl: "./update-doctors-room.component.html",
  styleUrls: ["./update-doctors-room.component.scss"],
})
export class UpdateDoctorsRoomComponent implements OnInit {
  @Input() patient: any;
  @Input() treatmentLocations: any[];
  @Input() currentVisit: any;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter<boolean>();
  currentRoom: any;
  searchTerm: string = "";
  updating: boolean = false;
  updated: boolean = false;
  errorUpdatingConsultationRoom: boolean = false;
  error: any;
  currentPatientVisit$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private visitService: VisitsService
  ) {}

  ngOnChange() {}

  ngOnInit(): void {
    this.currentPatientVisit$ = this.store.select(getActiveVisit);
  }

  onSelectRoom(event: Event, room): void {
    event.stopPropagation();
    // console.log(room);
    this.currentRoom = room;
  }

  emitLocationSelection(room) {
    // console.log("room ", room);
    this.updated = false;

    this.currentRoom = room;
  }

  searchRoom(event: Event) {
    event.stopPropagation();
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.closeDialog.emit(true);
  }

  update(event: Event, visit): void {
    event.stopPropagation();
    const visitPayload = {
      uuid: visit?.uuid,
      location: this.currentRoom?.uuid,
    };
    this.updating = true;
    this.updated = false;
    this.error = false;
    this.errorUpdatingConsultationRoom = null;

    this.visitService.updateVisitExisting(visitPayload).subscribe(
      (response) => {
        if (response) {
          this.updating = false;
          this.updated = true;
          this.store.dispatch(
            loadActiveVisit({ patientId: this.currentVisit?.patientUuid })
          );
        }
      },
      (error) => {
        // console.log("error : ", error);

        this.updating = false;
        this.updated = false;
        this.error = error;
        this.errorUpdatingConsultationRoom = true;
        this.store.dispatch(
          loadActiveVisit({ patientId: this.currentVisit?.patientUuid })
        );
      }
    );
  }
}
