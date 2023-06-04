import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Schedules } from 'src/app/shared/dialogs/appointment-form/schedules.model';
import { SchedulesService } from 'src/app/shared/dialogs/appointment-form/schedules.service';
import { go } from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss']
})
export class AppointmentsListComponent implements OnInit {

  constructor(private store: Store<AppState>, private schedulesService: SchedulesService) { }

  ngOnInit(): void {
    this.getSchedules();

  }

  onBack(e: Event) {
    e.stopPropagation();
    this.store.dispatch(go({ path: ["/registration/home"] }));
  }

  schedules: Schedules[];


 

  getSchedules() {
    this.schedulesService.getSchedules().subscribe(
      (data: Schedules[]) => {
        this.schedules = data;
      },
      (error) => {
        console.log("Error retrieving schedules: ", error);
      }
    );
  }
}
