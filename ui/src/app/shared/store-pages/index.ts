import { IssuingPageComponent } from "./issuing-page/issuing-page.component";
import { IssuingComponent } from "./issuing/issuing.component";
import { RequisitionByStoreComponent } from "./requisition-by-store/requisition-by-store.component";
import { RequisitionPageComponent } from "./requisition-page/requisition-page.component";
import { RequisitionReceiptComponent } from "./requisition-receipt/requisition-receipt.component";
import { RequisitionComponent } from "./requisition/requisition.component";
import { StockComponent } from "./stock/stock.component";
import { StoreHomeComponent } from "./store-home/store-home.component";
import { StoreRenderStandardReportComponent } from "./store-render-standard-report/store-render-standard-report.component";
import { StoreReportsComponent } from "./store-reports/store-reports.component";
import { StoreSettingsComponent } from "./store-settings/store-settings.component";
import { StoreTransactionComponent } from "./store-transaction/store-transaction.component";
import { StoresComponent } from "./stores/stores.component";

export const sharedStorePages: any[] = [
  StoreHomeComponent,
  StockComponent,
  RequisitionComponent,
  IssuingComponent,
  StoreTransactionComponent,
  RequisitionReceiptComponent,
  RequisitionPageComponent,
  IssuingPageComponent,
  StoreSettingsComponent,
  RequisitionByStoreComponent,
  StoreReportsComponent,
  StoreRenderStandardReportComponent,
  StoresComponent,
];
