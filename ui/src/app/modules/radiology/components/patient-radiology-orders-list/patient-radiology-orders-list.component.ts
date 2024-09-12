import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import jsPDF from "jspdf";
import { SharedPdfPreviewComponent } from "src/app/shared/dialogs/shared-pdf-preview/shared-pdf-preview.component";
import { addBillStatusToOrders } from "src/app/shared/helpers/add-bill-status-to-ordered-items.helper";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { VisitsService } from "src/app/shared/resources/visits/services";

@Component({
  selector: "app-patient-radiology-orders-list",
  templateUrl: "./patient-radiology-orders-list.component.html",
  styleUrls: ["./patient-radiology-orders-list.component.scss"],
})
export class PatientRadiologyOrdersListComponent implements OnInit {
  @Input() currentUser: any;
  @Input() allUserRoles: any;
  @Input() userPrivileges: any;
  @Input() orders: any[];
  @Input() currentBills: any[];
  @Input() patientId: string;
  @Input() activeVisitUuid: string;
  @Input() activeVisit: any;

  file: any;
  values: any = {};
  obsKeyedByConcepts: any = {};

  saving: boolean = false;
  base64FileData: any;
  formattedOrders: any[];
  constructor(
    private httpClient: HttpClient,
    private visitService: VisitsService,
    private ordersService: OrdersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.visitService
      .getVisitDetailsByVisitUuid(this.activeVisitUuid, {
        v: "custom:(encounters:(uuid,display,obs,orders,encounterDatetime,encounterType,location))",
      })
      .subscribe((response) => {
        if (response && response?.encounters?.length > 0) {
          response?.encounters?.forEach((encounter, index) => {
            encounter?.obs?.forEach((obs) => {
              this.obsKeyedByConcepts[obs?.concept?.uuid] = {
                ...obs,
                uri:
                  obs?.value?.links && obs?.value?.links?.uri
                    ? obs?.value?.links?.uri?.replace("http", "https")
                    : null,
              };
            });

            // encounter?.orders?.forEach((order) => {
            //   this.obsKeyedByConcepts[order?.concept?.uuid] = order;
            // });
          });
        }
      });

    this.formattedOrders = addBillStatusToOrders(
      this.orders,
      this.currentBills,
      this.activeVisit
    );
  }

  previewPDFData(pdfData) {
    const doc = new jsPDF();

    // doc.loadDocument(pdfData);
    doc.save("preview.pdf");
  }

  fileSelection(event: Event, order: any): void {
    console.log("Event triggered");
    console.log("Order:", order);
    event.stopPropagation();
  
    const inputElement = event.target as HTMLInputElement;
    console.log("Input Element:", inputElement);
  
    if (!inputElement.files || inputElement.files.length === 0) {
      console.error("No file selected.");
      return;
    }
  
    console.log("File selected:", inputElement.files[0]);
  
    this.file = inputElement.files[0];
    if (this.file && this.file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          const pdfData = new Uint8Array(e.target.result as ArrayBuffer);
  
          let binary = "";
          const bytes = new Uint8Array(pdfData);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64PDF = btoa(binary);
          const doc = new jsPDF();
          doc.addPage();
          this.base64FileData = base64PDF;
        }
      };
  
      reader.readAsArrayBuffer(this.file);
      this.values[order?.uuid] = this.file;
    } else {
      console.error("Selected file is not a PDF.");
    }
  }
  
  previewUploadPDF(event: Event, data: any, rendererType: string): void {
    event.stopPropagation();
    console.log("data preview ....................",data)
    this.dialog.open(SharedPdfPreviewComponent, {
      minWidth: '60%',
      maxHeight: '700px',
      data: { data, rendererType },
    });
  }

  getRemarks(event: Event, order: any): void {
    this.values[order.uuid + '-comment'] = (event.target as HTMLTextAreaElement).value;
  }

  onSave(event: Event, order: any): void {
    console.log('Save triggered');
    event.stopPropagation();
    this.saving = true;
    let data = new FormData();
    const jsonData = {
      concept: order?.concept?.uuid,
      person: this.patientId,
      encounter: order?.encounterUuid,
      obsDatetime: new Date(),
      voided: false,
      status: "PRELIMINARY",
      order: order?.uuid,
      comment: this.values[order?.uuid + "-comment"],
    };
    data.append("file", this.file);
    data.append("json", JSON.stringify(jsonData));

    // void first the existing observation
    if (
      this.obsKeyedByConcepts[order?.concept?.uuid] &&
      this.obsKeyedByConcepts[order?.concept?.uuid]?.value
    ) {
      const existingObs = {
        concept: order?.concept?.uuid,
        person: this.patientId,
        obsDatetime:
          this.obsKeyedByConcepts[order?.concept?.uuid]?.encounter?.obsDatetime,
        encounter:
          this.obsKeyedByConcepts[order?.concept?.uuid]?.encounter?.uuid,
        status: "PRELIMINARY",
        comment:
          this.obsKeyedByConcepts[order?.concept?.uuid]?.encounter?.comment,
      };
      this.httpClient
        .post(
          `../../../openmrs/ws/rest/v1/obs/${
            this.obsKeyedByConcepts[order?.concept?.uuid]?.uuid
          }`,
          {
            ...existingObs,
            voided: true,
          }
        )
        .subscribe((response) => {
          if (response) {
            this.saving = false;
          }
        });
    }

    const orders = [
      {
        uuid: order?.uuid,
        fulfillerStatus: "RECEIVED",
        encounter: order?.encounterUuid,
      },
    ];

    this.ordersService
      .updateOrdersViaEncounter(orders)
      .subscribe((response) => {
        this.saving = false;
      });

    this.httpClient
      .post(`../../../openmrs/ws/rest/v1/obs`, data)
      .subscribe((response: any) => {
        if (response) {
          this.obsKeyedByConcepts[order?.concept?.uuid] = {
            ...response,
            uri: response?.value?.links
              ? response?.value?.links?.uri?.replace("http", "https")
              : null,
          };
        }
      });
      setTimeout(() => {
        this.saving = false;
        console.log('Save complete');
      }, 2000);
  }
}
