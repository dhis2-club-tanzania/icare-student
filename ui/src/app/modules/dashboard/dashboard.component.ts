import { Component, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { Observable } from 'rxjs';
import * as Highcharts from 'highcharts'
import { Chart } from 'chart.js';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';
import HighchartsAccessibility from 'highcharts/modules/accessibility';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  dashboards$: Observable<any[]>;
  dataService: any;
  totalPatients: any;
  chart: Chart;

  constructor(private dashboardService: DashboardService) { }
  // constructor() { }

  ngOnInit() {

    // this.dataService.fetchData('/api/patients/total').subscribe(data => {
    //   this.totalPatients = data;

    //   const chartOptions = {
    //     animationEnabled: true,
    //     title: {
    //       text: "Total Patients"
    //     },
    //     data: [{
    //       type: "pie",
    //       startAngle: -90,
    //       indexLabel: "{name}: {y}",
    //       yValueFormatString: "#,###.##'%'",
    //       dataPoints: [
    //         { y: 14.1, name: "Students" },
    //         { y: 28.2, name: "Staff" },
    //         { y: 14.4, name: "Other" },

    //       ]
    //     }]
    //   }

    // }
    // )

  HighchartsExporting(Highcharts);
  HighchartsExportData(Highcharts);
  HighchartsAccessibility(Highcharts);

  Highcharts.chart('chartContainer', {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Bar Chart'
    },
    xAxis: {
      categories: ['Category 1', 'Category 2', 'Category 3']
    },
    yAxis: {
      title: {
        text: 'Values'
      }
    },
    series: [{
      name: 'Series 1',
      data: [10, 20, 30]
    }]
  }as Highcharts.Options);

  }
}