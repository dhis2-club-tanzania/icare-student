import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable, of, pipe, zip } from "rxjs";
import { FormValue } from "../../modules/form/models/form-value.model";
import { OrdersService } from "../../resources/order/services/orders.service";
import { Visit } from "../../resources/visits/models/visit.model";
import { VisitsService } from "../../resources/visits/services";
import { flatten, orderBy, uniqBy } from "lodash";
import { ObservationObject } from "../../resources/observation/models/obsevation-object.model";
import { Patient } from "../../resources/patient/models/patient.model";
import { VisitObject } from "../../resources/visits/models/visit-object.model";
import { ICAREForm } from "../../modules/form/models/form.model";
import { AppState } from "src/app/store/reducers";
import { Store } from "@ngrx/store";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { getGroupedObservationByConcept } from "src/app/store/selectors/observation.selectors";
import { ObservationService } from "../../resources/observation/services";
import { keyBy, omit } from "lodash";
import { map } from "rxjs/operators";
import { ICARE_CONFIG } from "../../resources/config";
import { getObservationsFromForm } from "src/app/modules/clinic/helpers/get-observations-from-form.helper";

@Component({
  selector: "app-patient-observations-chart",
  templateUrl: "./patient-observations-chart.component.html",
  styleUrls: ["./patient-observations-chart.component.scss"],
})
export class PatientObservationsChartComponent implements OnInit {
  @Input() clinicalForm: ICAREForm;
  @Input() clinicalObservations: ObservationObject;
  @Input() patient: Patient;
  @Input() location: any;
  @Input() visit: VisitObject;
  @Input() encounterUuid: string;
  @Input() savingObservations: boolean;
  @Input() selectedForm: any;
  @Input() shouldUseOwnFormSelection: boolean;
  @Input() consultationOrderType: any;
  @Input() consultationEncounterType: any;
  @Input() provider: any;
  obsChartEncounterType$: any;
  activeVisit$: Observable<any>;
  savingObs: boolean;

  constructor(
    private visitService: VisitsService,
    private systemSettingsService: SystemSettingsService,
    private observationService: ObservationService
  ) {}

  ngOnInit(): void {
    this.obsChartEncounterType$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.ipd.encounterType.observationChart"
      );

    this.getActiveVisit();
  }

  onSave(data: any): void {
    this.savingObs = true;
    let encounterObject = {
      patient: this.patient?.id,
      encounterType: data.obsChartEncounterType,
      location: this.location?.uuid,
      encounterProviders: [
        {
          provider: this.provider?.uuid,
          encounterRole: ICARE_CONFIG?.encounterRole?.uuid,
        },
      ],
      visit: data.visit?.uuid,
      obs: data?.obs,
      form: {
        uuid: data?.form?.uuid 
      }
    };

    this.observationService
      .saveEncounterWithObsDetails(encounterObject)
      .subscribe((res) => {
        if (res) {
          this.savingObs = false;
          this.getActiveVisit();
        }
      });
  }

  getActiveVisit(): void {
    this.activeVisit$ = this.visitService.getActiveVisit(
      this.patient?.id,
      false
    );
  }
}
