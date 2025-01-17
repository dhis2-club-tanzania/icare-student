import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptGetFull } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-standard-concepts-list",
  templateUrl: "./standard-concepts-list.component.html",
  styleUrls: ["./standard-concepts-list.component.scss"],
})
export class StandardConceptsListComponent implements OnInit {
  @Input() standardSearchTerm: string;
  @Input() selectedConceptUuid: string;
  @Input() conceptClass: string;
  conceptsList$: Observable<ConceptGetFull[]>;
  saving: boolean = false;

  page: number = 1;
  pageSize: number = 10;

  @Output() conceptToEdit: EventEmitter<ConceptGetFull> =
    new EventEmitter<ConceptGetFull>();
  constructor(private conceptService: ConceptsService) {}

  ngOnInit(): void {
    this.conceptsList$ = this.conceptService.searchConcept({
      limit: this.pageSize,
      conceptClass: this.conceptClass,
      startIndex: (this.page - 1) * this.pageSize,
      searchTerm: this.standardSearchTerm,
    });
  }

  onEdit(event: Event, concept: ConceptGetFull): void {
    this.conceptToEdit.emit(concept);
  }

  onDelete(event: Event, concept: ConceptGetFull): void {
    this.saving = true;
    this.conceptService.deleteConcept(concept?.uuid).subscribe((response) => {
      if (response) {
        this.saving = false;
        this.conceptsList$ = this.conceptService.getConceptsBySearchTerm(
          this.standardSearchTerm
        );
      }
    });
  }

  searchConcept(event: KeyboardEvent): void {
    this.page = 1;
    const searchingText = (event.target as HTMLInputElement).value;
    if (searchingText) {
      this.conceptsList$ = this.conceptService.searchConcept({
        q: searchingText,
        limit: this.pageSize,
        conceptClass: this.conceptClass,
        startIndex: (this.page - 1) * this.pageSize,
        searchTerm: this.standardSearchTerm,
      });
    }
  }

  getConceptList(event: Event, action: string): void {
    event.stopPropagation();
    this.page = action === "prev" ? this.page - 1 : this.page + 1;
    this.conceptsList$ = this.conceptService.searchConcept({
      limit: this.pageSize,
      conceptClass: this.conceptClass,
      startIndex: (this.page - 1) * this.pageSize,
      searchTerm: this.standardSearchTerm,
    });
  }
}
