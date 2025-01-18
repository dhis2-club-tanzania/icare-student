import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { LocationService } from "src/app/core/services";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { LocationtagGetFull } from "../../resources/openmrs";

@Component({
  selector: "app-shared-location-settings-home",
  templateUrl: "./shared-location-settings-home.component.html",
  styleUrls: ["./shared-location-settings-home.component.scss"],
})
export class SharedLocationSettingsHomeComponent implements OnInit {
  @Input() key: string;
  locationTags$: Observable<LocationtagGetFull[]>;
  locationTagsUuids$: Observable<any[]>;
  constructor(
    private locationService: LocationService,
    private systemSettingService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.locationTags$ = this.locationService.getLocationTags();
    this.locationTagsUuids$ =
      this.systemSettingService.getSystemSettingsMatchingAKey(this.key);
  }
}
