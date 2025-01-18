import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-shared-drug-dosage-interpretation",
  templateUrl: "./shared-drug-dosage-interpretation.component.html",
  styleUrls: ["./shared-drug-dosage-interpretation.component.scss"],
})
export class SharedDrugDosageInterpretationComponent implements OnInit {
  @Input() prescription: any;
  @Input() showWarningOnly: boolean;
  expectedStopDate: Date;
  today: Date = new Date();
  showWarningMessage: boolean = false;
  constructor() {}

  ngOnInit(): void {
    const dateOrderActivated = new Date(this.prescription?.dateActivated);
    const totalDosageTimeInSeconds = Number(
      this.prescription?.durationUnits?.secondsPerUnitEquivalence
    );

    if (
      this.prescription?.frequency &&
      this.prescription?.frequency?.daysPerUnitEquivalence &&
      Number(this.prescription?.frequency?.daysPerUnitEquivalence) > 0
    ) {
      const expectedDaysForDose = Number(
        this.prescription?.quantity /
          (this.prescription?.dose *
            Number(this.prescription?.frequency?.daysPerUnitEquivalence))
      );
      this.expectedStopDate = new Date(
        dateOrderActivated.setMilliseconds(
          dateOrderActivated.getMilliseconds() +
            expectedDaysForDose * 24 * 60 * 60000
        )
      );

      this.showWarningMessage =
        new Date().getTime() < this.expectedStopDate.getTime();
      // this.expectedStopDate = dateOrderActivated + new Date(totalDosageTimeInSeconds)
    }
  }
}
