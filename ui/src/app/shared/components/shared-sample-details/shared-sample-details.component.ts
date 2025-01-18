import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { keyBy, orderBy } from "lodash";
import { Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";
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
  encounterInformation$: Observable<any>;
  sampleConditions$: Observable<any>;
  sampleConditionsKeys: any[];
  @Output() visitDetails: EventEmitter<any> = new EventEmitter<any>();
  @Input() hasResults: boolean;
  @Input() departments: any[];
  @Input() specimenSources: any[];
  @Input() codedReasonsForRejection: any[];

  sampleDetails$: Observable<any>;
  externalSystems$: Observable<any[]>;
  diagnoses$: Observable<any>;
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
    this.encounterInformation$ = this.visitService
      .getVisitEncounterDetailsByVisitUuid({
        uuid: this.sample?.visit?.uuid,
        query: {
          v: "custom:(uuid,visitType,startDatetime,encounters:(uuid,encounterDatetime,encounterType,form:(uuid,display,formFields:(uuid,fieldNumber,fieldPart,field:(uuid,display,concept:(uuid,display,datatype,setMembers:(uuid,display,datatype))))),location,obs,orders,diagnoses,encounterProviders),stopDatetime,attributes:(uuid,display),location:(uuid,display,tags,parentLocation:(uuid,display)),patient:(uuid,display,identifiers,person,voided)",
        },
      })
      .pipe(
        map((encounters) => {
          return encounters?.map((encounter) => {
            return {
              ...encounter,
              form: {
                ...encounter?.form,
                formFields: orderBy(
                  encounter?.form?.formFields?.filter(
                    (formField) => formField?.fieldNumber
                  ),
                  ["fieldNumber"],
                  ["asc"]
                )?.map((formField: any) => {
                  return {
                    ...formField,
                    field: {
                      ...formField?.field,
                      display: formField?.field?.display?.replace(
                        "SPECIMEN_SOURCE:",
                        ""
                      ),
                    },
                  };
                }),
              },
            };
          });
        })
      );
    this.diagnoses$ = this.visitService
      .getVisitDiagnosesByVisitUuid({
        uuid: this.sample?.visit?.uuid,
        query: {
          v: "custom:(uuid,startDatetime,encounters:(uuid,encounterDatetime,encounterType,location,diagnoses,encounterProviders),stopDatetime,attributes:(uuid,display),location:(uuid,display,tags,parentLocation:(uuid,display)),patient:(uuid,display,identifiers,person,voided)",
        },
      })
      .pipe(
        map((visitDetails) => {
          return visitDetails;
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
