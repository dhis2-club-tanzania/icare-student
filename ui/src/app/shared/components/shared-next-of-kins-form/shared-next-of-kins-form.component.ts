import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { PatientService } from "../../resources/patient/services/patients.service";
import { PersonattributetypeGetFull } from "../../resources/openmrs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-shared-next-of-kins-form",
  templateUrl: "./shared-next-of-kins-form.component.html",
  styleUrls: ["./shared-next-of-kins-form.component.scss"],
})
export class SharedNextOfKinsFormComponent implements OnInit {
  @Input() patient: any;
  personAttributeTypes$: Observable<PersonattributetypeGetFull[]>;
  @Output() nextOfKinsData: EventEmitter<any> = new EventEmitter<any>();
  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.personAttributeTypes$ = this.patientService
      .getPersonAttributeTypes()
      .pipe(
        map((response: any[]) => {
          return response?.filter(
            (attributeType: PersonattributetypeGetFull) =>
              attributeType?.display?.toLowerCase()?.indexOf("kin") === 0
          );
        })
      );
  }

  onGetNextOfKinsData(nextOfKinsData: any): void {
    this.nextOfKinsData.emit(nextOfKinsData);
  }
}
