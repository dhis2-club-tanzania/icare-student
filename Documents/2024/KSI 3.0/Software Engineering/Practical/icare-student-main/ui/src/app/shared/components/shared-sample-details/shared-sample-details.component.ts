import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { keyBy } from "lodash";
import { Observable, zip } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";
import { Observation } from "../../resources/observation/models/observation.model";
import { VisitsService } from "../../resources/visits/services/visits.service";
import { SamplesService } from "../../services/samples.service";

@Component({
  selector: "app-shared-sample-details",
  templateUrl: "./shared-sample-details.component.html",
  styleUrls: ["./shared-sample-details.component.scss"],
})
export class SharedSampleDetailsComponent implements OnInit {
  @Input() sample: any;
  isClinical: boolean;
  obs$: Observable<any>;
  sampleConditions$: Observable<any>;
  sampleConditionsKeys: any[];
  @Output() visitDetails: EventEmitter<any> = new EventEmitter<any>();
  @Input() hasResults: boolean;
  @Input() departments: any[];
  @Input() specimenSources: any[];
  @Input() codedReasonsForRejection: any[];

  sampleDetails$: Observable<any>;
  externalSystems$: Observable<any[]>;
  constructor(
    private visitService: VisitsService,
    private conceptService: ConceptsService,
    private sampleService: SamplesService
  ) {}

  get sampleStatusesByCategory() {
    return keyBy(this.sample.statuses, "category");
  }

  ngOnInit(): void {
    this.hasResults = false;
    this.sampleDetails$ = this.sampleService.getFormattedSampleByUuid(
      this.sample?.uuid,
      this.departments,
      this.specimenSources,
      this.codedReasonsForRejection
    );
    this.obs$ = this.visitService
      .getVisitObservationsByVisitUuid({
        uuid: this.sample?.visit?.uuid,
        query: {
          v: "custom:(uuid,visitType,startDatetime,encounters:(uuid,encounterDatetime,encounterType,location,obs,orders,encounterProviders),stopDatetime,attributes:(uuid,display),location:(uuid,display,tags,parentLocation:(uuid,display)),patient:(uuid,display,identifiers,person,voided)",
        },
      })
      .pipe(
        map((obs) => {
          return !obs?.error && obs["3a010ff3-6361-4141-9f4e-dd863016db5a"]
            ? obs["3a010ff3-6361-4141-9f4e-dd863016db5a"]
            : "";
        })
      );
    this.sampleConditions$ = zip(
      this.conceptService.getConceptDetailsByUuid(
        this.sampleStatusesByCategory["CONDITION"]?.remarks
      ),
      this.conceptService.getConceptDetailsByUuid(
        this.sampleStatusesByCategory["TRANSPORT_CONDITION"]?.remarks
      ),
      this.conceptService.getConceptDetailsByUuid(
        this.sampleStatusesByCategory["TRANSPORT_TEMPERATURE"]?.remarks
      ),
      this.conceptService.getConceptDetailsByUuid(
        this.sampleStatusesByCategory["PRIORITY"]?.remarks
      )
    ).pipe(
      map((response) => {
        return {
          CONDITION: response[0]?.display,
          TRANSPORT_CONDITION: response[1]?.display,
          TRANSPORT_TEMPERATURE: response[2]?.display,
          PRIORITY: response[3]?.display,
        };
      })
    );
    this.sampleConditionsKeys = Object.keys(this.sampleStatusesByCategory);
    this.isClinical =
      (
        this.sample?.statuses?.filter(
          (status) => status?.status === "CLINICAL"
        ) || []
      )?.length > 0;
    this.visitService
      .getVisitDetailsByVisitUuid(this.sample?.visit?.uuid, {
        v: "custom:(uuid,visitType,startDatetime,attributes:(uuid,display,value,attributeType:(uuid,display))",
      })
      ?.subscribe((response) => {
        if (response) {
          this.visitDetails.emit(response);
        }
      });
  }
}
