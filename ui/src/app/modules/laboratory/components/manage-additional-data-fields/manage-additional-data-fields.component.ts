import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { AdditionalFieldsService } from "../../resources/services/additional-fields.service";

@Component({
  selector: "app-manage-additional-data-fields",
  templateUrl: "./manage-additional-data-fields.component.html",
  styleUrls: ["./manage-additional-data-fields.component.scss"],
})
export class ManageAdditionalDataFieldsComponent implements OnInit {
  additionalFieldFormFields: any[];
  isFormValid: boolean = false;
  formData: any = {};
  saving: boolean = false;
  additionalFields$: Observable<any>;
  constructor(private additionalFieldsService: AdditionalFieldsService) {}

  ngOnInit(): void {
    this.getAdditionalFields();
    this.createFields();
  }

  getAdditionalFields(): void {
    this.additionalFields$ = this.additionalFieldsService.getAdditionalFields();
  }

  createFields(): void {
    this.additionalFieldFormFields = [
      new Textbox({
        id: "field",
        key: "field",
        label: "Field",
        required: true,
      }),
      new TextArea({
        id: "description",
        key: "description",
        label: "Description",
        required: false,
      }),
      new Dropdown({
        id: "type",
        key: "type",
        label: "Data type",
        required: true,
        options: [
          {
            key: "text",
            value: "TEXT",
            label: "TEXT",
          },
          {
            key: "number",
            value: "NUMBER",
            label: "NUMBER",
          },
          {
            key: "LONG_TEXT",
            value: "LONG_TEXT",
            label: "LONG_TEXT",
          },
          {
            key: "USER",
            value: "USER",
            label: "USER",
          },
          {
            key: "LOCATION",
            value: "LOCATION",
            label: "LOCATION",
          },
        ],
      }),
    ];
  }

  onGetFormData(formValue: FormValue): void {
    this.isFormValid = formValue.isValid;
    this.formData = formValue.getValues();
  }

  onSave(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    this.additionalFieldsService
      .createAdditionalFields([
        {
          name: this.formData?.field?.value,
          description: this.formData?.description?.value,
          field_type: this.formData?.type?.value,
        },
      ])
      .subscribe((response) => {
        if (response && !response?.error) {
          this.saving = false;
          this.createFields();
        } else {
          this.saving = false;
        }
      });
  }
}
