import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { VisitsService } from 'src/app/shared/resources/visits/services';
import { AppState } from 'src/app/store/reducers';
import { getAllTreatmentLocations } from 'src/app/store/selectors';

@Component({
  selector: 'app-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.scss'],
})
export class SelectRoomComponent implements OnInit {
  locations$: Observable<any[]>;
  constructor(
    public dialogRef: MatDialogRef<SelectRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private visitService: VisitsService
  ) {}

  filteredRooms: any[];
  selectedRoom: string;
  searchTerm: string;
  currentRoom: string;
  patientLoad$: Observable<any>;
  loadingPatientLoad: boolean;

  ngOnInit(): void {
    this.loadingPatientLoad = true;
    this.filteredRooms = this.data?.locations;
    this.currentRoom = this.data?.currentRoom?.id;
    this.locations$ = this.store.select(getAllTreatmentLocations);
    this.patientLoad$ = this.visitService.getPatientLoadByLocation().pipe(
      tap(() => {
        this.loadingPatientLoad = false;
      })
    );
  }

  searchRoom(event: Event) {
    event.stopPropagation();
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  onSelectRoom(event: Event, room: any) {
    event.stopPropagation();
    this.currentRoom = room?.id;
    this.dialogRef.close({ room });
  }
}
