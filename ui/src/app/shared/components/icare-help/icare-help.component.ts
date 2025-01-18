import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "icare-help",
  templateUrl: "./icare-help.component.html",
  styleUrls: ["./icare-help.component.scss"],
})
export class IcareHelpComponent implements OnInit {
  @Input() appName: string;
  @Input() documentURL: string;
  @Input() isInfoOpen: boolean;
  @Output() cancel = new EventEmitter<boolean>();

  docURL: SafeUrl;
  defaultDocumentURL = `https://udsm-dhis2-project.github.io/hris-api-docs`;

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.docURL = this.documentURL
      ? this.domSanitizer.bypassSecurityTrustResourceUrl(this.documentURL)
      : this.domSanitizer.bypassSecurityTrustResourceUrl(
          this.defaultDocumentURL
        );
  }

  onClose() {
    this.cancel.emit(false);
  }
}
