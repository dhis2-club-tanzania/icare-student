import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as _ from "lodash";
import { UntypedFormControl } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { BarCodeModalComponent } from "../../../../../../shared/dialogs/bar-code-modal/bar-code-modal.component";
import { AppState } from "src/app/store/reducers";
import {
  getCollectingLabSampleState,
  getPatientCollectedLabSamples,
  getPatientsSamplesToCollect,
} from "src/app/store/selectors";
import { collectSample } from "src/app/store/actions";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";

@Component({
  selector: "app-patient-orders",
  templateUrl: "./patient-orders.component.html",
  styleUrls: ["./patient-orders.component.scss"],
})
export class PatientOrdersComponent implements OnInit {
  @Input() patient: any;
  @Input() sampleTypes: any;
  @Input() labConfigs: any;
  @Input() currentVisit: any;
  @Input() labDepartments: any;
  @Input() labSampleTypes: any;
  @Input() codedSampleRejectionReasons: any;
  @Input() labSamplesAndTestsContainers: any;
  @Output() backToPatientList = new EventEmitter<any>();
  @Input() visitsParameters: any;
  sampledOrders: any[];
  samplesSelected: any[] = [];
  collectingSample: boolean = false;
  collectingSampleMessage = {};
  sampleIdentification: any = {};
  samplePriority: any = {};
  priorityConcept = {
    uuid: "",
    name: "",
  };
  sampleIdentifierConcept = {
    uuid: "",
    name: "",
  };
  savedData: any = {};
  samplesCollected: any[];

  selected = new UntypedFormControl(0);

  sampleValues = {};

  // New
  samplesToCollect$: Observable<any>;
  samplesCollected$: Observable<any>;
  sampleIdentificationKeyWord: string;
  currentPatientCollectedSamples$: Observable<any>;
  previousCollectedSample = {};

  collectingLabSampleState$: Observable<boolean>;

  /** TODO: Check how to handle this in a best way */
  userUuid = JSON.parse(sessionStorage.getItem("sessionInfo"))["user"]["uuid"];
  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    // console.log("nimeitwa :: ")

    // this.store.dispatch(
    //   loadLabSamplesByVisit({
    //     visit: '',
    //     sampleTypes: this.labSampleTypes,
    //     departments: this.labDepartments,
    //     containers: this.labSamplesAndTestsContainers,
    //     configs: this.labConfigs,
    //     codedSampleRejectionReasons: this.codedSampleRejectionReasons,
    //   })
    // );

    this.sampleIdentificationKeyWord =
      this.labConfigs?.concepts["sampleIdentifier"] &&
      this.labConfigs?.concepts["sampleIdentifier"]["keyWord"]
        ? this.labConfigs.concepts["sampleIdentifier"]["keyWord"]
        : "LAB";
    // console.log('labConfigs at patient orders', this.labConfigs);
    this.priorityConcept = this.labConfigs?.concepts?.samplePriority;
    this.sampleIdentifierConcept = this.labConfigs?.concepts?.sampleIdentifier;

    this.samplesToCollect$ = this.store.select(getPatientsSamplesToCollect, {
      patient_uuid: this.patient?.uuid,
    });

    this.samplesCollected$ = this.store.select(getPatientCollectedLabSamples, {
      patient_uuid: this.patient?.uuid,
    });
    this.currentPatientCollectedSamples$ = this.store.select(
      getPatientCollectedLabSamples,
      {
        patient_uuid: this.patient?.uuid,
      }
    );
    this.collectingLabSampleState$ = this.store.select(
      getCollectingLabSampleState
    );
  }

  onGetBackToList(e) {
    e.stopPropagation();
    // this.store.dispatch(
    //   reloadPatientsLabOrders({
    //     visitStartDate: this.visitsParameters.startDate,
    //     endDate: this.visitsParameters.endDate,
    //     configs: this.labConfigs,
    //   })
    // );
    this.backToPatientList.emit(true);
  }

  getOrders(orders) {
    return _.map(orders, (order) => {
      return {
        uuid: order?.order_uuid,
      };
    });
  }

  saveSamplesToCollect(e, sampleSelected) {
    // console.log('sampleSelected', sampleSelected);
    this.collectingSampleMessage[sampleSelected?.id] = true;
    const sample = {
      visit: {
        uuid: sampleSelected?.orders[0]?.visit_uuid,
      },
      label: this.sampleIdentification[sampleSelected.id],
      concept: {
        uuid: sampleSelected?.orders[0]?.specimenUuid,
      },
      orders: this.getOrders(sampleSelected?.orders),
    };
    const priorityData =
      this.samplePriority[sampleSelected?.id] &&
      this.samplePriority[sampleSelected?.id] == "HIGH"
        ? {
            sample: {
              uuid: null,
            },
            user: {
              uuid: this.userUuid,
            },
            remarks: "high priority",
            status: "Urgent",
          }
        : null;

    // console.log('sample', sample);

    // console.log('priorityData', priorityData);
    this.store.dispatch(
      collectSample({
        sampleData: sample,
        details: {
          ...sampleSelected,
          collected: true,
          sampleCollectionDate: new Date().getTime(),
          searchingText:
            this.sampleIdentification[sampleSelected.id] +
            "-" +
            sampleSelected?.departmentName +
            "-" +
            sampleSelected?.name,
        },
        priorityDetails: priorityData,
      })
    );
  }

  setProviders(providers) {
    let provider_names = "";
    _.map(providers, (provider) => {
      provider_names += provider?.name + " ";
    });
  }

  setPriority(id, e) {
    if (e.checked) {
      this.samplePriority[id] = "HIGH";
    } else {
      this.samplePriority[id] = "";
    }
  }

  formatObs(obs) {
    return _.map(obs, (observation) => {
      return {
        person: JSON.parse(localStorage.getItem("provider"))["providerUuid"],
        concept: observation.concept.uuid,
        obsDatetime: observation.obsDatetime,
        value: observation.value,
        location: observation.location.uuid,
        encounter: observation.encounter.uuid,
        accessionNumber: null,
      };
    });
  }

  formatOrders(orders) {
    let formattedOrders = [];
    let conceptsTaken = {};
    _.each(orders, (order) => {
      conceptsTaken[order.concept.uuid]
        ? ""
        : (formattedOrders = [
            ...formattedOrders,
            {
              concept: {
                uuid: order.concept.uuid,
              },
            },
          ]);
      conceptsTaken[order.concept.uuid] = order.concept;
    });
    return formattedOrders;
  }

  getOtherVisits(allVisits) {
    return _.takeRight(allVisits, allVisits.length - 1);
  }

  generateSampleId(e, id) {
    e.stopPropagation();
    let now = new Date();
    const identifier =
      this.sampleIdentificationKeyWord +
      formatDateToYYMMDD(now).toString().split("-").join("").substring(2) +
      "/" +
      now.getTime().toString().substring(10, 13);
    const currentSampleIdElement = document.getElementById(id);
    this.sampleIdentification[id] = identifier;
    currentSampleIdElement.setAttribute("value", identifier);
    if (
      (this.labConfigs?.barCode && this.labConfigs?.barCode?.use) ||
      !this.labConfigs?.barCode
    )
      setTimeout(() => {
        this.dialog.open(BarCodeModalComponent, {
          height: "300px",
          width: "15%",
          data: identifier,
          disableClose: false,
          panelClass: "custom-dialog-container",
        });
      }, 800);
  }

  usePreviousSampleId(e, id, sampleIdentification) {
    e.stopPropagation();
    this.previousCollectedSample[id] = sampleIdentification;
    const currentSampleIdElement = document.getElementById(id);
    this.sampleIdentification[id] = sampleIdentification;
    currentSampleIdElement.setAttribute("value", sampleIdentification);
  }

  changeTab(val) {
    this.selected.setValue(val);
  }
}
