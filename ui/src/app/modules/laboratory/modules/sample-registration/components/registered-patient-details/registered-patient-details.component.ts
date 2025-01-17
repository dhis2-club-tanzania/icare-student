import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { PersonService } from "src/app/core/services/person.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";

@Component({
  selector: "app-registered-patient-details",
  templateUrl: "./registered-patient-details.component.html",
  styleUrls: ["./registered-patient-details.component.scss"],
})
export class RegisteredPatientDetailsComponent implements OnInit {
  registeredPatientField: any = {};
  @Output() personDetails: EventEmitter<any> = new EventEmitter<any>();
  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.registeredPatientField = new Dropdown({
      key: "patient",
      id: "patient",
      label: "Search existing patient",
      options: [],
      searchControlType: "person",
      shouldHaveLiveSearchForDropDownFields: true,
    });
  }

  onFormUpdate(formValues: FormValue): void {
    const personUuid = formValues.getValues()["patient"]?.value;
    this.personService.getPatientByUuid(personUuid).subscribe((response) => {
      if (response) {
        this.personDetails.emit(response);
      }
    });
  }
}
