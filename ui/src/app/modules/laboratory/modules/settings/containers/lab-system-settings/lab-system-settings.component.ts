import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-lab-system-settings",
  templateUrl: "./lab-system-settings.component.html",
  styleUrls: ["./lab-system-settings.component.scss"],
})
export class LabSystemSettingsComponent implements OnInit {
  systemSettingsGroups$: Observable<any[]>;
  @Input() currentUser: any;
  constructor(private systemSettingsService: SystemSettingsService) {}

  ngOnInit(): void {
    this.systemSettingsGroups$ = this.systemSettingsService
      .getSystemSettingsByKey("iCare.general.systemSettings.groups")
      .pipe(
        map((response: any) => {
          return this.currentUser?.userPrivileges["ALL"]
            ? response
            : response?.filter((group: any) =>
                group?.privileges?.every((privName) => {
                  const returnedPrivilege =
                    this.currentUser?.userPrivileges[privName];
                  return returnedPrivilege ? true : false;
                })
              );
        })
      );
  }
}
