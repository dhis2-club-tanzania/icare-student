import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable, of } from "rxjs";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptGetFull } from "src/app/shared/resources/openmrs";
import { uniqBy } from "lodash";
import { map } from "rxjs/operators";

@Component({
  selector: "app-concept-set-members",
  templateUrl: "./concept-set-members.component.html",
  styleUrls: ["./concept-set-members.component.scss"],
})
export class ConceptSetMembersComponent implements OnInit {
  @Input() setMembersSearchTerm: string;
  @Input() selectedSetMembersItems: any[];
  @Input() standardSearchTerm: string;
  @Input() testMethodUuid: string;
  @Input() setMembersListFromTestMethod: ConceptGetFull[];
  @Input() searchTermOfConceptSetToExcludeFromTestOrders: string;
  selectedItems: ConceptGetFull[] = [];
  conceptsList$: Observable<ConceptGetFull[]>;
  @Output() selectedSetMembers: EventEmitter<ConceptGetFull[]> =
    new EventEmitter<ConceptGetFull[]>();
  constructor(private conceptService: ConceptsService) {
  }

  ngOnInit(): void {
    this.conceptsList$ = this.testMethodUuid
      ? this.conceptService
          .getConceptDetailsByUuid(
            this.testMethodUuid,
            "custom:(uuid,display,setMembers:(uuid,display))"
          )
          .pipe(
            map((response) => {
              return response?.setMembers;
            })
          )
      : of([]);
  }

  onGetSelectedSetMembers(selectedSetMembers: ConceptGetFull[]): void {
    this.selectedSetMembers.emit(selectedSetMembers);
  }
}
