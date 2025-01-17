import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { FormValue } from "../../modules/form/models/form-value.model";
import { Patient } from "../../resources/patient/models/patient.model";
import { Visit } from "../../resources/visits/models/visit.model";
import { VisitsService } from "../../resources/visits/services";
import { PatientService } from "../../services/patient.service";

@Component({
  selector: "app-capture-form-data",
  templateUrl: "./capture-form-data.component.html",
  styleUrls: ["./capture-form-data.component.scss"],
})
export class CaptureFormDataComponent implements OnInit {
  @Input() form: any;
  @Input() observations: any;
  @Input() isReport: boolean;
  @Input() visit: Visit;
  @Input() patient: Patient;
  observations$: Observable<any>;

  @Output() formDataUpdate = new EventEmitter<FormValue>();

  legendControl: any = {};
  constructor(
    private patientService: PatientService,
    private visitService: VisitsService
  ) {}

  ngOnInit(): void {
    this.observations$ = this.visitService.getVisitObservationsByVisitUuid({
      uuid: this.visit?.uuid,
      query: {
        v: "custom:(encounters:(uuid,obs))",
      },
    });
  }

  onFormUpdate(data) {
    this.formDataUpdate.emit(data);
  }

  onToggleLegend(e, itemName) {
    e.stopPropagation();
    this.legendControl[itemName] = this.legendControl[itemName]
      ? !this.legendControl[itemName]
      : true;
  }
}
