import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OpenmrsHttpClientService } from "../../modules/openmrs-http-client/services/openmrs-http-client.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-shared-remote-patient-history-modal",
  templateUrl: "./shared-remote-patient-history-modal.component.html",
  styleUrl: "./shared-remote-patient-history-modal.component.scss",
})
export class SharedRemotePatientHistoryModalComponent implements OnInit {
  remotePatientHistory$: Observable<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpClientService: OpenmrsHttpClientService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.remotePatientHistory$ = this.httpClientService.get(
      `icare/sharedrecords?id=` +
        (this.data?.currentPatient?.patient?.identifiers?.filter(
          (identifier: any) => identifier?.identifierType?.display === "MRN"
        ) || [])[0]?.identifier
    );
  }
}
