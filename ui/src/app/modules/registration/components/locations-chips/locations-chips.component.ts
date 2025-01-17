import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";

@Component({
  selector: "app-locations-chips",
  templateUrl: "./locations-chips.component.html",
  styleUrls: ["./locations-chips.component.scss"],
})
export class LocationsChipsComponent implements OnInit {
  @Input() locations: any[];
  @Input() currentVisit: any;
  @Output() emitLocationSelection = new EventEmitter<any>();
  currentRoom: any;

  searchTerm: string = "";

  currentPatientService$: Observable<any>;

  constructor(private conceptService: ConceptsService) {}

  ngOnInit(): void {
    this.currentRoom = this.currentVisit?.location;
    const visitServiceTypeObject = this.currentVisit?.attributes.filter(
      (visitAttribute) => {
        return (
          visitAttribute?.visitAttributeDetails?.attributeType?.display ==
          "Visit Service"
        );
      }
    );

    const visitTypeConcept =
      visitServiceTypeObject?.length > 0
        ? visitServiceTypeObject[0]?.visitAttributeDetails?.value
        : null;

    this.currentPatientService$ = this.conceptService.getConceptDetailsByUuid(
      visitTypeConcept,
      "custom:(uuid,display)"
    );
    this.locations = this.locations?.filter((location) => {
      return (
        //TODO: This has to be checked on as it seems different in this case
        // location?.billingConcept !== visitTypeConcept &&
        location?.uuid !== this.currentVisit?.location?.uuid
      );
    });
  }

  onSelectRoom(event: Event, room): void {
    event.stopPropagation();
    this.currentRoom = room;

    this.emitLocationSelection.emit(this.currentRoom);
  }

  searchRoom(e: Event) {
    e.stopPropagation();
    this.searchTerm = (e.target as HTMLInputElement).value;
  }
}
