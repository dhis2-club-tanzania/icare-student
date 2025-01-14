import { Component, OnInit } from "@angular/core";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { Api, ServerlogGetFull } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-server-logs",
  templateUrl: "./server-logs.component.html",
  styleUrls: ["./server-logs.component.scss"],
})
export class ServerLogsComponent implements OnInit {
  serverLogs$: Observable<ServerlogGetFull[]>;
  constructor(private api: Api) {}

  ngOnInit(): void {
    this.serverLogs$ = from(this.api.serverlog.getAllServerLogs()).pipe(
      map((response: any) => {
        return response?.serverLog;
      })
    );
  }
}
