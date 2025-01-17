import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ExpiredItemsComponent } from "../../shared/store-components/expired-items/expired-items.component";
import { StoreHomeComponent } from "src/app/shared/store-pages/store-home/store-home.component";
import { StockComponent } from "src/app/shared/store-pages/stock/stock.component";
import { RequisitionPageComponent } from "src/app/shared/store-pages/requisition-page/requisition-page.component";
import { IssuingPageComponent } from "src/app/shared/store-pages/issuing-page/issuing-page.component";
import { StoreTransactionComponent } from "src/app/shared/store-pages/store-transaction/store-transaction.component";
import { StockOutItemsComponent } from "src/app/shared/store-components/stock-out-items/stock-out-items.component";
import { StoreSettingsComponent } from "src/app/shared/store-pages/store-settings/store-settings.component";
import { NearlyStockedOutItemsComponent } from "src/app/shared/store-components/nearly-stocked-out/nearly-stocked-out-items.component";
import { NearlyExpiredItemsComponent } from "src/app/shared/store-components/nearly-expired/nearly-expired-items.component";
import { StoreHomePageComponent } from "./pages/store-home-page/store-home-page.component";

const routes: Routes = [
  {
    path: "",
    component: StoreHomePageComponent,
    children: [
      {
        path: "",
        redirectTo: "stock",
        pathMatch: "full",
      },
      {
        path: "stock",
        component: StockComponent,
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
        path: "transaction",
        component: StoreTransactionComponent,
      },
      {
        path: "settings",
        component: StoreSettingsComponent,
      },
      {
        path: "stockout-items/:location",
        component: StockOutItemsComponent,
      },
      {
        path: "expired-items/:location",
        component: ExpiredItemsComponent,
      },
      {
        path: "nearly-stocked-out-items/:location",
        component: NearlyStockedOutItemsComponent,
      },
      {
        path: "nearly-expired-items/:location",
        component: NearlyExpiredItemsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule {}
