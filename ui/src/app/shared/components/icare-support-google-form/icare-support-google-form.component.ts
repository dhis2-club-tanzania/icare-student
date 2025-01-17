import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-icare-support-google-form",
  templateUrl: "./icare-support-google-form.component.html",
  styleUrls: ["./icare-support-google-form.component.scss"],
})
export class IcareSupportGoogleFormComponent implements OnInit {
  googleFormLink$: Observable<any>;
  @Input() isSupportOpened: boolean;
  @Output() cancel = new EventEmitter<boolean>();
  isInvalid: boolean = false;
  constructor(
    private systemSettingsService: SystemSettingsService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.googleFormLink$ = this.systemSettingsService
      .getSystemSettingsByKey(
        "iCare.general.systemSettings.support.googleFormLink"
      )
      .pipe(
        map((response) => {
          if (response && response?.indexOf(`http`) !== -1) {
            this.isInvalid = false;
            const iframe = document.createElement("iframe");
            iframe.style.border = "none";
            iframe.style.width = "100%";
            iframe.style.minHeight = "100vh";
            iframe.setAttribute("id", "iframe_id");
            iframe.setAttribute("src", response);
            setTimeout(() => {
              const ctnr = document.getElementById("ifram_id");
              if (ctnr) {
                ctnr.appendChild(iframe);
              }
            }, 50);
            return response;
          } else if (response) {
            this.isInvalid = true;
            return response;
          }

          // return response?.indexOf(`http`) !== -1
          //   ? this.domSanitizer.bypassSecurityTrustUrl(response)
          //   : "invalid";
        })
      );
  }

  onClose() {
    this.cancel.emit(false);
  }
}
