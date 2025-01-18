import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  ConceptGetFull,
  ProgramGetFull,
} from "src/app/shared/resources/openmrs";
import { keyBy } from "lodash";

@Component({
  selector: "app-program-selection",
  templateUrl: "./program-selection.component.html",
  styleUrls: ["./program-selection.component.scss"],
})
export class ProgramSelectionComponent implements OnInit {
  @Input() programs: ProgramGetFull[];
  @Input() programConcepts: ConceptGetFull[];
  filteredPrograms: ProgramGetFull[] = [];
  @Output() selectedProgram: EventEmitter<ProgramGetFull> =
    new EventEmitter<ProgramGetFull>();
  keyedSelectedPrograms: { [key: string]: ProgramGetFull } = {};
  constructor() {}

  ngOnInit(): void {
    const keyedProgramConcepts: { [key: string]: ProgramGetFull } = keyBy(
      this.programConcepts,
      "uuid"
    );
    this.filteredPrograms = this.programs?.filter(
      (program: ProgramGetFull) => keyedProgramConcepts[program?.concept?.uuid]
    );
  }

  onGetProgram(event: Event, program: ProgramGetFull): void {
    event.stopPropagation();
    this.keyedSelectedPrograms[program?.uuid] = program;
    this.selectedProgram.emit(program);
  }
}
