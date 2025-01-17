import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { take, flatten } from "lodash";
import { map } from "rxjs/operators";
import { SamplesService } from "src/app/shared/services/samples.service";

@Component({
  selector: "app-bar-code-modal",
  templateUrl: "./bar-code-modal.component.html",
  styleUrls: ["./bar-code-modal.component.scss"],
})
export class BarCodeModalComponent implements OnInit {
  barCodeValue: string;
  elementType = "svg";
  format = "CODE128";
  lineColor = "#000000";
  width = 1.2;
  height = 40;
  fontSize = "20";
  displayValue = true;
  sample: any;
  ordersToDisplay: any[];
  dialogData: any;
  bcTextPosition: string = "top";
  bcTextAlign: string = "left";
  sampleData$: any;

  constructor(
    private sampleService: SamplesService,
    private dialogRef: MatDialogRef<BarCodeModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.barCodeValue = data?.identifier;
    this.sample = data?.sample;
    this.ordersToDisplay = take(this.sample?.orders, 2);
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.sampleData$ = this.sampleService
      .getSampleByUuid(
        this.dialogData?.sample
          ? this.dialogData?.sample?.uuid
          : this.dialogData?.sampleLabelsUsedDetails[0]?.uuid
      )
      ?.pipe(
        map((sample) => {
          return {
            ...sample,
            stringTests: sample?.orders
              ?.map((order) => {
                return order?.order?.concept?.display.split(":")[1];
              })
              .join(","),
          };
        })
      );
  }

  onDone(e, sampleLabelsUsedDetails?: any, sampleData?: any) {
    e.stopPropagation();
    this.dialogRef.close({
      sampleLableUsedDetails: sampleLabelsUsedDetails,
      sampleData: sampleData,
    });
  }
}
