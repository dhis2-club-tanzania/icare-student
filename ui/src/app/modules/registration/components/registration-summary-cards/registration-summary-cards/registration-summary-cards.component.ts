import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";
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

  constructor(private store: Store<AppState>,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {

    
  }

  ngOnInit(): void {}

  routeToPatientsListByLocation(event: Event, location): void {
    event.stopPropagation();
    this.store.dispatch(
      go({ path: [`/registration/patients-list/location/${location?.uuid}`] })
    );

    this.trackActionForAnalytics(`Active Patient: View`)
  }


  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Registration',eventname,'Registration')
  }
}
