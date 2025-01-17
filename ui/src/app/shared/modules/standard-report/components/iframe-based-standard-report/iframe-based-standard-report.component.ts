import { AfterViewInit, Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-iframe-based-standard-report",
  templateUrl: "./iframe-based-standard-report.component.html",
  styleUrls: ["./iframe-based-standard-report.component.scss"],
})
export class IframeBasedStandardReportComponent
  implements OnInit, AfterViewInit
{
  @Input() reportHtml: any;
  @Input() parameters: any;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const iframe = document.createElement("iframe");
    iframe.style.border = "none";
    iframe.style.width = "100%";
    iframe.style.maxHeight = "90vh";
    iframe.height = "800";
    iframe.setAttribute("id", "iframe_id");
    iframe.setAttribute("onload", "resizeIframe(this)");
    setTimeout(() => {
      const where = document.getElementById("html_id");
      if (where) {
        where.appendChild(iframe);
        iframe.contentWindow.document.open("text/htmlreplace");
        iframe.contentWindow.document.write(this.reportHtml);
        iframe.contentWindow["iReportsDimensions"] = this.parameters;
        iframe.contentWindow.document.close();
      }
    }, 50);
  }
}
