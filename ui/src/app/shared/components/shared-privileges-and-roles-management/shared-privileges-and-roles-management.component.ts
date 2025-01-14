import { Component, Input, OnInit } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";

@Component({
  selector: "app-shared-privileges-and-roles-management",
  templateUrl: "./shared-privileges-and-roles-management.component.html",
  styleUrls: ["./shared-privileges-and-roles-management.component.scss"],
})
export class SharedPrivilegesAndRolesManagementComponent implements OnInit {
  @Input() currentUser: any;
  constructor( private googleAnalyticsService: GoogleAnalyticsService
    
  ) {}

  ngOnInit(): void {}

  onTabChanged(event: MatTabChangeEvent): void {
    this.trackActionForAnalytics(`${event.tab.textLabel}: Open`);
  }
  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }

}
