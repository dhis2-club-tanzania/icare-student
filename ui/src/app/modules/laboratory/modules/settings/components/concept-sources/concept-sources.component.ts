import { Component, OnInit } from "@angular/core";
import { MatRadioChange } from "@angular/material/radio";
import { Observable } from "rxjs";
import { ConceptSourcesService } from "src/app/core/services/concept-sources.service";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import {
  ConceptsourceCreate,
  ConceptsourceGet,
} from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-concept-sources",
  templateUrl: "./concept-sources.component.html",
  styleUrls: ["./concept-sources.component.scss"],
})
export class ConceptSourcesComponent implements OnInit {
  conceptSourceFields: any[] = [];
  formData: any = {};
  conceptSource: ConceptsourceCreate;
  saving: boolean = false;
  category: string = "List";
  conceptSources$: Observable<ConceptsourceGet[]>;
  constructor(private conceptSourceService: ConceptSourcesService) {}

  ngOnInit(): void {
    this.createConceptSourcesFields();
    this.conceptSources$ = this.conceptSourceService.getConceptSources();
  }

  createConceptSourcesFields(data?: any): void {
    this.conceptSourceFields = [
      new Textbox({
        id: "name",
        key: "name",
        label: "Name",
        required: true,
      }),
      new Textbox({
        id: "description",
        key: "description",
        label: "Description",
        required: true,
      }),
    ];
  }

  onFormUpdate(formValue: FormValue): void {
    const values = formValue.getValues();
    this.formData = { ...this.formData, ...values };
  }

  onSave(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    this.conceptSource = {
      name: this.formData["name"]?.value,
      description: this.formData["description"]?.value,
    };
    this.conceptSourceService
      .createConceptSource(this.conceptSource)
      .subscribe((response) => {
        if (response) {
          this.saving = false;
          setTimeout(() => {
            this.createConceptSourcesFields();
            this.category = "List";
            this.conceptSources$ =
              this.conceptSourceService.getConceptSources();
          }, 200);
        }
      });
  }

  getSelection(event: MatRadioChange): void {
    this.category = event?.value;
  }
}
