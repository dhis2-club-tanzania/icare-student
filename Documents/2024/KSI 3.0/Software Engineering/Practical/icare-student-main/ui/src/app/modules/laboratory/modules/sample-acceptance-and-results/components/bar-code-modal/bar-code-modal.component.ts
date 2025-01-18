import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { take } from "lodash";
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
    this.sampleData$ = this.sampleService.getSampleByUuid(
      this.dialogData?.sample ? this.dialogData?.sample?.uuid : this.dialogData?.sampleLabelsUsedDetails[0]?.uuid
    )?.pipe(map((sample) => {
      return {
        ...sample,
        stringTests: sample?.orders?.map((order) => {
          return order?.order?.concept?.display.split(":")[1];
        }).join(",")
      }
    }));
  }

  onPrint(e, sampleData?: any, sampleDetails?: any) {
    e.stopPropagation();
    // var contents = document.getElementById("bar-code").innerHTML;
    var barcode = document.getElementById("barcode").innerHTML;
    const frame1: any = document.createElement("iframe");
    frame1.name = "frame3";
    frame1.style.position = "absolute";
    frame1.style.width = "80%";
    frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);
    var frameDoc = frame1.contentWindow
      ? frame1.contentWindow
      : frame1.contentDocument.document
      ? frame1.contentDocument.document
      : frame1.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write(
      `<html>
        <head> 
          <style>
            button {display:none;}
            .bar-code-texts {
              font-weight: 600;
              font-size: 0.6rem !important;
              // z-index: 1200;
              line-height: 0.6rem !important;
              width: 80%;
            }
            .sample-info{
            margin-left: 20px;
            }
            .sample-info .text-left {
              float: left;
            }
            .sample-info .text-right {
              float: right;
            }

            .mt-1 {
              margin-top: 1px;
            }
            
            .mt-2 {
              margin-top: 2px;
            }

            .mt-3 {
              margin-top: 3px;
            }

            .sample-tests-list {
              margin-left: 10px;
              margin-top: 5px;
            }
            .dotted {
              background-color: transparent;
              border-top: dotted 1px;
            }
          </style>
        </head>
      <body>`
    );
    frameDoc.document.write(barcode);
    frameDoc.document.write(`
          <div class="bar-code-texts">
          <p class="sample-info mt-1">
            <span class="text-left">
              ${sampleData?.patient?.givenName}
            ${
              sampleData?.patient?.middleName
                ? sampleData?.patient?.middleName
                : ""
            }
            ${sampleData?.patient?.familyName}
            </span>
            <span class="text-right">
              ${new Date(sampleData?.dateTimeCreated).toDateString()}
            </span>
          </p>
          <br>
          <p class="sample-info mt-3">
            <span class="text-left">
              ${sampleDetails?.label}
            </span>
            <span class="text-right">
              <span>
                ${sampleDetails?.label}
              </span>
              <br>
              <span>
                ${sampleData?.patient?.givenName}
                ${
                  sampleData?.patient?.middleName
                    ? sampleData?.patient?.middleName
                    : ""
                }
                ${sampleData?.patient?.familyName}
              </span>
            </span>
          </p>
          <br>
          <p class="sample-tests-list mt-3">
            ${sampleData?.stringTests}
          </p>
          <hr class="dotted">
          <p>${sampleDetails?.label}</p>
        </div>
        <hr>
    `);
    frameDoc.document.write(`
          <div class="bar-code-texts">
          <p class="sample-info mt-1">
            <span class="text-left">
              ${sampleData?.patient?.givenName}
            ${
              sampleData?.patient?.middleName
                ? sampleData?.patient?.middleName
                : ""
            }
            ${sampleData?.patient?.familyName}
            </span>
            <span class="text-right">
              ${new Date(sampleData?.dateTimeCreated).toDateString()}
            </span>
          </p>
          <br>
          <p class="sample-info mt-3">
            <span class="text-left">
              ${sampleDetails?.label}
            </span>
            <span class="text-right">
              <span>
                ${sampleDetails?.label}
              </span>
              <br>
              <span>
                ${sampleData?.patient?.givenName}
                ${
                  sampleData?.patient?.middleName
                    ? sampleData?.patient?.middleName
                    : ""
                }
                ${sampleData?.patient?.familyName}
              </span>
            </span>
          </p>
          <br>
          <p class="sample-tests-list mt-3">
            ${sampleData?.stringTests}
          </p>
          <hr class="dotted">
          <p>${sampleDetails?.label}</p>
        </div>
        <hr>
    `);
    frameDoc.document.write(barcode);
    frameDoc.document.write(`
          <div class="bar-code-texts">
          <p class="sample-info mt-1">
            <span class="text-left">
              ${sampleData?.patient?.givenName}
            ${ sampleData?.patient?.middleName ? sampleData?.patient?.middleName : '' }
            ${ sampleData?.patient?.familyName }
            </span>
            <span class="text-right">
              ${ new Date(sampleData?.dateTimeCreated).toDateString() }
            </span>
          </p>
          <br>
          <p class="sample-info mt-3">
            <span class="text-left">
              ${ sampleDetails?.label }
            </span>
            <span class="text-right">
              <span>
                ${ sampleDetails?.label }
              </span>
              <br>
              <span>
                ${ sampleData?.patient?.givenName }
                ${ sampleData?.patient?.middleName ? sampleData?.patient?.middleName : '' }
                ${ sampleData?.patient?.familyName }
              </span>
            </span>
          </p>
          <br>
          <p class="sample-tests-list mt-3">
            ${ sampleData?.stringTests }
          </p>
          <hr class="dotted">
          <p>${ sampleDetails?.label }</p>
        </div>
        <hr>
    `);
    frameDoc.document.write("</body></html>");
    frameDoc.document.close();
    setTimeout(function () {
      window.frames["frame3"].focus();
      window.frames["frame3"].print();
      document.body.removeChild(frame1);
    }, 500);
  }

  onCancel(e, sampleLabelsUsedDetails?: any, sampleData?: any) {
    e.stopPropagation();
    this.dialogRef.close({sampleLableUsedDetails: sampleLabelsUsedDetails, sampleData: sampleData});
  }
}
