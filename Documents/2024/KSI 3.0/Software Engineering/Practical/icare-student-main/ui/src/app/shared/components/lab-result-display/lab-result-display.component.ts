import { Component, Input, OnInit } from "@angular/core";
import { keyBy } from "lodash";

@Component({
  selector: "app-lab-result-display",
  templateUrl: "./lab-result-display.component.html",
  styleUrls: ["./lab-result-display.component.scss"],
})
export class LabResultDisplayComponent implements OnInit {
  @Input() labTest: any;
  @Input() codedResultsData: any;
  @Input() observationsKeyedByConcept: any;
  @Input() forSetMember: boolean;
  @Input() concept: any;
  testSetMembersKeyedByConceptUuid: any = {};
  keyedResults: any = {};
  baseUrl: string;
  constructor() {}

  ngOnInit(): void {
    this.keyedResults = keyBy(this.codedResultsData, "test");
    this.baseUrl = document.location.origin;
  }
}
