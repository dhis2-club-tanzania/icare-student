import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
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
  conceptToEdit: any;
  showList: boolean = false;
  conceptComponentReady: boolean = true;

  constructor(
    private conceptService: ConceptsService,
    private conceptSourceService: ConceptSourcesService
  ) {}

  ngOnInit(): void {
    this.conceptSources$ = this.conceptSourceService.getConceptSources();
    this.showList = true;
  }

  onEditInstrument(concept: any): void {
    this.conceptComponentReady = false;
    this.conceptService
      .getConceptDetailsByUuid(
        concept?.uuid,
        "custom:(uuid,display,datatype,set,retired,descriptions,name,names,setMembers:(uuid,display),conceptClass:(uuid,display),answers:(uuid,display),mappings:(uuid,conceptReferenceTerm:(uuid,display,conceptSource:(uuid,display))))"
      )
      .subscribe((response: any) => {
        if (response) {
          this.conceptComponentReady = true;
          this.conceptToEdit = response;
        }
      });
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
