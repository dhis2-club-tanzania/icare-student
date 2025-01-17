import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { SettingsComponent } from "./settings/settings.component";
import { SettingsRoutingModule } from "./settings-routing.module";
import { HomeComponent } from "./pages/home/home.component";
import { TestSettingsComponent } from "./components/test-settings/test-settings.component";
import { components, entrySettingComponents } from "./components";
import { TestSelectorComponent } from "./components/test-selector/test-selector.component";
import { TestTimeComponent } from "./components/test-time/test-time.component";
import { TestMaleRangeComponent } from "./components/test-male-range/test-male-range.component";
import { TestFemaleRangeComponent } from "./components/test-female-range/test-female-range.component";
import { TimeSettingsListComponent } from "./components/time-settings-list/time-settings-list.component";
import { TestMaleRangeListComponent } from "./components/test-male-range-list/test-male-range-list.component";
import { TestFemaleRangeListComponent } from "./components/test-female-range-list/test-female-range-list.component";
import { TestMethodsDashboardComponent } from "./containers/test-methods-dashboard/test-methods-dashboard.component";
import { SpecimenSourcesDashboardComponent } from "./containers/specimen-sources-dashboard/specimen-sources-dashboard.component";
import { ParametersDashboardComponent } from "./containers/parameters-dashboard/parameters-dashboard.component";
import { ProfilesAndAccessControlComponent } from "./containers/profiles-and-access-control/profiles-and-access-control.component";
import { ExtendedParametersSettingsComponent } from "./containers/extended-parameters-settings/extended-parameters-settings.component";
import { settingsContainers } from "./containers";
import { SampleRegistrationModule } from "../sample-registration/sample-registration.module";

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    SampleRegistrationModule,
  ],
  declarations: [
    SettingsComponent,
    HomeComponent,
    TestSettingsComponent,
    ...components,
    ...settingsContainers,
    TestSelectorComponent,
    TestTimeComponent,
    TestMaleRangeComponent,
    TestFemaleRangeComponent,
    TimeSettingsListComponent,
    TestMaleRangeListComponent,
    TestFemaleRangeListComponent,
    TestMethodsDashboardComponent,
    SpecimenSourcesDashboardComponent,
    ParametersDashboardComponent,
    ProfilesAndAccessControlComponent,
    ExtendedParametersSettingsComponent,
  ],
  entryComponents: [...entrySettingComponents],
})
export class SettingsModule {}
