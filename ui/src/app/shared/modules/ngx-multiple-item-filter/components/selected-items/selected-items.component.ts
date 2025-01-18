import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-selected-items",
  templateUrl: "./selected-items.component.html",
  styleUrls: ["./selected-items.component.scss"],
})
export class SelectedItemsComponent implements OnInit {
  @Input() selectedItems: any[];
  constructor() {}

  ngOnInit(): void {}
}
