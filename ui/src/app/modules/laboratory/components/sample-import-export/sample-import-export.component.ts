import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { MatRadioChange } from "@angular/material/radio";
import { formulateHeadersFromExportTemplateReferences } from "../../resources/helpers/import-export.helper";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { map } from "rxjs/operators";
import * as XLSX from "xlsx";
import { keyBy, flatten } from "lodash";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { LocationService } from "src/app/core/services";
import { PatientService } from "src/app/shared/resources/patient/services/patients.service";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { SamplesService } from "src/app/shared/services/samples.service";
import { LabOrdersService } from "../../resources/services/lab-orders.service";
import { DiagnosisService } from "src/app/shared/resources/diagnosis/services";

@Component({
  selector: "app-sample-import-export",
  templateUrl: "./sample-import-export.component.html",
  styleUrls: ["./sample-import-export.component.scss"],
})
export class SampleImportExportComponent implements OnInit {
  @Input() category: string;
  @Input() labSamplesDepartments: any[];
  @Input() provider: any;
  @Input() currentUser: any;
  @Input() unifiedCodingReferenceConceptSourceUuid: string;
  @Input() relatedMetadataAttributeUuid: string;
  @Input() hfrCodeAttributeUuid: string;
  exceltoJson: any;
  formResource: UntypedFormGroup;
  file: any;
  resourceType: any;
  actionCategory: string = "IMPORT";
  exportTemplateDataReferences$: Observable<any>;

  formulatedHeaders: any = {};
  errors: any[] = [];
  payloadOfSamplesWithIssues: any[] = [];
  onTheProcessErrors: any = {};

  showImportLogs: boolean = false;
  importLogs: any[] = [];
  importStarted: boolean = false;
  constructor(
    private systemSettingsService: SystemSettingsService,
    private conceptService: ConceptsService,
    private locationService: LocationService,
    private patientService: PatientService,
    private visitService: VisitsService,
    private sampleService: SamplesService,
    private labOrdersService: LabOrdersService,
    private diagnosisService: DiagnosisService
  ) {}

  ngOnInit(): void {
    this.exportTemplateDataReferences$ = this.systemSettingsService
      .getSystemSettingsMatchingAKey(`lis.icare.importExport.template.`)
      .pipe(
        map((response: any) => {
          return response
            ? response?.map((globalProperty: any) => {
                return globalProperty?.value?.indexOf("{") > -1 ||
                  globalProperty?.value?.indexOf("[") > -1
                  ? JSON.parse(globalProperty?.value)
                  : globalProperty?.value;
              })
            : [];
        })
      );
  }

  onToggleSystemLogs(event: Event): void {
    event.stopPropagation();
    this.showImportLogs = !this.showImportLogs;
  }

  fileSelection(event: any, exportTemplateDataReferences: any[]): void {
    // const element: HTMLElement = document.getElementById('fileSelector');
    this.file = event.target.files[0];
  }

  get_header_row(sheet) {
    let rowOneHeaders = [];
    let rowTwoHeaders = [];
    var range = XLSX.utils.decode_range(sheet["!ref"]);
    var C,
      count,
      R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell =
        sheet[
          XLSX.utils.encode_cell({ c: C, r: R })
        ]; /* find the cell in the first row */
      // console.log("cell",cell)
      var hdr = "UNKNOWN " + C; // <-- replace with your desired default
      if (cell && cell.t) {
        hdr = XLSX.utils.format_cell(cell);
        rowOneHeaders.push(hdr);
      }
    }
    for (count = 0; count <= range.e.c; ++count) {
      var cellForRowTwo =
        sheet[
          XLSX.utils.encode_cell({ c: count, r: R + 1 })
        ]; /* find the cell in the first row */
      var hdr = "UNKNOWN " + count; // <-- replace with your desired default
      if (cellForRowTwo && cellForRowTwo.t) {
        hdr = XLSX.utils.format_cell(cellForRowTwo);
        rowTwoHeaders.push(hdr);
      }
    }
    return {
      headers: {
        rowOne: rowOneHeaders,
        rowTwo: rowTwoHeaders,
      },
    };
  }

  getSelectionCategory(event: MatRadioChange): void {
    this.actionCategory = null;
    setTimeout(() => {
      this.actionCategory = event.value;
    }, 10);
  }

  onImport(event: Event, exportTemplateDataReferences: any[]): void {
    event.stopPropagation();
    this.formulatedHeaders = formulateHeadersFromExportTemplateReferences(
      exportTemplateDataReferences
    );

    const keyedExportColumnHeaders = keyBy(
      exportTemplateDataReferences,
      "exportKey"
    );
    this.exceltoJson = {};

    this.exceltoJson = {};
    let headerJson = {};
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.file);
    this.exceltoJson["filename"] = this.file.name;
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: "binary" });
      for (var i = 0; i < wb.SheetNames.length; ++i) {
        const wsname: string = wb.SheetNames[i];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, {
          range: 1,
        }); // to get 2d array pass 2nd parameter as object {header: 1}
        this.exceltoJson[`sheet${i + 1}`] = data?.map((dataItem) => {
          let newDataItem = {};
          // Validate the row items here
          Object.keys(dataItem)?.forEach((key) => {
            if (keyedExportColumnHeaders[key]?.systemKey) {
              newDataItem[keyedExportColumnHeaders[key]?.systemKey] =
                dataItem[key];
            }
          });
          return newDataItem;
        });
        const headers = this.get_header_row(ws);
        headerJson[`header${i + 1}`] = headers;
        //  console.log("json",headers)
      }
      this.exceltoJson["headers"] = headerJson;
    };
  }

  onExportDataToImportExportTemplate(
    event: Event,
    id: string,
    name?: string
  ): void {
    this.onDownloadTemplate(event, id);
  }

  onDownloadTemplate(event: Event, id: string, name?: string): void {
    const fileName = `${!name ? "NPHL_export_template_" : name}${
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate() +
      "_" +
      new Date().getDay() +
      ":" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds()
    }.xlsx`;
    if (event) {
      event.stopPropagation();
    }
    const htmlTable = document.getElementById(id).outerHTML;
    if (htmlTable) {
      const uri = "data:application/vnd.ms-excel;base64,",
        template =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:' +
          'office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
          "<x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>" +
          "</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->" +
          '</head><body><table border="1">{table}</table><br /><table border="1">{table}</table></body></html>',
        base64 = (s) => window.btoa(unescape(encodeURIComponent(s))),
        format = (s, c) => s.replace(/{(\w+)}/g, (m, p) => c[p]);

      const ctx = { worksheet: "Data", filename: fileName };
      let str =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office' +
        ':excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
        "<x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>" +
        "</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>";
      ctx["div"] = htmlTable;

      str += "{div}</body></html>";
      const link = document.createElement("a");
      link.download = fileName + ".xls";
      link.href = uri + base64(format(str, ctx));
      link.click();
    }
  }

  async onConfirm(
    event: Event,
    dataRows: any,
    exportTemplateDataReferences: any[]
  ) {
    event.stopPropagation();
    this.importStarted = true;
    this.importLogs = [];
    const keyedExportTemplateDataReferences = keyBy(
      exportTemplateDataReferences,
      "systemKey"
    );

    let payload = [];
    for (let index in dataRows) {
      const data = dataRows[index];
      // console.log(data);
      let patient = {};
      let person = {};
      let personNames = {};
      let attributes = [];
      let address = {};
      let identifiers = [];
      let visitAttributes = [];
      let careSetting = "OUTPATIENT";
      let clinicalInformation = "";
      let clinicalDiagnosis = "";
      let codedDiagnosis = "";
      let certainty = "";
      let sampleLabel = "";
      let testOrder = "";
      let laboratoryCode = "";
      let department = "";
      let specimenSource = "";
      let priority = "";
      let receivedOn = "";
      let broughOn = "";
      let collectedOn = "";
      let condition = "";
      let receivedBy = "";
      let collectedBy = "";
      let deliveredBy = "";
      let transportCondition = "";
      let transportTemperature = "";
      const keys = Object.keys(data);
      for (let keyIndex in keys) {
        const key = keys[keyIndex];
        const reference = keyedExportTemplateDataReferences[key];
        if (
          reference?.category === "patient" &&
          !reference?.attributeTypeUuid
        ) {
          if (reference?.type === "personName") {
            personNames[key] = data[key];
          }
          if (reference?.type === "address") {
            address[key + "1"] = data[key];
            address["cityVillage"] = data[key];
          }

          if (reference?.type === "fileNo") {
            identifiers = [
              {
                identifier: data[key],
                identifierType: reference?.identifierType,
                location: JSON.parse(localStorage.getItem("userLocations"))[0],
                preferred: true,
              },
            ];
          }

          if (!reference?.type) {
            person[key] =
              !reference?.options ||
              (reference?.options && reference?.options?.length === 0)
                ? data[key]
                : (reference?.options?.filter(
                    (option) =>
                      option?.exportValue?.toLowerCase() ===
                      data[key]?.toLowerCase()
                  ) || [])[0]?.code;
          }
        }

        if (reference?.category === "patient" && reference?.attributeTypeUuid) {
          attributes = [
            ...attributes,
            {
              attributeType: reference?.attributeTypeUuid,
              value: data[key],
            },
          ];
        }

        if (reference?.category === "visit" && reference?.attributeTypeUuid) {
          if (reference?.valueAttributeTypeUuid === this.hfrCodeAttributeUuid) {
            if (data[key]) {
              this.importLogs = [
                ...this.importLogs,
                {
                  type: "INFO",
                  message: `Getting system identifier for the Health facility using the ${reference?.exportKey}: ${data[key]}`,
                },
              ];
              await this.locationService
                .getLocationByAttributeTypeAndValue({
                  attributeType: this.hfrCodeAttributeUuid,
                  attributeValue: data[key],
                })
                .toPromise()
                .then((response: any) => {
                  if (response && !response?.error) {
                    this.importLogs = [
                      ...this.importLogs,
                      {
                        type: "SUCCESS",
                        message: `Found  and assign system identifier ${response?.uuid} for the Health facility using the ${reference?.exportKey}: ${data[key]}`,
                      },
                    ];
                    visitAttributes = [
                      ...visitAttributes,
                      {
                        attributeType: reference?.attributeTypeUuid,
                        value: response?.uuid,
                      },
                    ];
                  }
                });
            }
          } else {
            visitAttributes = [
              ...visitAttributes,
              {
                attributeType: reference?.attributeTypeUuid,
                value: data[key],
              },
            ];
          }
        }

        if (
          reference?.category === "visit" &&
          !reference?.attributeTypeUuid &&
          reference?.type == "clinicalHistory"
        ) {
          clinicalInformation = data[key];
        }
        if (
          reference?.category === "visit" &&
          !reference?.attributeTypeUuid &&
          reference?.type == "icdCodedDiagnosis"
        ) {
          codedDiagnosis = data[key];
        }

        if (
          reference?.category === "visit" &&
          !reference?.attributeTypeUuid &&
          reference?.type == "certainty"
        ) {
          certainty = data[key];
        }

        if (
          reference?.category === "sample" &&
          !reference?.attributeTypeUuid &&
          reference?.type == "label"
        ) {
          sampleLabel = data[key];
        }

        if (
          reference?.category === "sample" &&
          !reference?.attributeTypeUuid &&
          reference?.type == "department"
        ) {
          department = data[key];
        }

        if (
          reference?.category === "sample" &&
          !reference?.attributeTypeUuid &&
          reference?.type == "priority"
        ) {
          priority = data[key];
        }

        if (
          reference?.category === "sample" &&
          !reference?.attributeTypeUuid &&
          reference?.type == "specimen"
        ) {
          const referenceTermCode = data[key];
          await this.conceptService
            .searchConcept({
              conceptSource: this.unifiedCodingReferenceConceptSourceUuid,
              referenceTermCode: referenceTermCode,
            })
            .toPromise()
            .then((response: any) => {
              if (response) {
                specimenSource = response?.results[0]?.uuid;
              }
            });
        }

        if (
          reference?.category === "sample" &&
          !reference?.attributeTypeUuid &&
          reference?.type == "testMethod"
        ) {
          const referenceTermCode = data[key];
          await this.conceptService
            .searchConcept({
              conceptSource: this.unifiedCodingReferenceConceptSourceUuid,
              referenceTermCode: referenceTermCode,
            })
            .toPromise()
            .then((response: any) => {
              if (response) {
                this.conceptService
                  .searchConcept({
                    attributeType: this.relatedMetadataAttributeUuid,
                    attributeValue: response[0]?.uuid,
                  })
                  .toPromise()
                  .then((testOrderResponse: any) => {
                    if (testOrderResponse) {
                      testOrder = testOrderResponse?.results[0]?.uuid;
                    }
                  })
                  .then((response) => {});
              }
            });
        }

        if (
          reference?.category === "location" &&
          !reference?.attributeTypeUuid &&
          reference?.type == "laboratoryCode"
        ) {
          laboratoryCode = data[key];
        }
      }
      person["names"] = [personNames];
      person["attributes"] = attributes;
      person["addresses"] = [address];
      patient["person"] = person;
      patient["identifiers"] = identifiers;
      // console.log(patient);
      const visit = {
        patient: "",
        visitType: "54e8ffdc-dea0-4ef0-852f-c23e06d16066",
        indication: "Sample Registration",
        attributes: [
          ...visitAttributes,
          {
            attributeType: "PSCHEME0IIIIIIIIIIIIIIIIIIIIIIIATYPE",
            value: "00000102IIIIIIIIIIIIIIIIIIIIIIIIIIII",
          },
          {
            attributeType: "PTYPE000IIIIIIIIIIIIIIIIIIIIIIIATYPE",
            value: "00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
          },
          {
            attributeType: "SERVICE0IIIIIIIIIIIIIIIIIIIIIIIATYPE",
            value: "30fe16ed-7514-4e93-a021-50024fe82bdd",
          },
          {
            attributeType: "66f3825d-1915-4278-8e5d-b045de8a5db9",
            value: "d1063120-26f0-4fbb-9e7d-f74c429de306",
          },
          {
            attributeType: "6eb602fc-ae4a-473c-9cfb-f11a60eeb9ac",
            value: "b72ed04a-2c4b-4835-9cd2-ed0e841f4b58",
          },
        ],
      };
      const encounter = {
        visit: "",
        patient: "",
        encounterType: "9b46d3fe-1c3e-4836-a760-f38d286b578b",
        orders: [
          {
            concept: testOrder,
            orderType: "52a447d3-a64a-11e3-9aeb-50e549534c5e",
            action: "NEW",
            orderer: this.provider?.uuid,
            careSetting: careSetting,
            urgency: "ROUTINE",
            instructions: "",
            type: "testorder",
          },
        ],
        obs: [
          {
            concept: "3a010ff3-6361-4141-9f4e-dd863016db5a",
            value: clinicalInformation ? clinicalInformation : "None",
          },
        ],
        encounterProviders: [
          {
            provider: this.provider?.uuid,
            encounterRole: { uuid: "240b26f9-dd88-4172-823d-4a8bfeb7841f" },
          },
        ],
      };
      // Get coded diagnosis using code (API for fetching concept using concept source and code, it should include)
      const diagnosis = {
        diagnosis: {
          coded: codedDiagnosis,
          nonCoded: clinicalDiagnosis,
          specificName: null,
        },
        rank: 0,
        condition: null,
        certainty: certainty ? certainty : "PROVISIONAL",
        patient: "",
        encounter: "",
      };
      // Use location API to get the location (lab) using attribute type and code
      // Fetch department using code (Alternatively we can use test order)
      // Fetch specimen source using code
      // TODO: The sample location should be the lab from where the sample come from
      let sample;
      await this.conceptService
        .getConceptSetsByConceptUuids([testOrder])
        .toPromise()
        .then((conceptSets: any[]) => {
          // console.log("concept sets", conceptSets);
          department = (conceptSets?.filter(
            (conceptSet: any) =>
              conceptSet?.systemName?.indexOf("LAB_DEPARTMENT:") > -1
          ) || [])[0]?.uuid;
          sample = {
            visit: { uuid: "" },
            label: sampleLabel,
            concept: { uuid: department }, // Get the department from the test order (test order to department is one to one)
            specimenSource: { uuid: specimenSource },
            location: {
              uuid: JSON.parse(localStorage.getItem("userLocations"))[0],
            },
            orders: [{ uuid: "" }],
          };
        });
      const sampleStatuses = [
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: priority,
          category: "PRIORITY",
          status: priority,
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: receivedOn,
          status: "RECEIVED_ON",
          category: "RECEIVED_ON",
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: broughOn,
          status: "DELIVERED_ON",
          category: "DELIVERED_ON",
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: collectedOn,
          status: "COLLECTED_ON",
          category: "COLLECTED_ON",
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: condition,
          category: "CONDITION",
          status: condition,
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          category: "RECEIVED_BY",
          remarks: "RECEIVED_BY",
          status: receivedBy,
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: collectedBy,
          status: "COLLECTED_BY",
          category: "COLLECTED_BY",
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: deliveredBy,
          status: "DELIVERED_BY",
          category: "DELIVERED_BY",
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: transportCondition,
          category: "TRANSPORT_CONDITION",
          status: "TRANSPORT_CONDITION",
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: transportTemperature,
          category: "TRANSPORT_TEMPERATURE",
          status: "TRANSPORT_TEMPERATURE",
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: "Sample registration form type reference",
          category: "SAMPLE_REGISTRATION_CATEGORY",
          status: "CLINICAL",
        },
        {
          sample: { uuid: "" },
          user: { uuid: this.currentUser?.uuid },
          remarks: "Sample referral", // TODO: You might need to include another important info here for the referral
          category: "SAMPLE_REFERRAL",
          status: "REFERRED SAMPLE",
        },
      ];

      // 1. Create patient
      // 2. Create visit
      // 3. Create encounter
      // 4. Create diagnosis if any
      // 5. Create sample
      // 6. Create sample statuses
      // console.log("sample", sample);
      await this.patientService
        .createPatient(patient)
        .toPromise()
        .then((patientResponse: any) => {
          if (patientResponse && !patientResponse?.error) {
            this.onProceedWithVisit(null, {
              patient,
              visit,
              encounter,
              diagnosis,
              sample,
              sampleStatuses,
            });
          } else {
            // give user message that the client exists so that she can omit or agree
            this.errors = [...this.errors, patientResponse?.error];
            this.payloadOfSamplesWithIssues = [
              ...this.payloadOfSamplesWithIssues,
              {
                data,
                patient,
                visit,
                encounter,
                diagnosis,
                sample,
                sampleStatuses,
                error: { ...patientResponse?.error },
              },
            ];
            this.errors?.forEach((error: any) => {
              if (error?.error?.globalErrors?.length > 0) {
                error?.error?.globalErrors?.forEach((globalError) => {
                  this.importLogs = [
                    ...this.importLogs,
                    {
                      type: "ERROR",
                      message: `${globalError?.message}`,
                    },
                  ];
                });
              }
            });

            // console.log("sas", this.payloadOfSamplesWithIssues);
          }
        });

      payload = [
        ...payload,
        { patient, visit, encounter, diagnosis, sample, sampleStatuses },
      ];
    }
  }

  onDownloadSamplesWithIssues(
    event: Event,
    tableId: string,
    exportTemplateDataReferences: any[],
    name?: string
  ): void {
    // console.log(tableId);
    this.onDownloadTemplate(event, tableId, name);
  }

  async onProceedWithVisit(event: Event, sampleDetails: any) {
    if (event) {
      event.stopPropagation();
    }
    // 1. get patient identifier
    // 2. Check if the sample exists
    // 3 . Create visit
    const sampleLabel = sampleDetails?.sample?.label;
    await this.sampleService
      .getLabSamplesByCollectionDates(
        {},
        null,
        null,
        true,
        null,
        null,
        {
          pageSize: 3,
          page: 1,
        },
        {
          departments: this.labSamplesDepartments,
          specimenSources: [],
          codedRejectionReasons: [],
        },
        null,
        sampleLabel
      )
      .pipe(map((response) => response?.results))
      .toPromise()
      .then((sampleCheckResponse: any) => {
        if (sampleCheckResponse && sampleCheckResponse?.length === 0) {
          this.createVisit(sampleDetails).then((res) => console.log(res));
        } else {
          // TODO: handle errors
          this.onTheProcessErrors[
            sampleDetails?.patient?.identifiers[0]?.identifier
          ] = {
            error: {
              error: `Sample with lab No ${sampleLabel} exists`,
              message: `Sample with lab No ${sampleLabel} exists`,
            },
          };
          console.log("on process errors", this.onTheProcessErrors);
        }
      });
  }

  async createVisit(sampleDetails: any) {
    let visit = sampleDetails?.visit;
    let visitResponse;
    await this.patientService
      .getPatients(sampleDetails?.patient?.identifiers[0]?.identifier)
      .pipe((response: any) => response)
      .toPromise()
      .then((patientResponse: any) => {
        if (patientResponse && patientResponse?.length > 0) {
          visit["patient"] = patientResponse[0]?.patient?.uuid;
          // console.log(visit);
          return this.visitService
            .createVisit(visit)
            .subscribe((visitResponse: any) => {
              if (visitResponse && !visitResponse?.error) {
                // console.log(visitResponse);
                // console.log(sampleDetails);
                this.createEncountersAndOrders(sampleDetails, visitResponse);
              } else {
                // TODO: handle errors
              }
            });
        } else {
          // TODO: handle errors
        }
      });
  }

  async createEncountersAndOrders(sampleDetails: any, visitResponse: any) {
    let encounterObject = sampleDetails?.encounter;
    encounterObject["visit"] = visitResponse?.uuid;
    encounterObject["patient"] = visitResponse?.patient?.uuid;
    let orders = encounterObject?.orders;
    orders = orders?.map((order: any) => {
      return {
        ...order,
        patient: visitResponse?.patient?.uuid,
      };
    });
    encounterObject["orders"] = orders;
    return this.labOrdersService
      .createLabOrdersViaEncounter(encounterObject)
      .toPromise()
      .then((encounterResponse: any) => {
        if (encounterResponse) {
          // console.log("encounterResponse", encounterResponse);
          const diagnosisCode = sampleDetails?.diagnosis?.diagnosis?.coded;
          if (diagnosisCode) {
            this.createDiagnosis(
              sampleDetails,
              visitResponse,
              encounterResponse
            );
          }

          this.getVisitDetails(sampleDetails, visitResponse);
        }
      });
  }

  async createDiagnosis(sampleDetails, visitResponse, encounterResponse) {
    let diagnosis = sampleDetails?.diagnosis;
    await this.diagnosisService
      .addDiagnosis(diagnosis)
      .toPromise()
      .then((diagnosisResponse) => {
        if (diagnosisResponse) {
          // console.log("diagnosisResponse", diagnosisResponse);
        }
      });
  }

  async getVisitDetails(sampleDetails, visitResponse) {
    await this.visitService
      .getVisitDetailsByVisitUuid(visitResponse?.uuid, {
        v: "custom:(uuid,display,startDatetime,encounters:(uuid,orders))",
      })
      .toPromise()
      .then((visitData: any) => {
        if (visitData) {
          this.createSample(sampleDetails, visitData);
        }
      });
  }

  async createSample(sampleDetails, visitResponse) {
    let sample = sampleDetails?.sample;
    sample["visit"]["uuid"] = visitResponse?.uuid;
    sample["orders"] = flatten(
      visitResponse?.encounters?.map((encounter: any) => {
        return encounter?.orders?.map((order: any) => {
          return {
            uuid: order?.uuid,
          };
        });
      })
    );
    await this.sampleService
      .createLabSample(sample)
      .toPromise()
      .then((sampleResponse: any) => {
        if (sampleResponse) {
          // console.log(sampleResponse);
          this.createSampleStatuses(sampleDetails, sampleResponse);
        }
      });
  }

  async createSampleStatuses(sampleDetails, sampleResponse) {
    let sampleStatuses =
      sampleDetails?.sampleStatuses
        ?.map((status) => {
          return status?.remarks && status?.status
            ? {
                ...status,
                sample: {
                  uuid: sampleResponse?.uuid,
                },
              }
            : null;
        })
        ?.filter((sampleStatus) => sampleStatus) || [];
    await this.sampleService
      .setMultipleSampleStatuses(sampleStatuses)
      .toPromise()
      .then((response) => {
        console.log(response);
      });
  }
}
