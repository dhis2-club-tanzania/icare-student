import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
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
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { OpenMRSFormsService } from "../../resources/forms/services/openmrs-forms.services";

@Component({
  selector: "app-multiple-items-selection",
  templateUrl: "./multiple-items-selection.component.html",
  styleUrls: ["./multiple-items-selection.component.scss"],
})
export class MultipleItemsSelectionComponent implements OnInit, OnChanges {
  @Input() items: any[];
  @Input() selectedItems: any[];
  @Input() itemType: string;
  @Input() standardSearchTerm: string;
  @Input() tag: string;
  @Input() source: string;
  @Input() conceptClass: string;
  @Input() multipleSelectionCompHeight: string;
  @Input() searchTermOfConceptSetToExcludeFromTestOrders: string;
  currentSelectedItems: any[] = [];
  @Output() getSelectedItems: EventEmitter<any[]> = new EventEmitter<any[]>();
  items$: Observable<any[]>;
  page: number = 1;
  pageSize: number = 10;
  constructor(
    private conceptService: ConceptsService,
    private conceptReferenceService: ReferenceTermsService,
    private locationService: LocationService,
    private formsService: OpenMRSFormsService
  ) {}

  ngOnInit(): void {
    // console.log(this.source);
    this.currentSelectedItems = this.selectedItems || [];
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
          : this.conceptService
              .searchConcept({
                q: this.standardSearchTerm,
                conceptClass: this.conceptClass,
                pageSize: this.pageSize,
                page: this.page,
                searchTerm: this.standardSearchTerm,
                searchTermOfConceptSetToExclude:
                  this.searchTermOfConceptSetToExcludeFromTestOrders,
              })
              .pipe(map((response: any) => response?.results));
    } else if (this.itemType === "conceptReferenceTerm") {
      // console.log(":NDANI");
      this.items$ = this.conceptReferenceService
        .getConceptReferenceTermsByParameters({
          q: "",
          source: this.source,
          limit: this.pageSize,
          startIndex: (this.page - 1) * this.pageSize,
          searchTerm: this.standardSearchTerm,
        })
        .pipe(
          map((results) => {
            return results?.filter((item) => !item?.retired) || [];
          })
        );
    }
    if (this.itemType && this.itemType === "form") {
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
          : this.formsService
              .getAllForms([
                `startIndex=0`,
                `limit=${this.pageSize}`,
                `v=custom:(uuid,display,name)`,
              ])
              .pipe(map((response: any) => response?.results));
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

  ngOnChanges(): void {
    this.currentSelectedItems = this.selectedItems || [];
  }

  getSelectedItem(event: Event, item: any, items: any[]): void {
    event.stopPropagation();
    this.currentSelectedItems = uniqBy([...(this.selectedItems || []), item]);
    this.items = (this.items || [])?.filter(
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
          this.conceptService
            .searchConcept({
              q: term,
              conceptClass: this.conceptClass,
              pageSize: this.pageSize,
              page: this.page,
              searchTerm: this.standardSearchTerm,
            })
            .pipe(map((response: any) => response?.results))
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
    } else if (itemType === "form") {
      this.items$ = of(searchingText).pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((term) =>
          this.formsService
            .getAllForms([
              `q=${term}`,
              `startIndex=0`,
              `limit=${this.pageSize}`,
              `v=custom:(uuid,display,name)`,
            ])
            .pipe(map((response: any) => response?.results))
        )
      );
    } else {
    }
  }

  selectAll(event: Event, items: any[]): void {
    event.stopPropagation();
    this.currentSelectedItems = uniqBy([...this.selectedItems, ...items]);
    this.items = [];
    this.getSelectedItems.emit(this.currentSelectedItems);
  }

  UnSelectAll(event: Event, items: any[]): void {
    event.stopPropagation();
    this.currentSelectedItems = [];
    this.items = [...this.items, ...items];
    this.getSelectedItems.emit(this.currentSelectedItems);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
