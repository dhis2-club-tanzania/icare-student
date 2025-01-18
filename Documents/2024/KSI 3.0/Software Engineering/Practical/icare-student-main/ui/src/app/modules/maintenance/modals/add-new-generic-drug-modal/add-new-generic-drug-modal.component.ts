import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { omit } from "lodash";
import { Observable } from "rxjs";
import { ConceptSourcesService } from "src/app/core/services/concept-sources.service";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptCreate } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-add-new-generic-drug-modal",
  templateUrl: "./add-new-generic-drug-modal.component.html",
  styleUrls: ["./add-new-generic-drug-modal.component.scss"],
})
export class AddNewGenericDrugModalComponent implements OnInit {
  conceptSources$: Observable<any[]>;
  standardSearchTerm: string = "ICARE_GENERIC_DRUG";
  conceptClass: string = "Drug";
  dataType: string = "N/A";
  conceptToCreate: ConceptCreate;
  conceptName: string;
  conceptUuid: string;

  alertType: string;
  saving: boolean = false;
  savingMessage: string;
  shouldConfirm: boolean = false;

  dialogData: any;
  conceptDetails$: Observable<any>;
  constructor(
    private dialogRef: MatDialogRef<AddNewGenericDrugModalComponent>,
    private conceptSourceService: ConceptSourcesService,
    private conceptService: ConceptsService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.conceptSources$ = this.conceptSourceService.getConceptSources();
    if (this.dialogData?.uuid) {
      this.conceptUuid = this.dialogData?.uuid;
      this.conceptDetails$ = this.conceptService.getConceptDetailsByUuid(
        this.dialogData?.uuid,
        "custom:(uuid,names,display,conceptClass,descriptions,setMembers:(uuid,display),mappings)"
      );
    }
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(event: Event, confirmed?: boolean): void {
    event.stopPropagation();
    this.saving = false;
    if (confirmed) {
      this.saving = true;
      this.shouldConfirm = false;
      this.conceptService
        .searchConcept({ q: this.conceptName, conceptClass: this.conceptClass })
        .subscribe((checkResponse) => {
          if (checkResponse?.length > 0 && !this.conceptUuid) {
            this.saving = false;
            this.alertType = "danger";
            this.savingMessage =
              "Item with name " + this.conceptName + " exists";
            setTimeout(() => {
              this.savingMessage = null;
            }, 4000);
          } else {
            (!this.conceptUuid
              ? this.conceptService.createConcept(this.conceptToCreate)
              : this.conceptService.updateConcept(
                  this.conceptUuid,
                  omit(this.conceptToCreate, "descriptions")
                )
            ).subscribe((response: any) => {
              if (response && !response?.error) {
                this.saving = false;
                this.dialogRef.close(true);
              } else {
                this.saving = false;
                this.alertType = "danger";
              }
            });
          }
        });
    } else {
      this.shouldConfirm = true;
    }
  }

  onGetConceptToCreate(conceptToCreate: any): void {
    let names = [];

    const conceptMapType = "35543629-7d8c-11e1-909d-c80aa9edcf4e";

    let mappings =
      conceptToCreate?.codes && conceptToCreate?.codes?.length > 0
        ? conceptToCreate?.codes?.map((item) => {
            return {
              conceptReferenceTerm: item?.uuid,
              conceptMapType,
            };
          })
        : [];
    this.conceptName = conceptToCreate?.name?.value;
    let searchIndexedTerms = [
      {
        name: this.standardSearchTerm,
        locale: "en",
        localePreferred: false,
        conceptNameType: "INDEX_TERM",
      },
    ];
    names = [
      ...names,
      {
        name: conceptToCreate["name"]?.value,
        locale: "en",
        localePreferred: true,
        conceptNameType: "FULLY_SPECIFIED",
      },
      ...searchIndexedTerms,
    ];
    this.conceptToCreate = {
      names,
      descriptions: [
        {
          description: conceptToCreate?.description?.value,
          locale: "en",
        },
      ],
      datatype: this.dataType
        ? this.dataType
        : conceptToCreate?.datatype?.value,
      // Softcode concept class
      set: true,
      setMembers: conceptToCreate?.setMembers?.map((member) => member?.uuid),
      conceptClass: this.conceptClass,
      mappings: mappings,
    };
  }
}
