import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-pivot-header',
  templateUrl: './pivot-header.component.html',
  styleUrls: ['./pivot-header.component.scss'],
})
export class PivotHeaderComponent implements OnInit {
  @Input() allItemsKeys: string[];
  @Output() rowsToPivot = new EventEmitter<string[]>();
  @Output() columnsToPivot = new EventEmitter<string[]>();
  @Output() filtersToPivot = new EventEmitter<string[]>();
  @Output() excludedKeys = new EventEmitter<string[]>();
  @Output() updateLayout = new EventEmitter<any>();
  itemsOmitted = [];
  filterItems = [];
  columnItems = [];
  rowsItems = [];
  constructor() {}

  ngOnInit(): void {
    this.rowsItems = [this.allItemsKeys[0]];
    this.columnItems = this.allItemsKeys.splice(
      1,
      this.allItemsKeys.length - 1
    );
    this.itemsOmitted = ['Put your exclused data here'];
  }

  drop(event: CdkDragDrop<string[]>) {
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

  onUpdate(event: Event): void {
    event.stopPropagation();
    this.rowsToPivot.emit(this.rowsItems);
    this.columnsToPivot.emit(this.columnItems);
    this.filtersToPivot.emit(this.filterItems);
    this.excludedKeys.emit(this.itemsOmitted);
    setTimeout(() => {
      this.updateLayout.emit(true);
    }, 200);
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.updateLayout.emit(false);
  }
}
