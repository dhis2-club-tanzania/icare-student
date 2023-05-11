import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CurrentDashboardComponent } from './components/current-dashboard/current-dashboard.component';
import { DashboardItemComponent } from './components/dashboard-item/dashboard-item.component';



@NgModule({
  declarations: [
    DashboardComponent,
    CurrentDashboardComponent,
    DashboardItemComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
