import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LaboratorySampleCollectionComponent } from "./pages/laboratory-sample-collection/laboratory-sample-collection.component";
import { SampleCollectionHomeComponent } from "./pages/sample-collection-home/sample-collection-home.component";

const routes: Routes = [
  {
    path: "",
    component: SampleCollectionHomeComponent,
  },
  {
    path: ":patientId/:visitId",
    component: LaboratorySampleCollectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SampleCollectionRoutingModule {}
