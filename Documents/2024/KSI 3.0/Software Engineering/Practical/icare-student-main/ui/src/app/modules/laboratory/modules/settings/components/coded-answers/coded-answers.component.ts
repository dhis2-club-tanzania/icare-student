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
    private conceptSourceService: ConceptSourcesService
  ) {}

  ngOnInit(): void {
    this.createCodedAnswersFields();
    this.codedAnswers$ = this.conceptService.searchConcept({
      q: "LIS_CODED_ANSWERS",
      limit: this.pageSize,
      conceptClass: "Coded answer",
      startIndex: (this.page - 1) * this.pageSize,
      searchTerm: "LIS_CODED_ANSWERS",
    });
    this.conceptSources$ = this.conceptSourceService.getConceptSources();
  }

  getList(event: Event, actionType: string): void {
    this.page = actionType == "next" ? this.page + 1 : this.page - 1;
    this.codedAnswers$ = this.conceptService.searchConcept({
      q: "LIS_CODED_ANSWERS",
      limit: this.pageSize,
      conceptClass: "Coded answer",
      startIndex: (this.page - 1) * this.pageSize,
      searchTerm: "LIS_CODED_ANSWERS",
    });
  }

  createCodedAnswersFields(data?: any): void {
    const shortName =
      data && data?.names
        ? (data?.names.filter((name) => name?.conceptNameType === "SHORT") ||
            [])[0]?.name
        : null;
    this.codedAnswersFields = [
      new Textbox({
        id: "name",
        key: "name",
        label: "Name",
        value: data && data?.display ? data?.display : null,
        required: true,
      }),
      new Textbox({
        id: "shortName",
        key: "shortName",
        label: "Short name",
        value: shortName,
        required: true,
      }),
      new Textbox({
        id: "description",
        key: "description",
        label: "Description",
      }),
    ];
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
      .subscribe((response) => {
        if (response?.length > 0 && !this.conceptBeingEdited) {
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
          this.createCodedAnswersFields(response);
        }
      });
  }

  onDelete(event: Event, concept: any): void {
    this.conceptService.deleteConcept(concept?.uuid).subscribe((response) => {
      if (response) {
        this.page = 1;
        this.codedAnswers$ = this.conceptService.searchConcept({
          limit: this.pageSize,
          conceptClass: "Coded answer",
          startIndex: (this.page - 1) * this.pageSize,
          searchTerm: "LIS_CODED_ANSWERS",
        });
      }
    });
  }

  searchConcept(event: KeyboardEvent): void {
    this.page = 1;
    const searchingText = (event.target as HTMLInputElement).value;
    this.codedAnswers$ = this.conceptService.searchConcept({
      q: searchingText,
      conceptClass: "Coded answer",
      limit: this.pageSize,
      startIndex: (this.page - 1) * this.pageSize,
      searchTerm: "LIS_CODED_ANSWERS",
    });
  }
}
