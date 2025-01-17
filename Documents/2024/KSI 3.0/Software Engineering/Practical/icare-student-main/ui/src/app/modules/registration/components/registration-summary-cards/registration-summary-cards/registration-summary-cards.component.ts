import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";

@Component({
  selector: "app-registration-summary-cards",
  templateUrl: "./registration-summary-cards.component.html",
  styleUrls: ["./registration-summary-cards.component.scss"],
})
export class RegistrationSummaryCardsComponent implements OnInit {
  @Input() roomNo: number;
  @Input() location: any;
  @Input() totalActivePatients: number;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  routeToPatientsListByLocation(event: Event, location): void {
    event.stopPropagation();
    this.store.dispatch(
      go({ path: [`/registration/patients-list/location/${location?.uuid}`] })
    );
  }
}
