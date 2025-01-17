import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-location-tree',
  templateUrl: './location-tree.component.html',
  styleUrls: ['./location-tree.component.scss'],
})
export class LocationTreeComponent implements OnInit {
  @Input() locations: any[];
  @Input() currentLocation: string;
  treeControl = new NestedTreeControl<any>((node) => node.childLocations);
  dataSource: ArrayDataSource<any>;
  hasChild: any;

  @Output() locationUpdate = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.dataSource = new ArrayDataSource(this.locations);
    this.hasChild = (_: number, node: any) =>
      !!node.childLocations && node.childLocations.length > 0;

      //console.log(this.locations)
  }

  onSelectLocation(e, location) {
    e.stopPropagation();
    this.locationUpdate.emit(location);
  }
}
