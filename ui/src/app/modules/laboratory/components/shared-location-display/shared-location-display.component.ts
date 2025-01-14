import { Component, Input, OnInit } from "@angular/core";
import { Observable, from } from "rxjs";
import { Api, LocationGet } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-shared-location-display",
  templateUrl: "./shared-location-display.component.html",
  styleUrls: ["./shared-location-display.component.scss"],
})
export class SharedLocationDisplayComponent implements OnInit {
  @Input() referredHFUuid: string;
  location$: Observable<LocationGet>;
  constructor(private api: Api) {}

  ngOnInit(): void {
    this.location$ = from(this.api.location.getLocation(this.referredHFUuid));
  }
}
