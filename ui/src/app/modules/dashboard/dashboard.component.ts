import { Component, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { Observable } from 'rxjs';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  dashboards$: Observable<any[]>;
  dataService: any;
  totalPatients: any;
  chart: Highcharts.Chart;


  constructor(private dashboardService: DashboardService) { }
  // constructor() { }

  ngOnInit() {
   this.dashboards$ = this.dashboardService.getAllDashboards();
   
    const Charts = Highcharts;
    const chartOptions = {   
       chart: {
          type: "spline",
          renderTo: 'spline'
       },
       title: {
          text: "Total Patients Annually"
       },
       xAxis:{
          categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun",
             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
       },
       yAxis: {          
          title:{
             text:"Percentage %"
          } 
       },
       tooltip: {
          valueSuffix:"%"
       },
       series: [
        
          {
             name: 'other',
             data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8,24.1, 20.1, 14.1, 8.6, 2.5]
          },
          {
             name: 'staff',
             data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
          },
          {
             name: 'students',
             data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
          }
       ]
    };

    this.chart = Highcharts.chart(chartOptions as any);
 }
} 
    