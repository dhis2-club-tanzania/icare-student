import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptGet } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-coded-answers-selection",
  templateUrl: "./coded-answers-selection.component.html",
  styleUrls: ["./coded-answers-selection.component.scss"],
})
export class CodedAnswersSelectionComponent implements OnInit {
  @Input() selectedItems: ConceptGet[];
  codedAnswers$: Observable<ConceptGet[]>;
  @Output() selectedAnswers: EventEmitter<ConceptGet[]> = new EventEmitter<
    ConceptGet[]
  >();
  constructor(private conceptService: ConceptsService) {}

  ngOnInit(): void {}

  onGetSelectedAnswers(answers: ConceptGet[]): void {
    this.selectedAnswers.emit(answers);
  }
}
