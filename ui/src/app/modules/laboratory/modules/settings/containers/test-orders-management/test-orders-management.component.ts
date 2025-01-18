import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DataTypesService } from "src/app/core/services/datatypes.service";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ConceptdatatypeGet } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-test-orders-management",
  templateUrl: "./test-orders-management.component.html",
  styleUrls: ["./test-orders-management.component.scss"],
})
export class TestOrdersManagementComponent implements OnInit {
  conceptDataTypes$: Observable<ConceptdatatypeGet[]>;
  testRelationshipMappingSourceUuid$: Observable<string>;
  constructor(
    private dataTypesService: DataTypesService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.conceptDataTypes$ = this.dataTypesService.getDataTypes();
    this.testRelationshipMappingSourceUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.lis.testParameterRelationship.conceptSourceUuid"
      );
  }
}
