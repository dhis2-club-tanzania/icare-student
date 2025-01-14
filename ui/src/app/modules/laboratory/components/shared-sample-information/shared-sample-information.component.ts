import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { keyBy, flatten } from "lodash";

@Component({
  selector: "app-shared-sample-information",
  templateUrl: "./shared-sample-information.component.html",
  styleUrls: ["./shared-sample-information.component.scss"],
})
export class SharedSampleInformationComponent implements OnInit {
  @Input() samplesData: any;
  @Input() collectionDateAndTimeUuids: any;
  @Input() receptionDateAndTimeUuids: any;
  @Input() requestedByUuids: any;
  @Input() clinicalDataUuids: any;
  visitDetails$: Observable<any>;
  referredHFUuid: string;
  constructor(private visitService: VisitsService) {}

  ngOnInit(): void {
    // console.log("data", this.samplesData);
    this.visitDetails$ = this.visitService
      .getVisitEncounterDetailsByVisitUuid({
        uuid: this.samplesData[0]?.visit?.uuid,
        query: {
          v: "custom:(uuid,visitType,attributes:(uuid,display,value,attributeType:(uuid,display)),startDatetime,encounters:(uuid,encounterDatetime,encounterType,form:(uuid,display,formFields:(uuid,fieldNumber,fieldPart,field:(uuid,display,concept:(uuid,display,datatype,units,setMembers:(uuid,display,datatype,units))))),location,obs,orders,diagnoses,encounterProviders),stopDatetime,attributes:(uuid,display),location:(uuid,display,tags,parentLocation:(uuid,display)),patient:(uuid,display,identifiers,person,voided)",
        },
      })
      .pipe(
        map((encounters) => {
          // console.log(encounters);
          let response = {
            obs: flatten(encounters?.map((encounter) => encounter?.obs)),
            orders: flatten(encounters?.map((encounter) => encounter?.orders)),
            diagnoses: flatten(
              encounters?.map((encounter) => encounter?.diagnoses)
            ),
            attributes: encounters[0]?.attributes,
          };

          const referredFromAttribute = (response?.attributes?.filter(
            (attribute) => attribute?.display?.indexOf("ReferredFrom:") > -1
          ) || [])[0];
          this.referredHFUuid = referredFromAttribute
            ? referredFromAttribute?.display?.split(": ")[1]
            : null;

          // console.log(response);

          return {
            ...response,
            obsKeyedByConcept: keyBy(
              response?.obs?.map((observation) => {
                return {
                  ...observation,
                  conceptUuid: observation?.concept?.uuid,
                };
              }),
              "conceptUuid"
            ),
          };
        })
      );
  }
}
