import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ConceptGetFull } from "../../resources/openmrs";

import { orderBy, uniqBy } from "lodash";

@Component({
  selector: "app-multiple-concepts-selection",
  templateUrl: "./multiple-concepts-selection.component.html",
  styleUrls: ["./multiple-concepts-selection.component.scss"],
})
export class MultipleConceptsSelectionComponent implements OnInit {
  @Input() concepts: ConceptGetFull[];
  @Input() selectedSetMembersItems: any[];
  selectedItems: ConceptGetFull[] = [];
  @Output() selectedSetMembers: EventEmitter<ConceptGetFull[]> =
    new EventEmitter<ConceptGetFull[]>();
  constructor() {}

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

  searchConcept(event): void {
    console.log(event);
  }
}
