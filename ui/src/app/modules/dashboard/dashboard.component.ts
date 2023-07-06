import { Component, OnInit } from '@angular/core';
// import { Component, AfterViewInit}, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { from, Observable } from 'rxjs';
import * as Highcharts from 'highcharts';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
// import { OnInit } from '@angular/core';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})

export class DashboardComponent implements OnInit {
//   //  export class DashboardComponent implements AfterViewInit {
// [x: string]: any;

  dashboards$: Observable<any[]>;
  dataService: any;
  totalPatients: any;
  chart: Highcharts.Chart;
s: any;
currentStore$: any;
privileges$: any;



  constructor(private dashboardService: DashboardService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  // constructor() { }

//   ngOnInit() { 
  //  //     chart: {
  //  //        type: "spline",
  //  //        renderTo: 'spline'
  //  //     },
  //  //     title: {
  //  //        text: "Overall Patients Annually"
  //  //     },
  //  //     xAxis:{
  //  //        categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //  //           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  //  //     },
  //  //     yAxis: {          
  //  //        title:{
  //  //           text:"Percentage %"
  //  //        } 
  //  //     },
  //  //     tooltip: {
  //  //        valueSuffix:"%"
  //  //     },
  //  //     series: [
        
  //  //        {
  //  //           name: 'other',
  //  //           data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8,24.1, 20.1, 14.1, 8.6, 2.5]
  //  //        },
  //  //     ]
  //  //  };
    
  //  //  this.chart = Highcharts.chart(chartOptions as any);
   public ngAfterViewInit(): void {
    
      this.dashboards$ = this.dashboardService.getAllDashboards();
      this.createChartPie();
      this.createChartColumn();
      this.createChartLine();
    }
   // }
  
    private getRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
  
  
    private createChartPie(): void {
      let date = new Date();
      const data: any[] = [];
  
      for (let i = 0; i < 3; i++) {
        date.setDate(new Date().getDate() + i);
        data.push({
          name: `${date.getDate()}/${date.getMonth() + 1}`,
          y: this.getRandomNumber(0, 1000),
        });
      }
  
      const chart = Highcharts.chart('chart-pie', {
        chart: {
          type: 'pie',
        },
        title: {
          text: 'Total Patients By Category',
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          headerFormat: `<span class="mb-2">Date: {point.key}</span><br>`,
          pointFormat: '<span>Amount: {point.y}</span>',
          useHTML: true,
        },
        series: [{
          name: null,
          innerSize: '50%',
          data,
        }],
      } as any);
  
      // setInterval(() => {
      //   date.setDate(date.getDate() + 1);
      //   chart.series[0].addPoint({
      //     name: `${date.getDate()}/${date.getMonth() + 1}`,
      //     y: this.getRandomNumber(0, 1000),
      //   }, true, true);
      // }, 1500);
      
    }
  
    private createChartColumn(): void {
      let date = new Date();
      const data: any[] = [];
  
      for (let i = 0; i < 10; i++) {
        date.setDate(new Date().getDate() + i);
        data.push({
          name: `${date.getDate()}/${date.getMonth() + 1}`,
          y: this.getRandomNumber(0, 1000),
        });
      }
  
      const chart = Highcharts.chart('chart-column' as any, {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Overall Patients Annually',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        yAxis: {
          min: 0,
          title:undefined,
        },
        xAxis: {
          type: 'Months',
        },
        tooltip: {
          headerFormat: `<div>Date: {point.key}</div>`,
          pointFormat: `<div>{series.name}: {point.y}</div>`,
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: [{
          name: 'Amount',
          data,
        }],
      } as any);
  
      // setInterval(() => {
      //   date.setDate(date.getDate() + 1);
      //   chart.series[0].addPoint({
      //     name: `${date.getDate()}/${date.getMonth() + 1}`,
      //     y: this.getRandomNumber(0, 1000),
      //   }, true, true);
      // }, 1500);
    }
  
    private createChartLine(): void {
      let date = new Date();
      const data: any[] = [];
  
      for (let i = 0; i < 10; i++) {
        date.setDate(new Date().getDate() + i);
        data.push([`${date.getDate()}/${date.getMonth() + 1}`, this.getRandomNumber(0, 1000)]);
      }
  
      const chart = Highcharts.chart('chart-line', {
        chart: {
          type: 'line',
        },
        title: {
          text: 'Mortality Rate',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        yAxis: {
          title: {
            text: null,
          }
        },
        xAxis: {
          type: 'category',
        },
        tooltip: {
          headerFormat: `<div>Date: {point.key}</div>`,
          pointFormat: `<div>{series.name}: {point.y}</div>`,
          shared: true,
          useHTML: true,
        },
        series: [{
          name: 'Amount',
          data,
        }],
      } as any);
  
      // setInterval(() => {
      //   date.setDate(date.getDate() + 1);
      //   chart.series[0].addPoint([`${date.getDate()}/${date.getMonth() + 1}`, this.getRandomNumber(0, 1000)], true, true);
      // }, 1500);
    }
  
  }


