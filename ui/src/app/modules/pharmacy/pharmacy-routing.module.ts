import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PharmacyComponent } from "./containers/pharmacy/pharmacy.component";
import { StockComponent } from "src/app/shared/store-pages/stock/stock.component";
import { RequisitionPageComponent } from "src/app/shared/store-pages/requisition-page/requisition-page.component";
import { IssuingPageComponent } from "src/app/shared/store-pages/issuing-page/issuing-page.component";
import { StoreSettingsComponent } from "src/app/shared/store-pages/store-settings/store-settings.component";
import { StoreReportsComponent } from "src/app/shared/store-pages/store-reports/store-reports.component";
import { StoreRenderStandardReportComponent } from "src/app/shared/store-pages/store-render-standard-report/store-render-standard-report.component";
import { StoresComponent } from "src/app/shared/store-pages/stores/stores.component";
const routes: Routes = [
  {
    path: "",
    component: PharmacyComponent,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("./modules/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "cashier",
        loadChildren: () =>
          import("./modules/cashier/cashier.module").then(
            (m) => m.CashierModule
          ),
      },
      {
        path: "stock",
        component: StoresComponent,
      },
      {
        path: "requisition",
        component: RequisitionPageComponent,
      },
      {
        path: "issuing",
        component: IssuingPageComponent,
      },
      {
        path: "reports",
        component: StoreReportsComponent,
      },
      {
        path: "reports/:id",
        component: StoreRenderStandardReportComponent,
      },
      {
        path: "settings",
        component: StoreSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyRoutingModule {}
