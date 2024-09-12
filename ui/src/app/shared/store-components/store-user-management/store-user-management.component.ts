import { Component, OnInit } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";
import { AppState } from "src/app/store/reducers";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-store-user-management",
  templateUrl: "./store-user-management.component.html",
  styleUrls: ["./store-user-management.component.scss"],
})
export class StoreUserManagementComponent implements OnInit {
  currentUser$: Observable<any>;
  constructor(private store: Store<AppState>,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUserDetails);
  }

  onTabChanged(event: MatTabChangeEvent): void {
    this.trackActionForAnalytics(`${event.tab.textLabel}: Open`);
  }

  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }
}
