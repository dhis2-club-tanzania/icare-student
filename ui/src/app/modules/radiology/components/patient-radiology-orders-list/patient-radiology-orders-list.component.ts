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
    console.log("formattedOrders...",this.activeVisit);
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
  
    if (!inputElement.files || inputElement.files.length === 0) {
      console.error("No file selected.");
      return;
    }
  
    // Initialize this.file as an array to store selected files
    this.file = Array.from(inputElement.files);
  
    // Iterate through the selected files
    this.file.forEach((file) => {
      console.log("Selected file:", file.name, file.type, file.size);
  
      // Check if the file is a PDF
      if (file.type === "application/pdf") {
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
            // console.log("Base64 PDF Data:", base64PDF);
  
            // You can store base64 data if needed for further processing
            this.base64FileData = base64PDF;
          }
        };
  
        reader.readAsArrayBuffer(file);
  
        // Store the file in the `values` object associated with the order
        this.values[order?.uuid] = file;
      } else {
        console.error(`Selected file "${file.name}" is not a PDF.`);
      }
    });
  }
  
  
  previewUploadPDF(event: Event, data: any, rendererType: string): void {
    event.stopPropagation();
    console.log("data preview ...................",data)
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
    event.stopPropagation();
    this.saving = true;
  
    // Define observation metadata
    const jsonData = {
      concept: order?.concept?.uuid,
      person: this.patientId,
      encounter: order?.encounterUuid,
      obsDatetime: new Date(),
      voided: false,
      status: "PRELIMINARY",
      order: order?.uuid,
      comment: this.values[order?.uuid + "-comment"] || "", 
    };
  
    // Check for existing observation to void
    const existingObs = this.obsKeyedByConcepts[order?.concept?.uuid];
    if (existingObs) {
      this.httpClient
        .post(`../../../openmrs/ws/rest/v1/obs/${existingObs.uuid}`, {
          ...existingObs,
          voided: true,
        })
        .subscribe({
          next: (response) => {
            console.log("Existing observation voided:", response);
            // Proceed to file uploads or new observation creation
            this.uploadFilesOrCreateObservation(order, jsonData);
          },
          error: (error) => {
            console.error("Error voiding existing observation:", error);
            this.saving = false;
          },
        });
    } else {
      // No existing observation, directly proceed to file uploads or observation creation
      this.uploadFilesOrCreateObservation(order, jsonData);
    }
  }
  
  // Helper method for file uploads or observation creation
  private uploadFilesOrCreateObservation(order: any, jsonData: any): void {
    if (this.file && this.file.length > 0) {
      // Process each file individually
      let completedUploads = 0;
      this.file.forEach((file: File) => {
        const data = new FormData();
        data.append("file", file);
        data.append("json", JSON.stringify(jsonData));
  
        this.httpClient.post(`../../../openmrs/ws/rest/v1/obs`, data).subscribe({
          next: (response: any) => {
            console.log("File uploaded successfully:", response);
            // Update observation data with the latest response
            this.obsKeyedByConcepts[order?.concept?.uuid] = response;
          },
          error: (error) => {
            console.error("Error uploading file:", error);
          },
          complete: () => {
            completedUploads++;
            console.log(`Upload complete for file: ${file.name}`);
            // Finalize only when all uploads are processed
            if (completedUploads === this.file.length) {
              this.finalizeSaveOperation();
            }
          },
        });
      });
    } else {
      console.error("No files selected for upload. Proceeding to create observation without files.");
      // Create an observation without files
      // const data = new FormData();
      // data.append("json", JSON.stringify(jsonData));
  
      // this.httpClient.post(`../../../openmrs/ws/rest/v1/obs`, data).subscribe({
      //   next: (response: any) => {
      //     console.log("Observation created successfully without files:", response);
      //     this.obsKeyedByConcepts[order?.concept?.uuid] = response;
      //   },
      //   error: (error) => {
      //     console.error("Error creating observation:", error);
      //   },
      //   complete: () => {
      //     this.finalizeSaveOperation();
      //   },
      // });
    }
  }
  
  // Helper method to finalize the save operation
  private finalizeSaveOperation(): void {
    this.saving = false; 
    console.log("All operations completed successfully.");
  }
  
  
}