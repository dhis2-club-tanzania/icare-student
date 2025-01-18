import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ConceptSourcesService } from "src/app/core/services/concept-sources.service";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";

@Component({
  selector: "app-shared-instruments-management",
  templateUrl: "./shared-instruments-management.component.html",
  styleUrls: ["./shared-instruments-management.component.scss"],
})
export class SharedInstrumentsManagementComponent implements OnInit {
  standardSearchTerm: string = "LIS_INSTRUMENT";
  conceptClass: string = "LIS instrument";
  conceptSources$: Observable<any[]>;
  conceptToEdit$: Observable<any>;
  showList: boolean = false;

  constructor(
    private conceptService: ConceptsService,
    private conceptSourceService: ConceptSourcesService
  ) {}

  ngOnInit(): void {
    this.conceptSources$ = this.conceptSourceService.getConceptSources();
    this.showList = true;
  }

  onEditInstrument(event: any): void {
    console.log(event);
  }

  onGetConceptCreatedStatus(created: boolean): void {
    if (created) {
      this.showList = false;
      setTimeout(() => {
        this.showList = true;
      }, 100);
    }
  }
}
