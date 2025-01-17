import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { identifyIfPatientHasPhoneAttribute } from "src/app/core/helpers/patient-attributes.helper";
import { SmsService } from "src/app/core/services/sms.service";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-short-message-construction",
  templateUrl: "./short-message-construction.component.html",
  styleUrls: ["./short-message-construction.component.scss"],
})
export class ShortMessageConstructionComponent implements OnInit {
  durationUnitsConceptUuid$: Observable<any>;
  messages: any;
  uploadMessagesResponse$: Observable<any>;
  patientPhoneAttribute: string;
  constructor(
    private dialogRef: MatDialogRef<ShortMessageConstructionComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private systemSettingsService: SystemSettingsService,
    private smsService: SmsService
  ) {}

  ngOnInit(): void {
    this.patientPhoneAttribute = identifyIfPatientHasPhoneAttribute(
      this.data?.data?.patient?.patient,
      this.data?.data?.generalMetadataConfigurations
    );
    this.durationUnitsConceptUuid$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "order.durationUnitsConceptUuid"
      );
  }

  onGetConstructedMessages(messages: any): void {
    this.messages = messages;
  }

  onSaveMessages(event: Event, messages: any): void {
    event.stopPropagation();
    this.uploadMessagesResponse$ = this.smsService.uploadMessages(messages);
  }
}
