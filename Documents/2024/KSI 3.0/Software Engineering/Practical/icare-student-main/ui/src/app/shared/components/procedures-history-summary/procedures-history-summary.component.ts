import { Component, Input, OnInit } from "@angular/core";

import { flatten } from "lodash";

@Component({
  selector: "app-procedures-history-summary",
  templateUrl: "./procedures-history-summary.component.html",
  styleUrls: ["./procedures-history-summary.component.scss"],
})
export class ProceduresHistorySummaryComponent implements OnInit {
  @Input() patientVisits: any[];
  previouslyOrderedProcedures: any[];
  constructor() {}

  ngOnInit(): void {
    this.previouslyOrderedProcedures = flatten(
      this.patientVisits.map((patientVisit) => {
        const observations = patientVisit.observations;
        // TODO: Assign value to a specific procedure - encounter might be the best way to address this
        return patientVisit.procedureOrders.map((procedure) => {
          const matchedObs = (observations.filter(
            (observation) =>
              observation?.obs?.concept?.uuid ===
              procedure?.order?.concept?.uuid
          ) || [])[0];
          return {
            ...procedure?.order,
            observation: matchedObs
              ? {
                  obsDatetime: matchedObs?.obs?.obsDatetime,
                  value: matchedObs?.obs?.value?.display,
                  comment: matchedObs?.obs?.comment,
                }
              : null,
          };
        });
      }) || []
    );
    // console.log('allOrderedProcedures', this.previouslyOrderedProcedures);
  }
}
