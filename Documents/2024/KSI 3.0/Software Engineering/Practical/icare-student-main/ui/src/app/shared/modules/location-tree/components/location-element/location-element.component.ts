import { ArrayDataSource } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-location-element",
  templateUrl: "./location-element.component.html",
  styleUrls: ["./location-element.component.scss"],
})
export class LocationElementComponent implements OnInit {
  @Input() nodeData: any[];
  treeControl: any;
  dataSource: any;
  currentNodeData: any[];
  constructor() {}

  ngOnInit(): void {
    console.log(this.nodeData);
    this.treeControl = new NestedTreeControl<any>((node) => node.children);
    this.dataSource = new ArrayDataSource(this.nodeData);
  }

  hasChild = (_: number, node: any) =>
    !!node.children && node.children.length > 0;

  expandTheNode(event: Event, node: any): void {
    event.stopPropagation();
    console.log(node);
    this.currentNodeData = node?.children;
  }
}
