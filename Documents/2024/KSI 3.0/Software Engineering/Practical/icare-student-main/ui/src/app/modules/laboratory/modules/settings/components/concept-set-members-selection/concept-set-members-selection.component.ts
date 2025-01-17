import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ConceptGetFull } from "src/app/shared/resources/openmrs";
import { uniqBy, orderBy } from "lodash";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";

@Component({
  selector: "app-concept-set-members-selection",
  templateUrl: "./concept-set-members-selection.component.html",
  styleUrls: ["./concept-set-members-selection.component.scss"],
})
export class ConceptSetMembersSelectionComponent implements OnInit {
  @Input() concepts: ConceptGetFull[];
  @Input() selectedSetMembersItems: any[];
  selectedItems: ConceptGetFull[] = [];
  @Output() selectedSetMembers: EventEmitter<ConceptGetFull[]> =
    new EventEmitter<ConceptGetFull[]>();
  constructor(private conceptService: ConceptsService) {}

  ngOnInit(): void {
    this.selectedItems = this.selectedSetMembersItems;
    this.concepts = this.concepts.filter(
      (concept) =>
        (
          this.selectedItems?.filter((item) => item?.uuid === concept?.uuid) ||
          []
        )?.length === 0
    );
  }

  getSelectedItem(event: Event, item: ConceptGetFull): void {
    event.stopPropagation();
    this.selectedItems = uniqBy([...this.selectedItems, item]);
    this.concepts = this.concepts.filter(
      (concept) =>
        (
          this.selectedItems?.filter((item) => item?.uuid === concept?.uuid) ||
          []
        )?.length === 0
    );
    this.concepts = orderBy(this.concepts, ["name"], ["asc"]);
    this.selectedSetMembers.emit(this.selectedItems);
  }

  removeSelectedItem(event: Event, item: ConceptGetFull): void {
    event.stopPropagation();
    this.selectedItems = uniqBy(
      this.selectedItems.filter(
        (selectedItem) => selectedItem?.uuid !== item?.uuid
      )
    );
    this.concepts = orderBy([...this.concepts, item], ["name"], ["asc"]);
    this.selectedSetMembers.emit(this.selectedItems);
  }

  searchConcept(event: KeyboardEvent): void {
    const searchingText = (event.target as HTMLInputElement).value;
    if (searchingText && searchingText?.length > 2) {
      this.conceptService
        .getConceptsByParameters({
          searchingText: searchingText,
          page: 1,
          pageSize: 10,
        })
        .subscribe((response) => {
          this.concepts = response;
        });
    } else {
      this.concepts = this.concepts;
    }
  }
}
