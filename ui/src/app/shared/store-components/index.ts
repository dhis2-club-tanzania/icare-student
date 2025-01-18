import { ExpiredItemsComponent } from "./expired-items/expired-items.component";
import { InvoiceFiltersComponent } from "./invoice-filters/invoice-filters.component";
import { IssueItemsComponent } from "./issue-items/issue-items.component";
import { IssuingStockByStoreComponent } from "./issuing-stock-by-store/issuing-stock-by-store.component";
import { LedgersListComponent } from "./ledgers-list/ledgers-list.component";
import { NearlyExpiredItemsComponent } from "./nearly-expired/nearly-expired-items.component";
import { NearlyStockedOutItemsComponent } from "./nearly-stocked-out/nearly-stocked-out-items.component";
import { NewRequisitionFormComponent } from "./new-requisition-form/new-requisition-form.component";
import { QuantityFormFieldComponent } from "./quantity-form-field/quantity-form-field.component";
import { ReOrderLevelItemsListComponent } from "./re-order-level-items-list/re-order-level-items-list.component";
import { RequisitionItemsComponent } from "./requisition-items/requisition-items.component";
import { RequisitionReceiptByStoreComponent } from "./requisition-receipt-by-store/requisition-receipt-by-store.component";
import { StockBatchListComponent } from "./stock-batch-list/stock-batch-list.component";
import { StockInOtherUnitsComponent } from "./stock-in-other-units/stock-in-other-units.component";
import { StockInvoiceItemsComponent } from "./stock-invoice-items/stock-invoice-items.component";
import { StockInvoiceComponent } from "./stock-invoice/stock-invoice.component";
import { StockInvoicesListComponent } from "./stock-invoices-list/stock-invoices-list.component";
import { StockMetricsComponent } from "./stock-metrics/stock-metrics.component";
import { StockOutItemsComponent } from "./stock-out-items/stock-out-items.component";
import { StockReceivingFormFieldsComponent } from "./stock-receiving-form-fields/stock-receiving-form-fields.component";
import { StockReceivingFormComponent } from "./stock-receiving-form/stock-receiving-form.component";
import { StockStatusListComponent } from "./stock-status-list/stock-status-list.component";
import { AddAllToPaginator } from "./stock-status-list/add-All-To-Paginator.directive";
import { SupplierFormComponent } from "./supplier-form/supplier-form.component";
import { SuppliersListComponent } from "./suppliers-list/suppliers-list.component";
import { TotalizeStockUnitsQuantityComponent } from "./totalize-stock-units-quantity/totalize-stock-units-quantity.component";
import { PriceListItemsContainerComponent } from "./price-list-items-container/price-list-items-container.component";
import { StoreUserManagementComponent } from "./store-user-management/store-user-management.component";
import { StoreUserManagementDashboardComponent } from "./store-user-management-dashboard/store-user-management-dashboard.component";
import { StoreUsersListComponent } from "./store-users-list/store-users-list.component";
import { SharedDynamicReportsComponent } from "./shared-dynamic-reports/shared-dynamic-reports.component";

// export const stockComponents: any[] = [
export const sharedStoreComponents: any[] = [
  AddAllToPaginator,
  StockBatchListComponent,
  StockStatusListComponent,
  StockOutItemsComponent,
  LedgersListComponent,
  StockInOtherUnitsComponent,
  TotalizeStockUnitsQuantityComponent,
  ReOrderLevelItemsListComponent,
  IssuingStockByStoreComponent,
  RequisitionReceiptByStoreComponent,
  StockReceivingFormComponent,
  SupplierFormComponent,
  SuppliersListComponent,
  StockReceivingFormFieldsComponent,
  StockInvoiceComponent,
  StockInvoicesListComponent,
  StockInvoiceItemsComponent,
  NewRequisitionFormComponent,
  RequisitionItemsComponent,
  IssueItemsComponent,
  StockMetricsComponent,
  ExpiredItemsComponent,
  NearlyStockedOutItemsComponent,
  NearlyExpiredItemsComponent,
  InvoiceFiltersComponent,
  QuantityFormFieldComponent,
  PriceListItemsContainerComponent,
  StoreUserManagementComponent,
  StoreUserManagementDashboardComponent,
  StoreUsersListComponent,
  SharedDynamicReportsComponent,
];
