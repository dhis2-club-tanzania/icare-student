import { Component, OnInit } from "@angular/core";
import { MatRadioChange } from "@angular/material/radio";
import { Observable } from "rxjs";
import { ConceptSourcesService } from "src/app/core/services/concept-sources.service";
import { ReferenceTermsService } from "src/app/core/services/reference-terms.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import {
  ConceptreferencetermCreate,
  ConceptreferencetermGet,
  ConceptsourceGet,
} from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-concept-reference-terms",
  templateUrl: "./concept-reference-terms.component.html",
  styleUrls: ["./concept-reference-terms.component.scss"],
})
export class ConceptReferenceTermsComponent implements OnInit {
  conceptSources$: Observable<ConceptsourceGet[]>;
  conceptRerenceTerms$: Observable<ConceptreferencetermGet[]>;
  conceptReferenceFields: any[] = [];
  formData: any = {};
  saving: boolean = false;
  referenceTerm: ConceptreferencetermCreate;
  category: string = "List";
  pageSize: number = 10;
  page: number = 1;
  constructor(
    private conceptSourceService: ConceptSourcesService,
    private referenceTermService: ReferenceTermsService
  ) {}

  ngOnInit(): void {
    this.conceptSources$ = this.conceptSourceService.getConceptSources();
    this.getReferenceTermsList();
    this.createConceptReferenceFields();
  }

  getReferenceTermsList(): void {
    this.conceptRerenceTerms$ = this.referenceTermService.getReferenceTerms({
      page: this.page,
      pageSize: this.pageSize,
      searchingText: null,
    });
  }

  searchReferenceTerm(event: KeyboardEvent): void {
    this.page = 1;
    const searchingText = (event.target as HTMLInputElement).value;
    this.conceptRerenceTerms$ = this.referenceTermService.getReferenceTerms({
      page: this.page,
      pageSize: this.pageSize,
      searchingText,
    });
  }

  getReferenceTerms(event: Event, action: string): void {
    event.stopPropagation();
    this.page = action === "prev" ? this.page - 1 : this.page + 1;
    this.conceptRerenceTerms$ = this.referenceTermService.getReferenceTerms({
      page: this.page,
      pageSize: this.pageSize,
      searchingText: null,
    });
  }

  createConceptReferenceFields(data?: any): void {
    this.conceptSources$.subscribe((response) => {
      if (response) {
        this.conceptReferenceFields = [
          new Textbox({
            id: "code",
            key: "code",
            label: "Code",
            type: "text",
            required: true,
          }),
          new Textbox({
            id: "name",
            key: "name",
            label: "Name",
            type: "text",
          }),
          new Dropdown({
            id: "conceptSource",
            key: "conceptSource",
            label: "Coding source",
            options: response.map((source) => {
              return {
                key: source?.uuid,
                label: source?.display,
                value: source?.uuid,
                name: source?.display,
              };
            }),
            required: true,
          }),
          new TextArea({
            id: "description",
            key: "description",
            label: "Description",
            type: "text",
          }),
        ];
      }
    });
  }

  onFormUpdate(formValue: FormValue): void {
    const values = formValue.getValues();
    this.formData = { ...this.formData, ...values };
  }

  onSave(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    this.referenceTerm = {
      code: this.formData["code"]?.value,
      name: this.formData["name"]?.value,
      conceptSource: this.formData["conceptSource"]?.value,
      description: this.formData["description"]?.value,
    };
    this.referenceTermService
      .createReferenceTerm(this.referenceTerm)
      .subscribe((response) => {
        if (response) {
          this.saving = false;
          setTimeout(() => {
            this.category = "List";
            this.createConceptReferenceFields();
          }, 200);
        }
      });
  }

  getSelection(event: MatRadioChange): void {
    this.category = event?.value;
    if (this.category === "List") {
      this.getReferenceTermsList();
    }
  }
}
