import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { SystemUsersService } from "src/app/core/services/system-users.service";

@Component({
  selector: "app-manage-users",
  templateUrl: "./manage-users.component.html",
  styleUrls: ["./manage-users.component.scss"],
})
export class ManageUsersComponent implements OnInit {
  userId: string;
  user$: Observable<any>;
  systemModules$: Observable<any[]>;
  constructor(
    private route: ActivatedRoute,
    private usersService: SystemUsersService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParams["id"];
    this.systemModules$ = this.systemSettingsService.getSystemSettingsByKey(
      `iCare.general.systemSettings.UIModules`
    );
    if (this.userId) {
      this.user$ = this.usersService.getUserById(this.userId);
    }
  }
}
