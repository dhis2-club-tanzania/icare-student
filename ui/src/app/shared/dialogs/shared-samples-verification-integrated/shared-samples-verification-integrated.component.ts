import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { DHIS2BasedSystems } from "src/app/core/constants/external-dhis2-based-systems.constants";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { OtherClientLevelSystemsService } from "src/app/modules/laboratory/resources/services/other-client-level-systems.service";
import { formatDateToYYMMDD } from "../../helpers/format-date.helper";
import { Dropdown } from "../../modules/form/models/dropdown.model";
import { Field } from "../../modules/form/models/field.model";
import { FormValue } from "../../modules/form/models/form-value.model";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";
import { VisitsService } from "../../resources/visits/services";

@Component({
  selector: "app-shared-samples-verification-integrated",
  templateUrl: "./shared-samples-verification-integrated.component.html",
  styleUrls: ["./shared-samples-verification-integrated.component.scss"],
})
export class SharedSamplesVerificationIntegratedComponent implements OnInit {
  labTestRequestProgramStageId: string;
  externalSystems$: Observable<any>;
  systemsField: Field<string>;
  isFormValid: boolean = false;
  selectedSystem: string;
  DHIS2BasedSystems: any = DHIS2BasedSystems;
  searchCriteriaField: Field<string>;
  searchCriteria: string;
  clientDetails$: Observable<any>;
  verify: boolean = false;
  resultsStageId$: Observable<any>;
  labRequestStageId$: Observable<any>;
  trackedEntityInstancesWithoutLabRequest: any;
  saving: boolean = false;
  verified: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<SharedSamplesVerificationIntegratedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private conceptService: ConceptsService,
    private systemSettongsService: SystemSettingsService,
    private otherClientLevelSystemsService: OtherClientLevelSystemsService,
    private visitService: VisitsService
  ) {
    this.labTestRequestProgramStageId = data?.labTestRequestProgramStageId;
  }

  ngOnInit(): void {
    this.externalSystems$ = this.conceptService
      .getConceptDetailsByUuid(
        this.data?.externalSystemsReferenceConceptUuid,
        "custom:(uuid,display,setMembers:(uuid,display,names))"
      )
      .pipe(
        map((response) => {
          return response?.setMembers;
        })
      );

    this.externalSystems$.subscribe((systems) => {
      if (systems) {
        this.systemsField = new Dropdown({
          id: "system",
          key: "system",
          required: true,
          label: "System",
          options: systems?.map((system) => {
            const shortNameDetails = (system?.names?.filter(
              (name) => name?.conceptNameType === "SHORT"
            ) || [])[0];

            this.labRequestStageId$ =
              this.systemSettongsService.getSystemSettingsByKey(
                `iCare.externalSystems.integrated.${shortNameDetails?.name}.programStages.testRequestStage`
              );
            this.resultsStageId$ =
              this.systemSettongsService.getSystemSettingsByKey(
                `iCare.externalSystems.integrated.${shortNameDetails?.name}.programStages.resultsStage`
              );
            return {
              value: shortNameDetails?.name,
              key: shortNameDetails?.name,
              label: system?.display,
              name: system?.display,
            };
          }),
        });
      }
    });
  }

  onClose(event: Event, clientDetails: any): void {
    event.stopPropagation();
    this.dialogRef.close(
      clientDetails ? { ...clientDetails, sendResults: true } : null
    );
  }

  onVerify(
    event: Event,
    resultsStageId: string,
    labRequestStageId: string
  ): void {
    event.stopPropagation();
    this.verify = true;
    this.clientDetails$ = this.otherClientLevelSystemsService
      .getClientsFromOtherSystems({
        identifier: this.data?.mrn,
        identifierReference: this.searchCriteria,
        labTestRequestProgramStageId: this.labTestRequestProgramStageId,
      })
      .pipe(
        map((response) => {
          if (response) {
            this.trackedEntityInstancesWithoutLabRequest = response?.filter(
              (trackedEntityInstance) =>
                (
                  trackedEntityInstance?.events?.filter(
                    (event) => event?.programStage === labRequestStageId
                  ) || []
                )?.length === 0
            );
            return this.trackedEntityInstancesWithoutLabRequest;
          }
        })
      );
  }

  onUpdateForm(formValue: FormValue): void {
    const values = formValue.getValues();
    this.isFormValid = formValue.isValid;
    this.selectedSystem = values?.system?.value;
    const searchingCriteria = (this.DHIS2BasedSystems?.filter(
      (system) => system?.id === this.selectedSystem
    ) || [])[0]?.searchingCriteria;
    this.searchCriteriaField = new Dropdown({
      id: "searchCriteria",
      key: "searchCriteria",
      required: true,
      label: "Search criteria",
      options: searchingCriteria?.map((criteria) => {
        return {
          value: criteria?.id,
          key: criteria?.id,
          label: criteria?.name,
          name: criteria?.name,
        };
      }),
    });
  }

  onGetSearchCriteria(formValue: FormValue): void {
    const values = formValue.getValues();
    this.isFormValid = formValue.isValid;
    this.searchCriteria = values?.searchCriteria?.value;
  }

  onSaveLabRequest(
    event: Event,
    labRequest: any,
    labRequestStageId: string
  ): void {
    event.stopPropagation();
    const visitAttribute = {
      attributeType: "0acd3180-710d-4417-8768-97bc45a02395",
      value: JSON.stringify({
        program: labRequest?.program,
        enrollment: labRequest?.enrollment,
        trackedEntityInstance: labRequest?.trackedEntityInstance,
        orgUnit: labRequest?.orgUnit,
      }),
    };

    this.saving = true;

    const labRequestPayload = {
      program: labRequest?.program,
      programStage: "emVt37lHjub",
      orgUnit: labRequest?.orgUnit,
      trackedEntityInstance: labRequest?.trackedEntityInstance,
      enrollment: labRequest?.enrollment,
      dataValues: [
        {
          dataElement: "Q98LhagGLFj",
          value: this.formatDateAndTime(new Date()),
        },
        { dataElement: "D0RBm3alWd9", value: "RT - PCR" },
        {
          dataElement: "RfWBPHo9MnC",
          value: this.formatDateAndTime(new Date()),
        },
        { dataElement: "HTBFvtjeztu", value: true },
        { dataElement: "xzuzLYN1f0J", value: true },
      ],
      eventDate: this.formatDateAndTime(new Date()),
    };

    zip(
      this.otherClientLevelSystemsService.sendLabRequest(labRequestPayload),
      this.visitService.createVisitAttribute(
        this.data?.visit?.uuid,
        visitAttribute
      )
    ).subscribe((response) => {
      if (response) {
        this.clientDetails$ = this.otherClientLevelSystemsService
          .getClientsFromOtherSystems({
            identifier: this.data?.mrn,
            identifierReference: this.searchCriteria,
            labTestRequestProgramStageId: this.labTestRequestProgramStageId,
          })
          .pipe(
            map((response) => {
              if (response) {
                this.trackedEntityInstancesWithoutLabRequest = response?.filter(
                  (trackedEntityInstance) =>
                    (
                      trackedEntityInstance?.events?.filter(
                        (event) => event?.programStage === labRequestStageId
                      ) || []
                    )?.length === 0
                );
                this.verified = true;
                return this.trackedEntityInstancesWithoutLabRequest;
              }
            }),
            catchError((error) => {
              this.verified = false;
              return of(error);
            })
          );
        this.saving = false;
      }
    });
  }

  formatDateAndTime(date: Date): string {
    return (
      formatDateToYYMMDD(date) +
      "T" +
      this.formatDimeChars(date.getHours().toString()) +
      ":" +
      this.formatDimeChars(date.getMinutes().toString()) +
      ":" +
      this.formatDimeChars(date.getSeconds().toString()) +
      ".000Z"
    );
  }

  formatDimeChars(char: string): string {
    return char.length == 1 ? "0" + char : char;
  }
}
