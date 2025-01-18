import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-system-settings",
  templateUrl: "./system-settings.component.html",
  styleUrls: ["./system-settings.component.scss"],
})
export class SystemSettingsComponent implements OnInit {
  systemSettingsGroups$: Observable<any[]>;
  constructor(private systemSettingsService: SystemSettingsService) {}

  ngOnInit(): void {
    this.systemSettingsGroups$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.general.systemSettings.groups"
      );
  }
}
