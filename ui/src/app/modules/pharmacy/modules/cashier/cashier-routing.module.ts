import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CashierHomeComponent } from "./pages/cashier-home/cashier-home.component";
const routes: Routes = [
  {
    path: "",
    component: CashierHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashierRoutingModule {}
