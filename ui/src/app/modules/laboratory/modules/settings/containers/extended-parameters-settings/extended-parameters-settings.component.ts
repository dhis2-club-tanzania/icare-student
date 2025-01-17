import { Component, Input, OnInit } from "@angular/core";
import { iCareConnectConfigurationsModel } from "src/app/core/models/lis-configurations.model";

@Component({
  selector: "app-extended-parameters-settings",
  templateUrl: "./extended-parameters-settings.component.html",
  styleUrls: ["./extended-parameters-settings.component.scss"],
})
export class ExtendedParametersSettingsComponent implements OnInit {
  @Input() LISConfigurations: iCareConnectConfigurationsModel;
  constructor() {}

  ngOnInit(): void {}
}
