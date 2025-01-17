import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ConceptSourcesService } from "src/app/core/services/concept-sources.service";
import { DataTypesService } from "src/app/core/services/datatypes.service";
import {
  ConceptdatatypeGet,
  ConceptsourceGet,
} from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-parameters-dashboard",
  templateUrl: "./parameters-dashboard.component.html",
  styleUrls: ["./parameters-dashboard.component.scss"],
})
export class ParametersDashboardComponent implements OnInit {
  conceptDataTypes$: Observable<ConceptdatatypeGet[]>;
  conceptSources$: Observable<ConceptsourceGet[]>;
  constructor(
    private dataTypesService: DataTypesService,
    private conceptSourceService: ConceptSourcesService
  ) {}

  ngOnInit(): void {
    this.conceptDataTypes$ = this.dataTypesService.getDataTypes();
    this.conceptSources$ = this.conceptSourceService.getConceptSources();
  }
}
