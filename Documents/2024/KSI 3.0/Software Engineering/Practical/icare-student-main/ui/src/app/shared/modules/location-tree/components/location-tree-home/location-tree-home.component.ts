import { ArrayDataSource } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component, OnInit } from "@angular/core";

interface NodeModel {
  name: string;
  level?: number;
  id?: string;
  uuid?: string;
  children?: NodeModel[];
}

@Component({
  selector: "app-location-tree-home",
  templateUrl: "./location-tree-home.component.html",
  styleUrls: ["./location-tree-home.component.scss"],
})
export class LocationTreeHomeComponent implements OnInit {
  TREE_DATA: NodeModel[] = [
    {
      name: "Fruit",
      children: [
        { name: "Apple" },
        { name: "Banana" },
        { name: "Fruit loops" },
      ],
    },
    {
      name: "Vegetables",
      children: [
        {
          name: "Green",
          children: [{ name: "Broccoli" }, { name: "Brussels sprouts" }],
        },
        {
          name: "Orange",
          children: [{ name: "Pumpkins" }, { name: "Carrots" }],
        },
      ],
    },
  ];

  currentNodeData: any[];

  constructor() {}

  ngOnInit(): void {}
  treeControl = new NestedTreeControl<NodeModel>((node) => node.children);
  dataSource = new ArrayDataSource(this.TREE_DATA);

  hasChild = (_: number, node: NodeModel) =>
    !!node.children && node.children.length > 0;

  expandTheNode(event: Event, node: any): void {
    event.stopPropagation();
    console.log(node);
    this.currentNodeData = node?.children;
  }
}
