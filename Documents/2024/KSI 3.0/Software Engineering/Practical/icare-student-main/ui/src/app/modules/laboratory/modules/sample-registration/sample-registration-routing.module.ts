import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SampleRegistrationHomeComponent } from "./pages/sample-registration-home/sample-registration-home.component";

const routes: Routes = [
  {
    path: "",
    component: SampleRegistrationHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SampleRegistrationRoutingModule {}
