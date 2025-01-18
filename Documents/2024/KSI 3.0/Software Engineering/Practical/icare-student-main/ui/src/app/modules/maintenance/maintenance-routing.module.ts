import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageUsersComponent } from "./containers/manage-users/manage-users.component";
import {
  AddUserComponent,
  UserManagementComponent,
  MaintenanceHomeComponent,
  LocationManagementComponent,
  EditUserComponent,
  PriceListHomeComponent,
} from "./pages";
import { DrugManagementComponent } from "./pages/drug-management/drug-management.component";
import { PrivilegesAndRolesComponent } from "./pages/privileges-and-roles/privileges-and-roles.component";
import { ReportsManagementComponent } from "./pages/reports-management/reports-management.component";
import { ReportsSettingsComponent } from "./pages/reports-settings/reports-settings.component";
import { SystemSettingsComponent } from "./pages/system-settings/system-settings.component";

// TODO: Improve routing, at least include child routing
const routes: Routes = [
  {
    path: "",
    component: MaintenanceHomeComponent,
    children: [
      // TODO: Need to find best starting page for maintenance
      // {
      //   path: "",
      //   redirectTo: "price-list",
      // },
      {
        path: "price-list",
        component: PriceListHomeComponent,
      },
      {
        path: "price-list/:department",
        component: PriceListHomeComponent,
      },
      {
        path: "users-management",
        component: UserManagementComponent,
      },
      {
        path: "location",
        component: LocationManagementComponent,
      },
      {
        path: "users-management/manage-user",
        component: ManageUsersComponent,
      },
      {
        path: "users-management/edit-user",
        component: EditUserComponent,
      },
      {
        path: "system-settings",
        component: SystemSettingsComponent,
      },
      {
        path: "system-privileges-and-roles",
        component: PrivilegesAndRolesComponent,
      },
      {
        path: "drug",
        component: DrugManagementComponent,
      },
      {
        path: "reports-settings",
        component: ReportsSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRoutingModule {}
