import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { Observable, of } from "rxjs";
import { DATE_FORMATS_DD_MM_YYYY } from "src/app/core/constants/date-formats.constants";
import { Field } from "../../models/field.model";
import { FormService } from "../../services";

@Component({
  selector: "app-field",
  templateUrl: "./field.component.html",
  styleUrls: ["./field.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS_DD_MM_YYYY },
  ],
})
export class FieldComponent implements AfterViewInit {
  @Input() field: Field<string>;
  @Input() isReport: boolean;
  @Input() value: any;
  @Input() form: FormGroup;
  @Input() isCheckBoxButton: boolean;
  @Input() fieldClass: string;
  @Input() shouldDisable: boolean;
  members$: Observable<any[]> = of([]);

  constructor(private formService: FormService) {}

  @Output() fieldUpdate: EventEmitter<FormGroup> =
    new EventEmitter<FormGroup>();

  @Output() fileFieldUpdate: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit() {
    if (typeof this.field?.value === "object") {
      this.value = (this.field?.value as any[])?.map((val) => {
        return {
          ...val,
          value: val?.value ? val?.value : val?.uuid,
        };
      });
    }
    if (
      this.field?.searchTerm ||
      this.field?.source ||
      (this.field?.shouldHaveLiveSearchForDropDownFields && this.field?.value)
    ) {
      this.members$ = this.formService.searchItem(
        {
          q:
            this.field?.searchControlType !== "location"
              ? this.field?.searchTerm
              : "",
          limit: 50,
          tag: this.field?.searchTerm,
          class: this.field?.conceptClass,
          source: this.field?.source,
          value: this.field?.value,
          v:
            this.field?.searchControlType === "concept"
              ? "custom:(uuid,display,datatype,conceptClass,mappings)"
              : this.field?.searchControlType === "residenceLocation"
              ? "custom:(uuid,display,parentLocation:(uuid,display,parentLocation:(uuid,display,parentLocation:(uuid,display,parentLocation:(uuid,display)))))"
              : "custom:(uuid,display)",
        },
        this.field?.searchControlType,
        this.field?.filteringItems,
        this.field
      );
    } else if (this.field?.options?.length > 0) {
      this.members$ = of(this.field?.options);
    }
    this.fieldUpdate.emit(this.form);
  }

  get isValid(): boolean {
    return this.form?.controls[this.field.id]?.valid;
  }

  get issueWithTheDataField(): string {
    const message = this.form?.controls[this.field.id]?.valid
      ? null
      : !this.form?.controls[this.field.id]?.valid &&
        this.form.controls[this.field.id]?.errors?.minlength
      ? `${this.field?.label} has not reached required number of characters`
      : !this.form?.controls[this.field.id]?.valid &&
        this.form.controls[this.field.id]?.errors?.maxlength
      ? `${this.field?.label} has exceeded required number of characters`
      : !this.form?.controls[this.field.id]?.valid
      ? `${this.field?.label} is required`
      : "";
    return message;
  }

  get hasMinimunLengthIssue(): boolean {
    return this.form.controls[this.field.id]?.errors?.minlength;
  }

  get hasMaximumLengthIssue(): boolean {
    return this.form.controls[this.field.id]?.errors?.maxlength;
  }

  get isDateTime(): boolean {
    return this.field.controlType === "date-time";
  }

  get isDate(): boolean {
    return this.field.controlType === "date";
  }

  get isBoolean(): boolean {
    return this.field.controlType === "boolean";
  }

  get isCommonField(): boolean {
    return (
      this.field?.controlType !== "checkbox" &&
      !this.isDate &&
      !this.isBoolean &&
      !this.isCheckBoxButton
    );
  }

  get fieldId(): string {
    return this.field?.id;
  }

  onFieldUpdate(): void {
    this.fieldUpdate.emit(this.form);
  }

  fileChangeEvent(event, field): void {
    let objectToUpdate = {};
    objectToUpdate[field?.key] = event.target.files[0];
    this.fileFieldUpdate.emit(objectToUpdate);
  }

  updateFieldOnDemand(objectToUpdate): void {
    this.form.patchValue(objectToUpdate);
    this.form.setValue({ dob: new Date() });
    this.fieldUpdate.emit(this.form);
  }

  get getOptionValue(): any {
    const matchedOption = (this.field.options.filter(
      (option) => option?.key === this.value
    ) || [])[0];
    return matchedOption ? matchedOption?.value : "";
  }

  get getOptionValueLabel(): any {
    const matchedOption = (this.field.options.filter(
      (option) => option?.key === this.value
    ) || [])[0];
    return matchedOption ? matchedOption?.label : "";
  }

  searchItem(event: any, field?: any): void {
    // event.stopPropagation();
    const searchingText = event.target.value;
    const parameters = {
      q: searchingText,
      limit: 50,
      tag:
        this.field?.searchControlType === "location" ? field?.searchTerm : null,
      class: this.field?.conceptClass,
      source: this.field?.source,
      v:
        field?.searchControlType === "residenceLocation" ||
        field?.searchControlType === "healthFacility"
          ? "custom:(uuid,display,parentLocation:(uuid,display,parentLocation:(uuid,display,parentLocation:(uuid,display,parentLocation:(uuid,display)))))"
          : field?.searchControlType === "concept" ||
            field?.conceptClass === "Diagnosis"
          ? "custom:(uuid,display,datatype,conceptClass,mappings)"
          : "custom:(uuid,display)",
    };
    this.members$ = this.formService.searchItem(
      parameters,
      this.field?.searchControlType,
      this.field?.filteringItems,
      this.field
    );
  }

  searchItemFromOptions(event, field): void {
    const searchingText = event.target.value;
    this.members$ = of(
      field?.options?.filter(
        (option) =>
          option?.label?.toLowerCase()?.indexOf(searchingText?.toLowerCase()) >
          -1
      ) || []
    );
  }

  getSelectedItemFromOption(event: Event, item, field): void {
    event.stopPropagation();
    const value = item?.isDrug
      ? item?.formattedKey
      : item?.uuid
      ? item?.uuid
      : item?.id
      ? item?.id
      : item?.value;
    let objectToUpdate = {};
    objectToUpdate[field?.key] =
      field?.searchControlType === "drugStock"
        ? item
        : !field?.searchControlType ||
          field?.searchControlType !== "residenceLocation"
        ? value
        : item;
    this.form.patchValue(objectToUpdate);
    this.fieldUpdate.emit(this.form);
  }

  getStockStatus(option) {
    const optionName = option?.display ? option?.display : option?.name;
    return optionName.includes("Available, Location") ? true : false;
  }

  displayLabelFunc(value?: any): string {
    return value
      ? this.field?.options?.find(
          (option) => option?.value === (value?.value ? value?.value : value)
        )?.label
      : undefined;
  }
}
