import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-shared-location-based-logo",
  templateUrl: "./shared-location-based-logo.component.html",
  styleUrls: ["./shared-location-based-logo.component.scss"],
})
export class SharedLocationBasedLogoComponent implements OnInit {
  @Input() parentLocation: any;
  @Input() locationLogoAttributeTypeUuid: string;
  @Input() visitDetails: any;
  @Input() currentUser: any;

  logo: string;
  identifier: string;
  constructor() {}

  ngOnInit(): void {
    this.identifier = (this.visitDetails?.patient?.identifiers?.filter(
      (identifier: any) => identifier?.preferred
    ) || [])[0]?.identifier;
    this.logo =
      this.parentLocation?.attributes?.length > 0
        ? (this.parentLocation?.attributes?.filter(
            (attribute) =>
              attribute?.attributeType?.uuid ===
              this.locationLogoAttributeTypeUuid
          ) || [])[0]?.value
        : null;
  }
}
