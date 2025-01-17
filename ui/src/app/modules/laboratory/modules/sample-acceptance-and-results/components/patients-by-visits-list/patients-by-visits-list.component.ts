import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { formatDateToYYMMDD } from 'src/app/shared/helpers/format-date.helper';
import { groupLabOrdersBySpecimenSources } from 'src/app/shared/helpers/sample-types.helper';
import { getPatientsByVisits } from 'src/app/shared/helpers/visits.helper';
import {
  collectSample,
  getBillingInfoBymRNo,
  getBillingInfoByVisitUuid,
  loadPatientNotes,
  loadPatientsDetails,
  loadPatientsVisitDetailsByVisitUuids,
  setLoadedSamples,
} from 'src/app/store/actions';
import { AppState } from 'src/app/store/reducers';
import {
  getAllSampleTypes,
  getAllVisits,
  getCollectedLabSamplesKeyedBySampleIdentifier,
  getCollectingLabSampleState,
  getLabSamplesToReCollect,
  getPatientVisitByVisitUuid,
  getPatientVisitLoadedState,
  getSampleTypesLoadedState,
  getVisitsDetailsLoadedState,
} from 'src/app/store/selectors';
import { BarCodeModalComponent } from '../../../../../../shared/dialogs/bar-code-modal/bar-code-modal.component';

@Component({
  selector: 'app-patients-by-visits-list',
  templateUrl: './patients-by-visits-list.component.html',
  styleUrls: ['./patients-by-visits-list.component.scss'],
})
export class PatientsByVisitsListComponent implements OnInit, OnChanges {
  @Input() visits: any;
  @Input() sampleTypes: any;
  @Input() labOrdersBillingInfo: any;
  @Input() visitsParameters: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() labConfigs: any;
  @Input() labOrdersGroupedByPatients: any;
  @Input() collectedLabOrders: any;
  @Input() sampleIdentifierDetails: any;
  @Input() acceptedLabOrders: any;
  @Input() rejectedLabOrders: any;
  @Input() labOrdersWithIntermediateResults: any;
  @Input() labOrdersWithFirstSignOff: any;
  @Input() labOrdersWithSecondSignOff: any;

  @Input() visitReferences: any;
  @Input() collectedSamplesFromAPI: any;
  @Input() testsContainers: any;
  @Input() sampleContainers: any;

  @Input() privileges: any;
  @Input() codedSampleRejectionReasons: any;
  @Input() labDepartments: any[];
  selectedVisit: any;
  displayedColumns: string[] = [
    'position',
    'status',
    'patientId',
    'names',
    'orderDate',
    'remarks',
  ];
  dataSource: any;
  patientUuid: string;
  visitUuid: string;
  patientsByVisits: any;
  searchingText: string = '';
  loadPatientIsSet: boolean = false;
  patient$: Observable<any>;
  showClinicalNotesSummary: boolean = false;
  selectedPatientVisit: any;
  loadedBillingInfoState$: Observable<boolean>;
  labOrdersBillingInfo$: Observable<any>;
  currentPatientVisit$: Observable<any>;
  visitsLoadedState$: Observable<boolean>;
  visitsDetailsLoadedSate$: Observable<boolean>;
  sampleTypesLoadedState$: Observable<boolean>;
  sampleTypes$: Observable<any>;
  visitsDetails$: Observable<any>;
  labSamplesToReCollect$: Observable<any[]>;
  /** TODO: Check how to handle this in a best way */
  userUuid = JSON.parse(sessionStorage.getItem('sessionInfo'))['user']['uuid'];

  collectingSampleMessage = {};
  sampleIdentification = {};
  samplePriority = {};
  sampleIdentificationKeyWord: string;
  patientsCollectedSamplesKeyedBySampleIdentifier$: Observable<any>;
  collectingLabSampleState$: Observable<boolean>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (
      this.privileges &&
      !this.privileges['Sample Collection'] &&
      !this.privileges['Sample Tracking'] &&
      !this.privileges['Laboratory Reports'] &&
      !this.privileges['Sample Acceptance and Results'] &&
      !this.privileges['Tests Settings']
    ) {
      window.location.replace('../../../bahmni/home/index.html#/dashboard');
    } else if (this.privileges && this.privileges['Tests Settings']) {
      this.router.navigate(['test-orders-control']);
    }
    const formattedLabSamples = groupLabOrdersBySpecimenSources(
      this.labOrdersGroupedByPatients,
      this.sampleTypes,
      this.collectedLabOrders,
      this.testsContainers,
      this.sampleContainers,
      this.visitReferences,
      this.codedSampleRejectionReasons,
      this.labConfigs,
      this.labDepartments
    );

    // console.log("testsContainers :: > ",formattedLabSamples);

    this.store.dispatch(setLoadedSamples({ labSamples: formattedLabSamples }));
    this.router.navigate(['/sample-management/collection']);
    this.patientUuid = this.route.snapshot.queryParams['patient'];
    this.visitUuid = this.route.snapshot.queryParams['visit'];
    this.patientsByVisits = getPatientsByVisits(this.visits);

    this.visitsDetailsLoadedSate$ = this.store.select(
      getVisitsDetailsLoadedState
    );
    this.sampleTypesLoadedState$ = this.store.select(getSampleTypesLoadedState);
    this.sampleTypes$ = this.store.select(getAllSampleTypes);
    this.visitsDetails$ = this.store.select(getAllVisits);

    this.labSamplesToReCollect$ = this.store.select(getLabSamplesToReCollect);

    this.sampleIdentificationKeyWord =
      this.labConfigs?.concepts['sampleIdentifier'] &&
      this.labConfigs?.concepts['sampleIdentifier']['keyWord']
        ? this.labConfigs.concepts['sampleIdentifier']['keyWord']
        : 'LAB';
    this.collectingLabSampleState$ = this.store.select(
      getCollectingLabSampleState
    );

    this.patientsCollectedSamplesKeyedBySampleIdentifier$ = this.store.select(
      getCollectedLabSamplesKeyedBySampleIdentifier
    );
  }

  ngOnChanges() {
    // this.dataSource = new MatTableDataSource(getPatientsByVisits(this.visits));
  }

  onOpenNewTab(e) {
    //e.stopPropagation();

    this.loadPatientIsSet = false;
  }

  getAttendedPatientData(e) {}

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
      this.samplePriority[sampleSelected?.id] == 'HIGH'
        ? {
            sample: {
              uuid: null,
            },
            user: {
              uuid: this.userUuid,
            },
            remarks: 'high priority',
            status: 'HIGH',
          }
        : null;

    this.store.dispatch(
      collectSample({
        sampleData: sample,
        details: {
          ...sampleSelected,
          collected: true,
          sampleCollectionDate: new Date().getTime(),
          searchingText:
            this.sampleIdentification[sampleSelected.id] +
            '-' +
            sampleSelected?.departmentName +
            '-' +
            sampleSelected?.name,
        },
        priorityDetails: priorityData,
      })
    );
  }

  getOrders(orders) {
    return _.map(orders, (order) => {
      return {
        uuid: order?.order_uuid,
      };
    });
  }

  generateSampleId(e, id) {
    e.stopPropagation();
    let now = new Date();
    const identifier =
      this.sampleIdentificationKeyWord +
      formatDateToYYMMDD(now).toString().split('-').join('').substring(2) +
      '/' +
      now.getTime().toString().substring(10, 13);
    const currentSampleIdElement = document.getElementById(id);
    this.sampleIdentification[id] = identifier;
    currentSampleIdElement.setAttribute('value', identifier);
    if (
      (this.labConfigs?.barCode && this.labConfigs?.barCode?.use) ||
      !this.labConfigs?.barCode
    )
      setTimeout(() => {
        this.dialog.open(BarCodeModalComponent, {
          height: '300px',
          width: '15%',
          data: identifier,
          disableClose: false,
          panelClass: 'custom-dialog-container',
        });
      }, 800);
  }

  onGetPatientVisit(patientVisit) {
    this.store.dispatch(
      getBillingInfoByVisitUuid({ visitUuid: patientVisit?.activeVisitUuid })
    );

    this.store.dispatch(
      getBillingInfoBymRNo({
        mrn: patientVisit?.identifier,
        visitsParameters: this.visitsParameters,
      })
    );

    this.store.dispatch(
      loadPatientsVisitDetailsByVisitUuids({
        visits: [patientVisit?.activeVisitUuid],
      })
    );
    this.loadPatientIsSet = true;
    this.selectedPatientVisit = patientVisit;
    this.router.navigate(['/sample-management/collection']);
    this.store.dispatch(
      loadPatientsDetails({
        patientId: patientVisit?.uuid,
      })
    );

    this.patient$ = this.store.select(getLoadedPatientById, {
      id: patientVisit?.uuid,
    });

    this.store.dispatch(
      loadPatientNotes({
        patientUuid: patientVisit?.uuid,
        conceptUuid: this.labConfigs['patientHistoryConceptUuid'],
      })
    );

    this.visitsLoadedState$ = this.store.select(getPatientVisitLoadedState);
    this.currentPatientVisit$ = this.store.select(getPatientVisitByVisitUuid, {
      id: patientVisit?.activeVisitUuid,
    });
  }

  setPriority(id, e) {
    if (e.checked) {
      this.samplePriority[id] = 'HIGH';
    } else {
      this.samplePriority[id] = '';
    }
  }

  onGetBackToList(e) {
    this.router.navigate(['/sample-management/collection']);
    this.loadPatientIsSet = false;
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  getDetailsOfTheVisit(visitDetails) {
    // this.router.navigate(['', { visit: visitDetails.id }]);
    this.selectedVisit = visitDetails;
    this.visitUuid = visitDetails.id;
    this.patientUuid = visitDetails.patientUuid;
  }

  viewPatient(details) {
    this.loadPatientIsSet = true;
    this.store.dispatch(
      loadPatientsDetails({
        patientId: details.patient.uuid,
      })
    );

    this.store.dispatch(
      loadPatientNotes({
        patientUuid: details.patient.uuid,
        conceptUuid: this.labConfigs['patientHistoryConceptUuid'],
      })
    );
    this.patient$ = this.store.select(getLoadedPatientById, {
      id: details.patient.uuid,
    });
  }

  showClinicalNotes(e) {
    e.stopPropagation();
    this.showClinicalNotesSummary = !this.showClinicalNotesSummary;
  }

  setPatientSelection() {
    this.loadPatientIsSet = false;
  }
}
function getLoadedPatientById(
  getLoadedPatientById: any,
  arg1: { id: any }
): Observable<any> {
  throw new Error('Function not implemented.');
}
