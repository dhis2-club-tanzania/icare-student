import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

@Component({
  selector: "app-shared-pdf-preview",
  templateUrl: "./shared-pdf-preview.component.html",
  styleUrls: ["./shared-pdf-preview.component.scss"],
})
export class SharedPdfPreviewComponent implements OnInit, AfterViewInit {
  pdfUrl: string = '';
  pageNumber: number = 1;
  totalPages: number = 0;
  baseUrl: string = '';

  constructor(
    private dialogRef: MatDialogRef<SharedPdfPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Capture the root URL dynamically
    this.baseUrl = `${window.location.protocol}//${window.location.host}/`;
    // console.log("Base URL captured:", this.baseUrl);
  }

  ngAfterViewInit(): void {
    const pdfjsLib = (window as any).pdfjsLib;

    // Log the initial data
    console.log("Data received:", this.data);

    if (this.data?.rendererType === "embed") {
      const base64data = this.data?.data;
      if (base64data) {
        this.pdfUrl = `data:application/pdf;base64,${base64data}`;
        // console.log("Base64 PDF URL:", this.pdfUrl);
      } else {
        console.error("Base64 data is empty or undefined.");
      }
    } else {
      const originalUrl = this.data?.data;
      // console.log("Original URL:", originalUrl);

      if (originalUrl.startsWith('http://localhost/')) {
        this.pdfUrl = originalUrl.replace('http://localhost/', this.baseUrl);
      } else {
        this.pdfUrl = originalUrl;
      }

      // console.log("Constructed PDF URL:", this.pdfUrl);
    }

    console.log("Loading PDF from URL...");
    this.loadPdf(pdfjsLib);
  }

  loadPdf(pdfjsLib: any) {
    pdfjsLib.getDocument(this.pdfUrl).promise.then(
      (pdf: PDFDocumentProxy) => {
        console.log("PDF loaded successfully.");
        this.totalPages = pdf.numPages;
        console.log("Total pages:", this.totalPages);
        this.renderPage(this.pageNumber, pdf);
      },
      (error: any) => {
        console.error("Error loading PDF:", error);
      }
    );
  }

  renderPage(pageNumber: number, pdf: PDFDocumentProxy) {
    pdf.getPage(pageNumber).then(
      (page: PDFPageProxy) => {
        // console.log("Rendering page:", pageNumber);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            page.render(renderContext).promise.then(
              () => console.log("Page rendered successfully"),
              (error: any) => console.error("Error rendering page:", error)
            );
          } else {
            // console.error("Canvas context not available.");
          }
        } else {
          console.error("Canvas element not found.");
        }
      },
      (error: any) => console.error("Error getting page:", error)
    );
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
