import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { WorkSheetsService } from "src/app/modules/laboratory/resources/services/worksheets.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-worksheet-controls",
  templateUrl: "./worksheet-controls.component.html",
  styleUrls: ["./worksheet-controls.component.scss"],
})
export class WorksheetControlsComponent implements OnInit {
  worksheetControlsFields: any[];
  isFormValid: boolean = false;
  worksheetControls$: Observable<any[]>;
  worksheetControlPayload: any;
  saving: boolean = false;
  errors: any[] = [];
  constructor(private worksheetsService: WorkSheetsService) {}

  ngOnInit(): void {
    this.createWorksheetControlsFields();
    this.getWorksheetControls();
  }

  getWorksheetControls(): void {
    this.worksheetControls$ = this.worksheetsService.getWorksheetControls();
  }

  createWorksheetControlsFields(): void {
    this.worksheetControlsFields = [
      new Textbox({
        id: "name",
        key: "name",
        label: "Name",
        required: true,
      }),
      new Textbox({
        id: "code",
        key: "code",
        label: "Code",
        required: true,
      }),
      new TextArea({
        id: "description",
        key: "description",
        label: "Description",
        required: false,
      }),
      new Dropdown({
        id: "testorder",
        key: "testorder",
        label: "Test Order",
        required: true,
        options: [],
        conceptClass: "Test",
        searchControlType: "concept",
        searchTerm: "TEST_ORDERS",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
    ];
  }

  onFormUpdate(formValue: FormValue): void {
    const values = formValue.getValues();
    this.isFormValid = formValue.isValid;
    this.worksheetControlPayload = {
      name: values?.name?.value,
      code: values?.code?.value,
      description: values?.description?.value,
      testorder: {
        uuid: values?.testorder?.value,
      },
    };
  }

  onSave(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    this.errors = [];
    this.worksheetsService
      .createWorksheetControls([this.worksheetControlPayload])
      .subscribe((response) => {
        if (response && !response?.error) {
          this.saving = false;
        } else {
          this.saving = false;
          this.errors = [...this.errors, response];
        }
      });
  }
}
