import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Observable, of } from "rxjs";
import { WorkSheetsService } from "src/app/modules/laboratory/resources/services/worksheets.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { omit, keyBy } from "lodash";
import { DatasetDataService } from "src/app/core/services/dataset-data.service";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { DateField } from "src/app/shared/modules/form/models/date-field.model";
import { GenerateMetadataLabelsService } from "src/app/core/services";
import { MatCheckboxChange } from "@angular/material/checkbox";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from "html-to-pdfmake";
import { AdditionalFieldsModalComponent } from "src/app/modules/laboratory/modals/additional-fields-modal/additional-fields-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { ExportDataService } from "src/app/core/services/export-data.service";

@Component({
  selector: "app-worksheet-definition",
  templateUrl: "./worksheet-definition.component.html",
  styleUrls: ["./worksheet-definition.component.scss"],
})
export class WorksheetDefinitionComponent implements OnInit {
  @Input() worksheets: any[];
  @Input() dataSetReportUuidForAcceptedSamplesWithNoResults: string;
  @Input() datesParameters: any;
  @Input() worksheetDefinitionLabelFormatReferenceUuid: string;
  worksheetFormField: any;
  worksheetDefinitionFields: any[];
  selectedWorkSheetConfiguration: any;
  worksheetDefinitions$: Observable<any[]>;
  testControls$: Observable<any[]>;
  worksheetDefnPayload: any;
  saving: boolean = false;
  isWorksheetDefnValid: boolean = false;
  currentWorksheetDefinition: any;
  selectedRowsColumns: any = {};
  definedControls: any = {};
  isWorksheetRenderingReady: boolean = false;
  isComplete: boolean = false;
  maxLabelCharCount: number = 7;
  currentLabelCharCount: number = 15;
  minLabelCharCount: number = 3;

  message: string;
  worksheetSelectionField: any;
  currentWorksheet: any;
  isFormValid: boolean = false;
  expirationDateChecked: boolean = true;
  searchingText: string;

  @ViewChild("wsdefntable") pdfTable: ElementRef;
  constructor(
    private worksheetsService: WorkSheetsService,
    private datasetDataService: DatasetDataService,
    private generateMetadataLabelsService: GenerateMetadataLabelsService,
    private dialog: MatDialog,
    private exportService: ExportDataService
  ) {}

  ngOnInit(): void {
    this.getWorksheetDefinitions(this.datesParameters);
    this.createWorksheetDefinitionFields();
    this.getTestControls();
    this.createWorksheetSelectionField();
  }

  createWorksheetSelectionField(worksheet?: any): void {
    this.worksheetSelectionField = new Dropdown({
      id: "worksheet",
      key: "worksheet",
      label: "Worksheet",
      required: true,
      value: worksheet?.uuid,
      options: this.worksheets?.map((worksheet) => {
        return {
          key: worksheet?.uuid,
          label: worksheet?.name,
          name: worksheet?.name,
          value: worksheet?.uuid,
        };
      }),
    });
  }

  createWorksheetDefinitionFields(data?: any): void {
    // console.log(data);
    this.worksheetDefinitionFields = [
      new Textbox({
        id: "code",
        key: "code",
        label: "Reference code (system generated)",
        disabled: true,
        value: data?.code?.value,
      }),
      new Textbox({
        id: "abbreviation",
        key: "abbreviation",
        label: "Abbreviation",
        value: data?.abbreviation?.value,
        required: false,
      }),
      new DateField({
        id: "expirationDateTime",
        key: "expirationDateTime",
        label: "Expiration Date",
        value: data?.expirationDateTime?.value,
        required: true,
      }),
      new Textbox({
        id: "assayName",
        key: "assayName",
        label: "Assay Name",
        value: data?.assayName?.value,
        required: false,
      }),
      new Textbox({
        id: "lotNumber",
        key: "lotNumber",
        label: "LOT Number",
        value: data?.lotNumber?.value,
        required: false,
      }),
      new TextArea({
        id: "description",
        key: "description",
        label: "Description",
        value: data?.description?.value,
        required: false,
      }),
    ];
  }

  getWSDefns(event: any): void {
    const searchingText = event ? event?.target?.value : "";
    this.getWorksheetDefinitions(
      this.expirationDateChecked
        ? { ...this.datesParameters, q: searchingText }
        : { q: searchingText }
    );
  }

  setExpirationDate(event: MatCheckboxChange): void {
    this.expirationDateChecked = event?.checked;
    this.getWorksheetDefinitions(
      this.expirationDateChecked
        ? { ...this.datesParameters, q: this.searchingText }
        : { q: this.searchingText }
    );
  }

  onGetSelectedWorksheet(formValue: FormValue): void {
    const worksheetUuid = formValue.getValues()?.worksheet?.value;
    this.currentWorksheet = (this.worksheets?.filter(
      (worksheet) => worksheet?.uuid === worksheetUuid
    ) || [])[0];

    if (this.currentWorksheet) {
      this.currentWorksheetDefinition = {
        worksheet: {
          ...this.currentWorksheet,
          columns: this.generateArrayOfItemsFromCount(
            this.currentWorksheet?.columns
          ),
          rows: this.generateArrayOfItemsFromCount(this.currentWorksheet?.rows),
        },
      };

      this.isWorksheetRenderingReady = true;

      this.generateDefaultWorksheetRowsColumns();
    }
  }

  onSave(event: Event): void {
    event.stopPropagation();

    // Create worksheetdefn and worksheet sample
    // console.log("selectedRowsColumns", this.selectedRowsColumns);
    this.saving = true;
    (!this.currentWorksheetDefinition ||
    (this.currentWorksheetDefinition && !this.currentWorksheetDefinition?.code)
      ? this.generateMetadataLabelsService.getLabMetadatalabels({
          globalProperty: this.worksheetDefinitionLabelFormatReferenceUuid,
          metadataType: "worksheetdefinition",
        })
      : of([this.currentWorksheetDefinition?.code])
    ).subscribe((response) => {
      if (response) {
        this.worksheetDefnPayload = {
          ...this.worksheetDefnPayload,
          code: response[0],
        };

        this.worksheetsService
          .createWorksheetDefinitions([this.worksheetDefnPayload])
          .subscribe((responseWorkSheetDefn: any) => {
            if (responseWorkSheetDefn && !responseWorkSheetDefn?.error) {
              const worksheetSamples = Object.keys(this.selectedRowsColumns)
                ?.map((key) => {
                  if (this.selectedRowsColumns[key]?.set) {
                    const type =
                      key?.indexOf("control") === -1 ? "SAMPLE" : "CONTROL";
                    let returnObj = {
                      row: Number(key?.split("-")[0]),
                      column: Number(key?.split("-")[1]),
                      worksheetDefinition: {
                        uuid: responseWorkSheetDefn[0]?.uuid,
                      },
                      type: type,
                    };
                    returnObj[
                      type === "SAMPLE" ? "sample" : "worksheetControl"
                    ] = {
                      uuid: this.selectedRowsColumns[key]?.value?.uuid,
                    };
                    return returnObj;
                  }
                })
                ?.filter((worksheetSample) => worksheetSample);
              // console.log(JSON.stringify(worksheetSamples));
              this.worksheetsService
                .createWorksheetSamples(worksheetSamples)
                .subscribe((response) => {
                  if (response && !response?.error) {
                    this.saving = false;
                    this.currentWorksheetDefinition = null;
                    this.getWorksheetDefinitions(this.datesParameters);
                    this.createWorksheetSelectionField();
                  } else {
                    this.saving = false;
                    this.getWorksheetDefinitions(this.datesParameters);
                    this.createWorksheetSelectionField();
                  }
                });
            }
          });
      }
    });
  }

  getWorksheetDefinitions(parameters?: any): void {
    this.worksheetDefinitions$ =
      this.worksheetsService.getWorksheetDefinitions(parameters);
  }

  getTestControls(): void {
    this.testControls$ = this.worksheetsService.getWorksheetControls();
  }

  onGetFormData(formValue: FormValue): void {
    let values = formValue.getValues();
    values["currentLabelCharCount"] = {
      id: "currentLabelCharCount",
      value: this.currentLabelCharCount.toString(),
      options: null,
    };
    this.isFormValid = formValue.isValid;
    this.isWorksheetDefnValid = formValue.isValid;
    this.selectedWorkSheetConfiguration = values?.worksheet?.value;
    this.worksheetDefnPayload = {
      code: null,
      expirationDateTime: values?.expirationDateTime?.value
        ? new Date(values?.expirationDateTime?.value)
            ?.toISOString()
            ?.replace("T", " ")
            .replace(".000Z", "")
        : null,
      additionalFields: JSON.stringify(
        Object.keys(values).map((key) => {
          return values[key];
        })
      ),
      worksheet: {
        uuid: this.currentWorksheet?.uuid,
      },
    };
  }

  setCurrentWorksheetDefn(event: Event, worksheetDefn: any): void {
    // event.stopPropagation();
    this.currentWorksheetDefinition = null;
    this.message = null;
    this.isWorksheetRenderingReady = false;
    this.createWorksheetSelectionField(worksheetDefn?.worksheet);
    const wsDefnFields = worksheetDefn?.additionalFields
      ? JSON.parse(worksheetDefn?.additionalFields)
      : null;
    this.createWorksheetDefinitionFields(
      wsDefnFields
        ? keyBy(
            [
              ...wsDefnFields,
              { id: "code", key: "code", value: worksheetDefn?.code },
            ],
            "id"
          )
        : null
    );
    const matchedWorksheet = (this.worksheets?.filter(
      (worksheet) => worksheet?.uuid === worksheetDefn?.worksheet?.uuid
    ) || [])[0];
    this.worksheetsService
      .getWorksheetDefinitionsByUuid(worksheetDefn?.uuid)
      .subscribe((response) => {
        if (response && !response?.error) {
          const worksheetDefnItems = {};
          response?.worksheetSamples?.forEach((ws) => {
            worksheetDefnItems[
              ws?.row +
                "-" +
                ws?.column +
                "-" +
                (ws?.type === "SAMPLE" ? "sample" : "control")
            ] = {
              set: true,
              value:
                ws?.type === "SAMPLE"
                  ? { ...ws?.sample, label: ws?.sample?.display }
                  : {
                      ...ws.worksheetControl,
                      label: ws?.worksheetControl?.display,
                    },
            };
          });
          const additionalFields = JSON.parse(response?.additionFields);
          const currentLabelCharCountField = (additionalFields?.filter(
            (field) => field?.id === "currentLabelCharCount"
          ) || [])[0];
          this.currentLabelCharCount = currentLabelCharCountField
            ? currentLabelCharCountField?.value
            : this.currentLabelCharCount;
          // console.log("worksheetDefnItems", worksheetDefnItems);
          this.selectedRowsColumns = worksheetDefnItems;
          this.isComplete = true;
          this.currentWorksheetDefinition = {
            ...worksheetDefn,
            ...response,
            worksheet: {
              ...worksheetDefn?.worksheet,
              ...{
                ...matchedWorksheet,
                columns: this.generateArrayOfItemsFromCount(
                  matchedWorksheet?.columns
                ),
                rows: this.generateArrayOfItemsFromCount(
                  matchedWorksheet?.rows
                ),
              },
            },
          };
          this.isWorksheetRenderingReady = true;
          // console.log(
          //   "currentWorksheetDefinition",
          //   this.currentWorksheetDefinition
          // );
          // this.generateDefaultWorksheetRowsColumns();
        }
      });
  }

  generateDefaultWorksheetRowsColumns(): void {
    this.currentWorksheetDefinition?.worksheet?.columns?.forEach((column) => {
      this.currentWorksheetDefinition?.worksheet?.rows?.forEach((row) => {
        this.selectedRowsColumns[row + "-" + column + "-sample"] =
          row + "-" + column + "-sample";
      });
    });
  }

  generateArrayOfItemsFromCount(count: number): any[] {
    let items = [];
    for (let cnt = 1; cnt <= count; cnt++) {
      items.push(cnt);
    }
    return items;
  }

  toggleControl(event, rowColumn: string): void {
    this.selectedRowsColumns[rowColumn] = rowColumn;
    if (
      rowColumn?.indexOf("sample") > -1 &&
      this.selectedRowsColumns[rowColumn?.split("-sample")[0] + "-control"]
    ) {
      this.selectedRowsColumns = omit(
        this.selectedRowsColumns,
        rowColumn?.split("-sample")[0] + "-control"
      );
    } else if (
      rowColumn?.indexOf("control") > -1 &&
      this.selectedRowsColumns[rowColumn?.split("-control")[0] + "-sample"]
    ) {
      this.selectedRowsColumns = omit(
        this.selectedRowsColumns,
        rowColumn?.split("-control")[0] + "-sample"
      );
    }
  }

  onUnPopulateSamples(event: Event): void {
    event.stopPropagation();
    this.isComplete = false;
    this.selectedRowsColumns = {};
    this.isWorksheetRenderingReady = false;
    this.generateDefaultWorksheetRowsColumns();
    this.definedControls = {};
    setTimeout(() => {
      this.isWorksheetRenderingReady = true;
    }, 100);
  }

  getSelectedTestControl(selectedControlUuid: string, id: string): void {
    this.definedControls[id] = selectedControlUuid;
  }

  changeLabelCount(event: Event, type: string): void {
    event.stopPropagation();
    this.currentLabelCharCount =
      type === "next"
        ? this.currentLabelCharCount + 1
        : this.currentLabelCharCount - 1;
  }

  onPopulateSamples(event: Event, selectedRowsColumns: any): void {
    event.stopPropagation();
    this.isWorksheetRenderingReady = false;
    this.datasetDataService
      .getDatasetData(
        this.dataSetReportUuidForAcceptedSamplesWithNoResults,
        this.datesParameters,
        [
          {
            key: "uuid",
            value: this.currentWorksheetDefinition?.worksheet?.testOrder?.uuid,
          },
        ]
      )
      .subscribe((response) => {
        const samples = response?.rows;
        if (samples?.length > 0) {
          this.currentLabelCharCount = samples[0]?.label?.length;
          let sampleAreas = [];
          let controlAreas = [];
          Object.keys(selectedRowsColumns).map((key, index) => {
            if (key?.indexOf("sample") > -1) {
              sampleAreas = [...sampleAreas, key];
            } else {
              controlAreas = [...controlAreas, key];
            }
          });
          sampleAreas?.forEach((sampleRef, index) => {
            if (index < samples?.length) {
              this.selectedRowsColumns[sampleRef] = {
                set: true,
                value: samples[index],
              };
            }
          });

          controlAreas?.forEach((controlRef, index) => {
            this.selectedRowsColumns[controlRef] = {
              set: true,
              value: this.definedControls[controlRef],
            };
          });

          this.isWorksheetRenderingReady = true;
          this.isComplete = true;
        } else {
          this.isWorksheetRenderingReady = true;
          this.message = `NO samples for the test order ${this.currentWorksheetDefinition?.worksheet?.testOrder?.display} from ${this.datesParameters?.startDate} to ${this.datesParameters?.endDate}`;
        }
      });
  }

  onCloseMessage(event: Event): void {
    event.stopPropagation();
    this.message = null;
  }

  onAddNewFields(event: Event, currentWorksheetDefinition: any): void {
    event.stopPropagation();
    this.dialog.open(AdditionalFieldsModalComponent, {
      width: "50%",
      data: currentWorksheetDefinition,
    });
  }

  printPDF(event: Event) {
    event.stopPropagation();

    const pdfTable = this.pdfTable.nativeElement;

    const html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = {
      pageMargins: [30, 60, 30, 80],
      header: "WORKSHEET: " + this.currentWorksheetDefinition?.code,
      footer: (currentPage, pageCount) => {
        return {
          table: {
            body: [
              [
                {
                  text: "Page " + currentPage + " of " + pageCount,
                  alignment: "right",
                  style: "normalText",
                  margin: [0, 20, 50, 0],
                },
              ],
            ],
          },
          layout: "noBorders",
        };
      },
      content: html,
      defaultStyle: {
        fontSize: 12,
      },
      pageSize: "A4",
      styles: {
        header: {
          fontSize: 6,
          margin: [15, 20, 15, 10],
        },
      },
    };
    const fonts = null;
    const vfs = null;
    const tableLayouts = { layout: "fixed" };
    pdfMake.fonts = fonts;

    pdfMake.createPdf(documentDefinition, tableLayouts, fonts, vfs).print();
    // pdfMake.createPdf(documentDefinition).download("filename.pdf");
    // setTimeout(function () {
    //   window.print();
    // }, 500);

    // var file = new Blob([data], { type: 'application/pdf' });
    // var fileURL = URL.createObjectURL(file);

    // // if you want to open PDF in new tab
    // window.open(fileURL);
    // var a = document.createElement('a');
    // a.href = fileURL;
    // a.target = '_blank';
    // a.download = 'bill.pdf';
    // document.body.appendChild(a);
    // a.click();
  }

  downloadToExcel(event: Event, id: string, name: string): void {
    event.stopPropagation();
    this.exportService.downloadTableToExcel(
      id,
      name +
        new Date().getFullYear() +
        "_" +
        (new Date().getMonth() + 1) +
        "_" +
        new Date().getDate()
    );
  }

  public download(event: Event, id, filename): void {
    event.stopPropagation();
    var preHtml =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    var postHtml = "</body></html>";
    var html = preHtml + document.getElementById(id).innerHTML + postHtml;

    var blob = new Blob(["\ufeff", html], {
      type: "application/msword",
    });

    // Specify link url
    var url =
      "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);

    // Specify file name
    filename = filename ? filename + ".doc" : "document.doc";

    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    // Create a link to the file
    downloadLink.href = url;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();

    document.body.removeChild(downloadLink);
  }
}
