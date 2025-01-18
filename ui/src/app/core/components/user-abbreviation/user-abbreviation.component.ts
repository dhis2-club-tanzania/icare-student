import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-user-abbreviation",
  templateUrl: "./user-abbreviation.component.html",
  styleUrls: ["./user-abbreviation.component.scss"],
})
export class UserAbbreviationComponent implements OnInit {
  @Input() displayName: string;
  abbreviation: string;
  constructor() {}

  ngOnInit(): void {
    this.abbreviation = (
      this.displayName
        .split(" ")
        .map((name: string) => name?.substring(0, 1).toUpperCase()) || []
    ).join("");
  }
}
