import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { take } from "lodash";
import { map } from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { SamplesService } from "src/app/shared/services/samples.service";

@Component({
  selector: "app-bar-code-print-modal",
  templateUrl: "./bar-code-print-modal.component.html",
  styleUrls: ["./bar-code-print-modal.component.scss"],
})
export class BarCodePrintModalComponent implements OnInit {
  barCodeValue: string;
  elementType = "svg";
  format = "CODE128";
  lineColor = "#000000";
  width = 1.2;
  height = 40;
  fontSize = "10";
  displayValue = true;
  sample: any;
  ordersToDisplay: any[];
  dialogData: any;
  bcTextPosition: string = "top";
  bcTextAlign: string = "left";
  sampleData$: any;
  printersField: Dropdown
  selectedPrinter: string;
  connection: any;

  constructor(
    private sampleService: SamplesService,
    private dialogRef: MatDialogRef<BarCodePrintModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.barCodeValue = data?.identifier;
    this.sample = data?.sample;
    this.ordersToDisplay = take(this.sample?.orders, 2);
    this.dialogData = data;
  }

  ngOnInit(): void {
   if(this.dialogData?.printers){
      this.printersField = new Dropdown({
        id: "printer",
        label: "Select Printer",
        key: "printer",
        options: this.dialogData.printers?.map((printer) => {
            return {
              key: printer,
              value: printer,
              label: printer
            }
        })
      })
    }


    this.sampleData$ = this.sampleService.getSampleByUuid(
      this.dialogData?.sampleLabelsUsedDetails[0]?.uuid
    )?.pipe(map((sample) => {
      return {
        ...sample,
        stringTests: sample?.orders?.map((order) => {
          return order?.order?.concept?.display.split(":")[1];
        }).join(",")
      }
    }));
  }

  onFormUpdate(formValue: FormValue){
    this.selectedPrinter = formValue.getValues()?.printer?.value?.length > 0 ? formValue.getValues()?.printer?.value : null 
  }

  onPrint(e, sampleData?: any, sampleDetails?: any) {
    e.stopPropagation();
    const results = {
      sampleData: sampleData, 
      sampleDetails: sampleDetails, 
      confirmed: true, 
      selectedPrinter: this.selectedPrinter
    }
    
    // this.dialogRef.close(results)
  }
  
  onCancel(e) {
    e.stopPropagation();
    // this.connection?.complete();
    // this.dialogRef.close();
  }
}
