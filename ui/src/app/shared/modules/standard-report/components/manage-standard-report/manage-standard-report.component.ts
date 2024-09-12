import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { Textbox } from "../../../form/models/text-box.model";
import { TextArea } from "../../../form/models/text-area.model";
import { FormValue } from "../../../form/models/form-value.model";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: "lib-manage-standard-report",
  templateUrl: "./manage-standard-report.component.html",
  styleUrls: ["./manage-standard-report.component.scss"],
})
export class ManageStandardReportComponent implements OnInit {
  htmlContentSafe: SafeHtml = "";
  htmlContent: string = "";
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    sanitize: false,
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [["bold"]],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
  };
  @Input() report: any;
  @Input() additionalKey: string;
  reportFields: any[];
  saving: boolean = false;
  errors: any[] = [];
  formData: any = {};
  thereIsAssociatedDataSetQueries: boolean = false;
  selectedQueries: any = [];
  isFormValid: boolean = false;
  useDefaultPeFilter: boolean = true;
  @Output() reloadList: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private domSanitizer: DomSanitizer,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.errors = [];
    this.htmlContent = this.report?.value ? this.report?.value?.htmlCode : null;
    this.createReportFields(this.report);
    this.thereIsAssociatedDataSetQueries =
      this.report?.value?.queries && this.report?.value?.queries?.length > 0;
    this.selectedQueries = this.report?.value?.queries || [];
    this.useDefaultPeFilter = this.report?.value
      ? this.report?.value?.useDefaultPeFilter
      : this.useDefaultPeFilter;
  }

  createReportFields(data?: any): void {
    this.reportFields = [
      new Textbox({
        id: "name",
        key: "name",
        label: "Name",
        value: data?.value ? data?.value?.name : data?.name,
        required: true,
      }),
      new TextArea({
        id: "description",
        key: "description",
        label: "Description",
        value: data?.value ? data?.value?.description : data?.description,
        required: true,
      }),
    ];
  }

  onSave(event: Event, htmlContent: string): void {
    event.stopPropagation();
    this.saving = true;
    const value = {
      name: this.formData?.name?.value,
      id: this.report?.value
        ? this.report?.value?.id
        : this.formData?.name?.value?.replace(/\s/g, ""),
      description: this.formData?.description?.value,
      category: "standard",
      htmlCode: htmlContent,
      useDefaultPeFilter: this.useDefaultPeFilter,
      renderAs: this.thereIsAssociatedDataSetQueries
        ? "datasets-based"
        : "iframe",
      queries:
        this.selectedQueries.map((query: any) => {
          return {
            ...query,
            name: query?.display,
          };
        }) || [],
    };
    const data = {
      value: JSON.stringify(value),
      property: this.report?.property
        ? this.report?.property
        : `iCare.reports.standardReports.${
            this.additionalKey ? this.additionalKey + "." : ""
          }` + this.formData?.name?.value?.replace(/\s/g, ""),
      description: this.formData?.description?.value,
      uuid: this.report && this.report?.uuid ? this.report?.uuid : null,
    };
    this.systemSettingsService
      .updateSystemSettings(data)
      .subscribe((response) => {
        if (response && !response?.error) {
          this.saving = false;
          this.report = {
            ...response,
            value: JSON.parse(response?.value),
          };
          // this.createReportFields(this.report);
          this.reloadList.emit(true);
        } else {
          this.errors = [...this.errors, response];
          this.saving = false;
        }
      });
  }

  onFormUpdate(formValue: FormValue): void {
    this.formData = formValue.getValues();
    this.isFormValid = formValue.isValid;
  }

  getIFThereisQueriesAssociated(event: MatCheckboxChange): void {
    this.thereIsAssociatedDataSetQueries = event?.checked;
  }

  getSelected(selectedQueries: any[]): void {
    this.selectedQueries = selectedQueries;
  }

  onGetHasDefaultPeriodFilter(event: MatCheckboxChange): void {
    this.useDefaultPeFilter = event?.checked;
  }
}
