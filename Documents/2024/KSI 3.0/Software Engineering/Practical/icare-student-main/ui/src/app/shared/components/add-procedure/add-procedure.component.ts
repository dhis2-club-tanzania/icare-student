import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";

@Component({
  selector: "app-add-procedure",
  templateUrl: "./add-procedure.component.html",
  styleUrls: ["./add-procedure.component.scss"],
})
export class AddProcedureComponent implements OnInit {
  @Input() nursingConfigurations: any;
  proceduresDetails$: Observable<any>;
  @Output() procedures: EventEmitter<any> = new EventEmitter<any>();
  @Output() isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private conceptService: ConceptsService) {}

  ngOnInit(): void {
    // console.log("nursingConfigurations", this.nursingConfigurations);
    this.proceduresDetails$ = this.conceptService.getDepartmentDetails(
      this.nursingConfigurations?.departmentsReference?.id
    );
  }

  onGetDefinedProcedures(procedures: any): void {
    this.procedures.emit(procedures);
  }

  onGetFormValidity(isFormValid: boolean): void {
    this.isFormValid.emit(isFormValid);
  }
}
