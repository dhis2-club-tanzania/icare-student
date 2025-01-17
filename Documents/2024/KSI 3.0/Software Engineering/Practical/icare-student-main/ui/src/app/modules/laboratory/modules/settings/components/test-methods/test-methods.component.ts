import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DataTypesService } from "src/app/core/services/datatypes.service";
import { ConceptdatatypeGet } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-test-methods",
  templateUrl: "./test-methods.component.html",
  styleUrls: ["./test-methods.component.scss"],
})
export class TestMethodsComponent implements OnInit {
  conceptDataTypes$: Observable<ConceptdatatypeGet[]>;
  constructor(private dataTypesService: DataTypesService) {}

  ngOnInit(): void {
    this.conceptDataTypes$ = this.dataTypesService.getDataTypes();
  }
}
