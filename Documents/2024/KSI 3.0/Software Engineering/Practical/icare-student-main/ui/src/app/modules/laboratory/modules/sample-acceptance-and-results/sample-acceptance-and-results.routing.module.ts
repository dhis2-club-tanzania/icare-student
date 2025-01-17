import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AcceptOrRejectSampleContainerComponent } from "./containers/accept-or-reject-sample-container/accept-or-reject-sample-container.component";
import { HomeComponent } from "./pages/home/home.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SampleAcceptanceAndResultsRoutingModule {}
