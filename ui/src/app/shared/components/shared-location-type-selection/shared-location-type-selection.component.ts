import { Component, Input, OnInit } from "@angular/core";
import { LocationtagGetFull } from "../../resources/openmrs";

@Component({
  selector: "app-shared-location-type-selection",
  templateUrl: "./shared-location-type-selection.component.html",
  styleUrls: ["./shared-location-type-selection.component.scss"],
})
export class SharedLocationTypeSelectionComponent implements OnInit {
  @Input() locationTags: LocationtagGetFull[];
  @Input() allowedLocationTagsReferences: any[];

  headers: any[];
  constructor() {}

  ngOnInit(): void {
    this.headers = this.allowedLocationTagsReferences.map((allowedTag) => {
      return {
        ...allowedTag,
        ...(this.locationTags.filter(
          (tag) => tag?.uuid === allowedTag?.value
        ) || [])[0],
      };
    });
  }
}
