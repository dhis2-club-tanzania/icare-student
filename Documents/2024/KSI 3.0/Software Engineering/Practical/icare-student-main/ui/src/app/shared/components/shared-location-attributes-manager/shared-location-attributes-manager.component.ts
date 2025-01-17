import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { map } from "rxjs/operators";
import { Api } from "../../resources/openmrs";

@Component({
  selector: "app-shared-location-attributes-manager",
  templateUrl: "./shared-location-attributes-manager.component.html",
  styleUrls: ["./shared-location-attributes-manager.component.scss"],
})
export class SharedLocationAttributesManagerComponent implements OnInit {
  @Input() attributes: any[];
  @Input() attributeType: any;
  @Input() metadataType: string;
  @Input() location: any;
  @Output() loadLocation: EventEmitter<boolean> = new EventEmitter<boolean>();
  matchedAttributes: any[];
  existingMetadata$: Observable<any>;
  constructor(private api: Api) {}

  ngOnInit(): void {
    this.matchedAttributes =
      this.attributes?.filter(
        (attribute) => attribute?.attributeType?.uuid === this.attributeType
      ) || [];
    // TODO: Add catch error support
    this.getExistingMetadata();
  }

  getExistingMetadata(): void {
    this.existingMetadata$ =
      this.matchedAttributes && this.matchedAttributes?.length > 0
        ? zip(
            ...this.matchedAttributes.map((attribute) => {
              return this.metadataType === "form" ||
                this.metadataType === "concept"
                ? from(
                    this.metadataType === "form"
                      ? this.api.form.getForm(attribute?.value)
                      : this.api.concept.getConcept(attribute?.value)
                  ).pipe(
                    map((response) => {
                      return {
                        ...response,
                        attributeUuid: attribute?.uuid,
                      };
                    })
                  )
                : of(attribute?.value);
            })
          ).pipe(
            map((response) => {
              return response;
            })
          )
        : of([]);
  }

  onDelete(event: Event, metadata: any): void {
    event.stopPropagation();
    from(
      this.api.location.deleteLocationAttribute(
        this.location?.uuid,
        metadata?.attributeUuid
      )
    ).subscribe((response) => {
      if (response) {
        console.warn(response);
      }
    });
    this.matchedAttributes =
      this.matchedAttributes?.filter(
        (attribute) => attribute?.uuid != metadata?.attributeUuid
      ) || [];
    setTimeout(() => {
      this.getExistingMetadata();
      this.loadLocation.emit(true);
    }, 200);
  }
}
