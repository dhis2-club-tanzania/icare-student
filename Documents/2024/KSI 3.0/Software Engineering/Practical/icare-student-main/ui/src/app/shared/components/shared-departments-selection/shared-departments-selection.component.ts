import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { Observable } from "rxjs";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";
import { ConceptGetFull } from "../../resources/openmrs";

@Component({
  selector: "app-shared-departments-selection",
  templateUrl: "./shared-departments-selection.component.html",
  styleUrls: ["./shared-departments-selection.component.scss"],
})
export class SharedDepartmentsSelectionComponent implements OnInit {
  @Input() searchTerm: string;
  @Output() selectedDepartments: EventEmitter<ConceptGetFull[]> =
    new EventEmitter<ConceptGetFull[]>();
  departmentsDetails$: Observable<any>;
  selectedItems: any[] = [];
  constructor(private conceptsService: ConceptsService) {}

  ngOnInit(): void {
    this.departmentsDetails$ = this.conceptsService.getConceptsBySearchTerm(
      this.searchTerm,
      "custom:(uuid,display)"
    );
  }

  onGetSelectedDepartments(event: MatSelectChange): void {
    this.selectedDepartments.emit(event.value);
  }
}
