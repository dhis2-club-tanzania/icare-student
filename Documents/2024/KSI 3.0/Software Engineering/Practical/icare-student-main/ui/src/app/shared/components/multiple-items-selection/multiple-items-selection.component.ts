import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { uniqBy, orderBy } from "lodash";
import { Observable, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import { LocationService } from "src/app/core/services";
import { ReferenceTermsService } from "src/app/core/services/reference-terms.service";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";

@Component({
  selector: "app-multiple-items-selection",
  templateUrl: "./multiple-items-selection.component.html",
  styleUrls: ["./multiple-items-selection.component.scss"],
})
export class MultipleItemsSelectionComponent implements OnInit {
  @Input() items: any[];
  @Input() selectedItems: any[];
  @Input() itemType: string;
  @Input() standardSearchTerm: string;
  @Input() tag: string;
  @Input() source: string;
  @Input() conceptClass: string;
  @Input() multipleSelectionCompHeight: string;
  currentSelectedItems: any[] = [];
  @Output() getSelectedItems: EventEmitter<any[]> = new EventEmitter<any[]>();
  items$: Observable<any[]>;
  page: number = 1;
  pageSize: number = 10;
  constructor(
    private conceptService: ConceptsService,
    private conceptReferenceService: ReferenceTermsService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.currentSelectedItems =
      this.selectedItems?.filter((item) => !item?.retired) || [];
    if (
      this.itemType &&
      this.itemType === "concept" &&
      this.standardSearchTerm
    ) {
      this.items$ =
        this.items?.length > 0
          ? of(
              this.items?.map((item) => {
                return {
                  ...item,
                  display:
                    item?.display?.indexOf(":") > -1
                      ? item?.display?.split(":")[1]
                      : item?.display,
                  name:
                    item?.display?.indexOf(":") > -1
                      ? item?.display?.split(":")[1]
                      : item?.display,
                };
              })
            )
          : this.conceptService.searchConcept({
              q: this.standardSearchTerm,
              conceptClass: this.conceptClass,
              limit: this.pageSize,
              startIndex: (this.page - 1) * this.pageSize,
              searchTerm: this.standardSearchTerm,
            });
    } else if (this.itemType === "conceptReferenceTerm") {
      this.items$ = this.conceptReferenceService
        .getConceptReferenceTermsByParameters({
          q: "",
          source: this.source,
          limit: this.pageSize,
          startIndex: (this.page - 1) * this.pageSize,
          searchTerm: this.standardSearchTerm,
        })
        .pipe(
          map((response) => {
            return response?.filter((item) => !item?.retired) || [];
          })
        );
    } else {
      this.items$ = of(
        this.items.filter(
          (itemFromAll) =>
            (
              this.currentSelectedItems?.filter(
                (item) => item?.uuid === itemFromAll?.uuid
              ) || []
            )?.length === 0
        )
      );
    }
  }

  getSelectedItem(event: Event, item: any, items: any[]): void {
    event.stopPropagation();
    this.currentSelectedItems = uniqBy([...this.selectedItems, item]);
    this.items = this.items.filter(
      (metadataItem) =>
        (
          this.currentSelectedItems?.filter(
            (item) => item?.uuid === metadataItem?.uuid
          ) || []
        )?.length === 0
    );
    this.getSelectedItems.emit(this.currentSelectedItems);
  }

  removeSelectedItem(
    event: Event,
    item: any,
    items: any[],
    itemType: string
  ): void {
    event.stopPropagation();
    this.currentSelectedItems = uniqBy(
      this.currentSelectedItems.filter(
        (selectedItem) => selectedItem?.uuid !== item?.uuid
      )
    );
    this.getSelectedItems.emit(this.currentSelectedItems);
  }

  searchItem(event: KeyboardEvent): void {
    this.page = 1;
    const searchingText = (event.target as HTMLInputElement).value;
    this.loadItemsByParameters(searchingText, this.itemType);
  }

  getItems(event: Event, actionType: string, itemType: string): void {
    event.stopPropagation();
    this.page = actionType === "prev" ? this.page - 1 : this.page + 1;
    this.loadItemsByParameters(this.standardSearchTerm, itemType);
  }

  loadItemsByParameters(searchingText: string, itemType: string): void {
    if (itemType === "concept") {
      this.items$ = of(searchingText).pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((term) =>
          this.conceptService.searchConcept({
            q: term,
            conceptClass: this.conceptClass,
            limit: this.pageSize,
            startIndex: (this.page - 1) * this.pageSize,
            searchTerm: this.standardSearchTerm,
          })
        )
      );
    } else if (itemType === "conceptReferenceTerm") {
      this.items$ = of(searchingText).pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((term) =>
          this.conceptReferenceService.getConceptReferenceTermsByParameters({
            q: term,
            source: this.source,
            limit: this.pageSize,
            startIndex: (this.page - 1) * this.pageSize,
          })
        )
      );
    } else if (itemType === "location") {
      this.items$ = of(searchingText).pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((term) =>
          this.locationService.getLocationsByTagName(this.tag, {
            q: term,
            limit: this.pageSize,
            startIndex: (this.page - 1) * this.pageSize,
          })
        )
      );
    }
  }
}
