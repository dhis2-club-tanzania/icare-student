import { Component, OnInit } from "@angular/core";
import { MatRadioChange } from "@angular/material/radio";
import { Observable } from "rxjs";
import { ConceptSourcesService } from "src/app/core/services/concept-sources.service";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import {
  ConceptCreate,
  ConceptGetFull,
} from "src/app/shared/resources/openmrs";
import { omit } from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { SharedConfirmationDialogComponent } from "src/app/shared/components/shared-confirmation-dialog/shared-confirmation-dialog.component";

@Component({
  selector: "app-coded-answers",
  templateUrl: "./coded-answers.component.html",
  styleUrls: ["./coded-answers.component.scss"],
})
export class CodedAnswersComponent implements OnInit {
  codedAnswersFields: any[] = [];
  saving: boolean = false;
  formData: any = {};
  answer: any;
  category: string = "List";
  codedAnswers$: Observable<ConceptGetFull[]>;
  pageSize: number = 10;
  page: number = 1;
  pageCounts: any[] = [10, 20, 25, 50, 100, 200];
  searchingText: string;
  isFormValid: boolean = false;
  hasError: boolean = false;
  error: string;

  conceptBeingEdited: ConceptGetFull;

  alertMessage: string;
  standardSearchTerm: string = "LIS_CODED_ANSWERS";
  conceptClass: string = "Coded answer";
  conceptSources$: Observable<any[]>;
  conceptToEdit$: Observable<any>;

  constructor(
    private conceptService: ConceptsService,
    private conceptSourceService: ConceptSourcesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.codedAnswers$ = this.conceptService.searchConcept({
      q: "LIS_CODED_ANSWERS",
      pageSize: this.pageSize,
      conceptClass: "Coded answer",
      page: this.page,
      searchTerm: "LIS_CODED_ANSWERS",
    });
    this.conceptSources$ = this.conceptSourceService.getConceptSources();
  }

  getList(event: any, actionType?: string): void {
    this.page = event.pageIndex + 1;
    this.pageSize = Number(event?.pageSize);
    this.codedAnswers$ = this.conceptService.searchConcept({
      q: "LIS_CODED_ANSWERS",
      pageSize: this.pageSize,
      page: this.page,
      conceptClass: "Coded answer",
      searchTerm: "LIS_CODED_ANSWERS",
    });
  }

  onFormUpdate(formValue: FormValue): void {
    const values = formValue.getValues();
    this.isFormValid = formValue.isValid;
    this.formData = { ...this.formData, ...values };
  }

  onGetConceptToCreate(conceptDetails: any): void {
    this.formData = conceptDetails;
  }

  onSave(event: Event): void {
    event.stopPropagation();
    const searchTerms = [
      {
        name: "LIS_CODED_ANSWERS",
        locale: "en",
        localePreferred: false,
        conceptNameType: "INDEX_TERM",
      },
    ];
    let names = [];
    this.saving = true;
    names = [
      ...names,
      {
        name: this.formData["name"]?.value,
        locale: "en",
        localePreferred: true,
        conceptNameType: "FULLY_SPECIFIED",
      },
    ];
    const conceptName = this.formData["name"]?.value;
    names = [
      ...names,
      {
        name: this.formData["shortName"]?.value,
        locale: "en",
        localePreferred: false,
        conceptNameType: "SHORT",
      },
    ];
    this.answer = {
      names: names,
      descriptions: [
        {
          description: this.formData["description"]?.value,
          locale: "en",
        },
      ],
      datatype: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
      conceptClass: "Coded answer",
    };
    this.conceptService
      .searchConcept({ q: conceptName, conceptClass: "Coded answer" })
      .subscribe((response: any) => {
        if (response?.results?.length > 0 && !this.conceptBeingEdited) {
          this.saving = false;
          this.alertMessage = "Answer with name " + conceptName + " exists";
          setTimeout(() => {
            this.alertMessage = null;
          }, 2000);
        } else {
          (!this.conceptBeingEdited
            ? this.conceptService.createConcept(this.answer)
            : this.conceptService.updateConcept(
                this.conceptBeingEdited?.uuid,
                this.answer
              )
          ).subscribe((response: any) => {
            if (response && !response?.error) {
              this.conceptService
                .createConceptNames(response?.uuid, searchTerms)
                .subscribe((conceptNameResponse) => {
                  if (conceptNameResponse) {
                    this.category = "List";
                    this.page = 1;
                    this.codedAnswers$ = this.conceptService.searchConcept({
                      limit: this.pageSize,
                      conceptClass: "Coded answer",
                      startIndex: (this.page - 1) * this.pageSize,
                      searchTerm: "LIS_CODED_ANSWERS",
                    });
                    this.saving = false;
                  }
                });
            } else {
              this.saving = false;
              this.hasError = true;
              this.error =
                response?.error?.message +
                " Please contact system administrator";
            }
          });
        }
      });
  }

  getSelection(event: MatRadioChange): void {
    this.category = event?.value;
  }

  onEdit(event: Event, codedAnswer: any): void {
    this.conceptService
      .getConceptDetailsByUuid(
        codedAnswer?.uuid,
        "custom:(uuid,display,names,descriptions)"
      )
      .subscribe((response) => {
        if (response) {
          this.conceptBeingEdited = response;
          this.category = "New";
        }
      });
  }

  onDelete(event: Event, concept: any): void {
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        minWidth: "20%",
        data: {
          header: `Are you sure to delete concept <b>${concept?.display}</b>`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          this.conceptService
            .deleteConcept(concept?.uuid)
            .subscribe((response) => {
              if (response) {
                this.page = 1;
                this.codedAnswers$ = this.conceptService.searchConcept({
                  pageSize: this.pageSize,
                  conceptClass: "Coded answer",
                  page: this.page,
                  searchTerm: "LIS_CODED_ANSWERS",
                });
              }
            });
        }
      });
  }

  onPermanentDelete(event: Event, concept: any): void {
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        minWidth: "20%",
        data: {
          header: `Are you sure to delete concept <b>${concept?.display}</b> permanently?`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          this.conceptService
            .deleteConcept(concept?.uuid, true)
            .subscribe((response) => {
              if (response) {
                this.page = 1;
                this.codedAnswers$ = this.conceptService.searchConcept({
                  pageSize: this.pageSize,
                  conceptClass: "Coded answer",
                  page: this.page,
                  searchTerm: "LIS_CODED_ANSWERS",
                });
              }
            });
        }
      });
  }

  onEnable(event: Event, concept: any): void {
    this.dialog
      .open(SharedConfirmationDialogComponent, {
        minWidth: "20%",
        data: {
          header: `Are you sure you want to enable concept <b>${concept?.display}</b>?`,
        },
      })
      .afterClosed()
      .subscribe((shouldConfirm) => {
        if (shouldConfirm) {
          this.conceptService
            .unRetireConcept(concept?.uuid)
            .subscribe((response) => {
              if (response) {
                this.page = 1;
                this.codedAnswers$ = this.conceptService.searchConcept({
                  pageSize: this.pageSize,
                  conceptClass: "Coded answer",
                  page: this.page,
                  searchTerm: "LIS_CODED_ANSWERS",
                });
              }
            });
        }
      });
  }

  searchConcept(event: KeyboardEvent): void {
    this.page = 1;
    this.searchingText = (event.target as HTMLInputElement).value;
    this.codedAnswers$ = this.conceptService.searchConcept({
      q: this.searchingText,
      conceptClass: "Coded answer",
      pageSize: this.pageSize,
      page: this.page,
      searchTerm: "LIS_CODED_ANSWERS",
    });
  }
}
