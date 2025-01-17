import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-drug-management",
  templateUrl: "./drug-management.component.html",
  styleUrls: ["./drug-management.component.scss"],
})
export class DrugManagementComponent implements OnInit {
  mappingSource$: Observable<any>;
  constructor(private systemSettingsService: SystemSettingsService) {}

  ngOnInit(): void {
    this.mappingSource$ = this.systemSettingsService.getSystemSettingsByKey(
      `iCare.store.mappings.items.unitOfMeasure.mappingSource`
    );
  }
}
