import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable, of } from "rxjs";
import { DatasetDefinitionsService } from "../../services/dataset-definitions.service";

import { uniqBy } from "lodash";

@Component({
  selector: "ngx-multiple-items-filter",
  templateUrl: "./multiple-items-filter.component.html",
  styleUrls: ["./multiple-items-filter.component.scss"],
})
export class MultipleItemsFilterComponent implements OnInit {
  @Input() selectedItems: any[];
  @Input() maxHeight: number; // In pixels
  datasetDefinitions$: Observable<any[]>;
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();
  constructor(private datasetDefinitionsService: DatasetDefinitionsService) {}

  ngOnInit(): void {
    this.getDatasetDefinitions();
  }

  getDatasetDefinitions(): void {
    this.datasetDefinitions$ = this.datasetDefinitionsService.getDataSets();
  }

  getSelectedItem(event: Event, item: any): void {
    event.stopPropagation();
    this.selectedItems = uniqBy([...this.selectedItems, item], "uuid");
    this.selected.emit(this.selectedItems);
  }

  unSelectItem(event: Event, item: any, allItems: any[]): void {
    event.stopPropagation();
    this.selectedItems =
      this.selectedItems?.filter(
        (selectedItem) => selectedItem?.uuid !== item?.uuid
      ) || [];
    this.datasetDefinitions$ = of(allItems);
    this.selected.emit(this.selectedItems);
  }
}
