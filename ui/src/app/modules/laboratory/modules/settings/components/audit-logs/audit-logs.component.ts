import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Component({
  selector: "app-audit-logs",
  templateUrl: "./audit-logs.component.html",
  styleUrls: ["./audit-logs.component.scss"],
})
export class AuditLogsComponent implements OnInit {
  auditLogs$: Observable<any[]>;
  constructor(private httpClientService: OpenmrsHttpClientService) {}

  ngOnInit(): void {
    this.auditLogs$ = this.httpClientService.get("icare/auditlogs?length=50");
  }
}
