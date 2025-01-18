import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-lab-system-settings",
  templateUrl: "./lab-system-settings.component.html",
  styleUrls: ["./lab-system-settings.component.scss"],
})
export class LabSystemSettingsComponent implements OnInit {
  systemSettingsGroups$: Observable<any[]>;
  constructor(private systemSettingsService: SystemSettingsService) {}

  ngOnInit(): void {
    this.systemSettingsGroups$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.general.systemSettings.groups"
      );
  }
}
