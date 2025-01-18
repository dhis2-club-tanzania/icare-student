import { Component, Input, OnInit } from "@angular/core";
import * as Highcharts from "highcharts";
@Component({
  selector: "app-shared-dashboard-chart-item",
  templateUrl: "./shared-dashboard-chart-item.component.html",
  styleUrls: ["./shared-dashboard-chart-item.component.scss"],
})
export class SharedDashboardChartItemComponent implements OnInit {
  @Input() samplesData: any;
  chart: any;
  constructor() {}

  ngOnInit(): void {
    this.drawChart("Samples by Statuses", this.samplesData);
  }

  drawChart(categoryName: string, data): void {
    setTimeout(() => {
      this.chart = Highcharts.chart(
        "container" as any,
        {
          chart: {
            type: "column",
          },
          title: {
            text: "Samples by Statuses",
          },

          xAxis: {
            categories: data.map((dataRow) => dataRow?.category),
            crosshair: true,
          },
          yAxis: {
            min: 0,
            title: {
              text: "Samples",
            },
          },
          tooltip: {
            headerFormat:
              '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:
              '<tr><td style="color:{series.color};padding:0"></td>' +
              '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: "</table>",
            shared: true,
            useHTML: true,
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
            },
          },
          series: [
            {
              name: categoryName,
              data: data.map((dataRow) =>
                Number(
                  parseInt(
                    (
                      dataRow?.samples?.filter(
                        (sample) =>
                          (
                            sample?.statuses?.filter(
                              (status) =>
                                status?.status?.toLowerCase() ===
                                dataRow?.category?.toLowerCase()
                            ) || []
                          )?.length > 0
                      ) || []
                    )?.length
                  ).toFixed(0)
                )
              ),
            },
          ],
        } as any
      );
    }, 500);
  }
}
