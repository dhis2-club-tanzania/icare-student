import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SettingsComponent } from "./settings/settings.component";
import { LabPriceListHomeContainerComponent } from "./containers/lab-price-list-home-container/lab-price-list-home-container.component";

const routes: Routes = [
  {
    path: "",
    component: SettingsComponent,
  },
  {
    path: "price-list",
    component: LabPriceListHomeContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
