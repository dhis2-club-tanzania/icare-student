import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { orderBy, uniqBy } from "lodash";

@Component({
  selector: "app-shared-lab-report-form-data",
  templateUrl: "./shared-lab-report-form-data.component.html",
  styleUrls: ["./shared-lab-report-form-data.component.scss"],
})
export class SharedLabReportFormDataComponent implements OnInit {
  @Input() formUuidsReferencesForSampleReportDisplay: any;
  @Input() visit: any;
  @Input() encounterInformation$: Observable<any>;
  constructor(private visitService: VisitsService) {}

  ngOnInit(): void {
    this.encounterInformation$ = this.visitService
      .getVisitEncounterDetailsByVisitUuid({
        uuid: this.visit?.uuid,
        query: {
          v: "custom:(uuid,visitType,startDatetime,encounters:(uuid,encounterDatetime,encounterType,form:(uuid,display,formFields:(uuid,fieldNumber,fieldPart,field:(uuid,display,concept:(uuid,display,datatype,setMembers:(uuid,display,datatype))))),location,obs,orders,diagnoses,encounterProviders),stopDatetime,attributes:(uuid,display),location:(uuid,display,tags,parentLocation:(uuid,display)),patient:(uuid,display,identifiers,person,voided)",
        },
      })
      .pipe(
        map((encounters) => {
          const formattedEncounters: any[] = uniqBy(
            encounters?.map((encounter) => {
              return {
                ...encounter,
                formUuid: encounter?.form?.uuid,
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
            }) || [],
            "formUuid"
          );
          return formattedEncounters &&
            formattedEncounters?.length > 0 &&
            this.formUuidsReferencesForSampleReportDisplay != "none"
            ? formattedEncounters?.filter(
                (encounter: any) =>
                  (
                    (
                      this.formUuidsReferencesForSampleReportDisplay || []
                    )?.filter((uuid: string) => uuid === encounter?.formUuid) ||
                    []
                  )?.length > 0
              )
            : [];
        })
      );
  }
}
