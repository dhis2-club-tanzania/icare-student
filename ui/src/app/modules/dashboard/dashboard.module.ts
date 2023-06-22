import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { CurrentDashboardComponent } from './components/current-dashboard/current-dashboard.component';
import { DashboardItemComponent } from './components/dashboard-item/dashboard-item.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { Chart } from 'chart.js'
@NgModule({
  declarations: [
    DashboardComponent,
    CurrentDashboardComponent,
    DashboardItemComponent,
   
  ],
  imports: [
    CommonModule,DashboardRoutingModule, Chart
  ]
})
export class DashboardModule { 

}
