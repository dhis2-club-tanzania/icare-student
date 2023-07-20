import { Component, OnInit } from '@angular/core';
// import { Component, AfterViewInit}, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { from, Observable } from 'rxjs';
import * as Highcharts from 'highcharts';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
// import { OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';



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

   public ngAfterViewInit(): void {
    
      this.dashboards$ = this.dashboardService.getAllDashboards();
      this.createChartPie();
      this.createChartColumn();
      this.createLineChart();
      this.createStackedColumnChart();
      this.createComplicationChart();
      this.createFertilityColumnChart();
    }
   // }
  
  
  
    private createChartPie(): void {
      var data = [
        { category: 'Student', count: 500 },
        { category: 'Staff', count: 300 },
        { category: 'Others', count: 200 }
      ];

      const chart = Highcharts.chart('chart-pie', {
        chart: {
    type: 'pie'
  },
  title: {
    text: 'Patients by Category'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.y}',
        // style: {
        //   color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
        // }
      }
    }
  },
  series: [{
    name: 'Category',
    colorByPoint: true,
    data: data.map(item => ({
      name: item.category,
      y: item.count
    }))
  }],
  legend: {
    enabled: true
  }
}as any);
  
      // setInterval(() => {
      //   date.setDate(date.getDate() + 1);
      //   chart.series[0].addPoint({
      //     name: `${date.getDate()}/${date.getMonth() + 1}`,
      //     y: this.getRandomNumber(0, 1000),
      //   }, true, true);
      // }, 1500);
      
    }
  
    private createChartColumn(): void {
      const data: any[] = [
        { name: 'January', y: 120 },
        { name: 'February', y: 150 },
        { name: 'March', y: 180 },
        { name: 'April', y: 200 },
        { name: 'May', y: 220 },
        { name: 'June', y: 250 },
        { name: 'July', y: 280 },
        { name: 'August', y: 300 },
        { name: 'September', y: 320 },
        { name: 'October', y: 350 },
        { name: 'November', y: 380 },
        { name: 'December', y: 400 }
      ];
    
      const chart = Highcharts.chart('chart-column' as any, {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Overall Patients Intake Over a Year',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        yAxis: {
          min: 0,
          title: undefined,
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
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: [{
          name: 'Patients',
          data,
        }],
      } as any);
    }
  
    private createLineChart(): void {
      const data: any[] = [
        { week: 1, time: 4 },
        { week: 2, time: 5 },
        { week: 3, time: 6 },
        { week: 4, time: 6 },
        { week: 5, time: 5 },
        { week: 6, time: 3 },
        { week: 7, time: 4 },
        { week: 8, time: 7 },
        { week: 9, time: 2 },
        { week: 10, time: 6 },
        { week: 11, time: 5 },
        { week: 12, time: 3 },
        { week: 13, time: 7 },
        { week: 14, time: 4 },
        { week: 15, time: 2 },
        { week: 16, time: 6 },
        { week: 17, time: 3 },
        { week: 18, time: 5 },
        { week: 19, time: 6 },
        { week: 20, time: 4 },
        { week: 21, time: 7 },
        { week: 22, time: 2 },
        { week: 23, time: 3 },
        { week: 24, time: 5 },
        { week: 25, time: 4 },
        { week: 26, time: 6 },
        { week: 27, time: 5 },
        { week: 28, time: 4 },
        { week: 29, time: 7 },
        { week: 30, time: 2 },
        { week: 31, time: 3 },
        { week: 32, time: 6 },
        { week: 33, time: 4 },
        { week: 34, time: 5 },
        { week: 35, time: 7 },
        { week: 36, time: 3 },
        { week: 37, time: 6 },
        { week: 38, time: 5 },
        { week: 39, time: 4 },
        { week: 40, time: 7 },
        { week: 41, time: 2 },
        { week: 42, time: 4 },
        { week: 43, time: 6 },
        { week: 44, time: 5 },
        { week: 45, time: 3 },
        { week: 46, time: 7 },
        { week: 47, time: 4 },
        { week: 48, time: 3 },
        { week: 49, time: 5 },
        { week: 50, time: 7 },
        { week: 51, time: 4 },
        { week: 52, time: 6 }
      ];
    
      const chart = Highcharts.chart('chart-line' as any, {
        chart: {
          type: 'line',
        },
        title: {
          text: 'Laboratory Turnaround Time Trend',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: data.map(item => `Week ${item.week}`),
        },
        yAxis: {
          title: {
            text: 'Turnaround Time (hours)',
          },
        },
        tooltip: {
          headerFormat: `<div>Week: {point.key}</div>`,
          pointFormat: `<div>Turnaround Time: {point.y} hours</div>`,
          shared: true,
          useHTML: true,
        },
        series: [{
          name: 'Turnaround Time',
          data: data.map(item => item.time),
        }],
      } as any);
    }
  
    private createStackedColumnChart(): void {
      const data: any[] = [
        {
          name: 'Elderly',
          data: [5, 3, 4, 7, 2, 6, 4, 5, 3, 4, 7, 2]
        }, {
          name: 'Infants',
          data: [2, 2, 3, 2, 1, 5, 3, 2, 2, 3, 2, 1]
        }, {
          name: 'Youth',
          data: [3, 4, 4, 2, 5, 3, 4, 3, 4, 4, 2, 5]
        }
      ];
    
      const chart = Highcharts.chart('chart-stacked-column' as any, {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Mortality Rate by Category Over a Year',
        },
        credits: {
          enabled: false,
        },
        legend: {
          align: 'right',
          verticalAlign: 'top',
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Mortality Rate',
          },
        },
        xAxis: {
          categories: ['Adult', 'Youth', 'Infant'],
        },
        tooltip: {
          headerFormat: '<div>Month: {point.key}</div>',
          pointFormat: '<div>{series.name}: {point.y}</div>',
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: data
      } as any);
    }

    private createComplicationChart(): void {
      const data: any[] = [
        { quarter: 1, time: 4 },
        { quarter: 2, time: 5 },
        { quarter: 3, time: 6 },
        { quarter: 4, time: 6 }
        
      ];
    
      const chart = Highcharts.chart('chart-complication' as any, {
        chart: {
          type: 'line',
        },
        title: {
          text: 'Complication Trend',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          categories: data.map(item => `Quarter ${item.quarter}`),
        },
        yAxis: {
          title: {
            text: 'Complications',
          },
        },
        tooltip: {
          headerFormat: `<div>Quarter: {point.key}</div>`,
          pointFormat: `<div>Complications: {point.y}</div>`,
          shared: true,
          useHTML: true,
        },
        series: [{
          name: 'Complications',
          data: data.map(item => item.time),
        }],
      } as any);
    }
    private createFertilityColumnChart(): void {
      const data: any[] = [
        { name: '13-17', y: 5 },
        { name: '18-24', y: 6 },
        { name: '25-36', y: 4 },
        { name: '37-42', y: 3 },
        { name: '43-55', y: 2 },
      ];
    
      const chart = Highcharts.chart('chart-fertility' as any, {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Fertility Rate',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        yAxis: {
          min: 0,
          title: undefined,
        },
        xAxis: {
          type: 'category',
        },
        tooltip: {
          headerFormat: `<div>Age: {point.key}</div>`,
          pointFormat: `<div>{series.name}: {point.y}</div>`,
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: [{
          name: 'Rate',
          data,
        }],
      } as any);
    }

    private createAntenatalColumnChart(): void {
      
    }
  }


