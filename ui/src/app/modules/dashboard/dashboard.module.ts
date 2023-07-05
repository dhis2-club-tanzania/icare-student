import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { CurrentDashboardComponent } from './components/current-dashboard/current-dashboard.component';
import { DashboardItemComponent } from './components/dashboard-item/dashboard-item.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    CurrentDashboardComponent,
    DashboardItemComponent,
  
   
  ],
  imports: [
    CommonModule,DashboardRoutingModule,SharedModule
  ]
})
export class DashboardModule { 

}
