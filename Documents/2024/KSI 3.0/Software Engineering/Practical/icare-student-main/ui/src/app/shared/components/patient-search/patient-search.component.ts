import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { resultMemoize, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";
import { addCurrentPatient } from "../../../store/actions";
import { AppState } from "../../../store/reducers";
import { PhoneNumber } from "../../modules/form/models/phone-number.model";
import { Patient } from "../../resources/patient/models/patient.model";
import { PatientService } from "../../resources/patient/services/patients.service";

@Component({
  selector: "app-patient-search",
  templateUrl: "./patient-search.component.html",
  styleUrls: ["./patient-search.component.scss"],
})
export class PatientSearchComponent implements OnInit {
  @Output() selectPatient: EventEmitter<any> = new EventEmitter();
  @Output() displayList: EventEmitter<any> = new EventEmitter();
  patients$: Observable<any>;
  searching: boolean;
  showList: boolean;
  nopatient: boolean = true;
  displayedColumn: string[] = [
    "id",
    "name",
    "gender",
    "age",
    "phone",
    // "insurance",
  ];
  focused: boolean;

  constructor(
    private patientService: PatientService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {}

  onSearchPatients(e): void {
    if (e) {
      e.stopPropagation();
      this.searching = true;
      this.showList = false;

      this.patients$ = this.patientService.getPatients(e.target.value).pipe(
        map((results) => {
          return results?.map((res) => {
            return {
              ...res,
              insurance:
                res?.patient?.person?.attributes?.filter((attribute) => {
                  return (
                    attribute?.attributeType?.uuid ===
                    "58867285-7f8e-4ddf-aef6-f0c3d8f73305"
                  );
                })[0]?.value || [],
              phoneNumber:
                res?.patient?.person?.attributes?.filter((attribute) => {
                  return (
                    attribute?.attributeType?.uuid ===
                      "96878413-bbae-4ee0-812f-241a4fc94500" ||
                    attribute?.attributeType?.uuid ===
                      "aeb3a16c-f5b6-4848-aa51-d7e3146886d6"
                  );
                })[0]?.value || [],
            };
          });
        }),
        tap(() => {
          this.searching = false;
          this.showList = true;
        })
      );

      if (e.target.value.length > 0) {
        this.focused = true;
      } else {
        this.focused = false;
      }

      this.displayList.emit(this.focused);
    }
  }
  onSelectPatient(e, patient: Patient): void {
    e.stopPropagation();
    //this.showList = false;
    // console.log("The patient is :", patient);
    this.store.dispatch(addCurrentPatient({ patient }));
    this.selectPatient.emit(patient);
  }
}
