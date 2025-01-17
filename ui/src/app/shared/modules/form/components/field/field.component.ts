import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
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
  @Input() form: UntypedFormGroup;
  @Input() isCheckBoxButton: boolean;
  @Input() fieldClass: string;
  @Input() shouldDisable: boolean;
  members$: Observable<any[]> = of([]);

  constructor(private formService: FormService) {}

  @Output() fieldUpdate: EventEmitter<UntypedFormGroup> =
    new EventEmitter<UntypedFormGroup>();
  @Output() enterKeyPressedFields: EventEmitter<any> = new EventEmitter<any>();

  @Output() fileFieldUpdate: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit() {
    if (typeof this.field?.value === "object") {
      this.value =
        this.field?.value && (this.field?.value as any)?.length > 0
          ? (this.field?.value as any[])?.map((val) => {
              return {
                ...val,
                value: val?.value ? val?.value : val?.uuid,
              };
            })
          : null;
    }
    if (
      this.field?.searchTerm ||
      this.field?.source ||
      (this.field?.shouldHaveLiveSearchForDropDownFields &&
        this.field?.value) ||
      this.field?.conceptUuid
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

  // get issueWithTheDataField(): string {
  //   const message = this.form?.controls[this.field.id]?.valid
  //     ? null
  //     : !this.form?.controls[this.field.id]?.valid &&
  //       this.form.controls[this.field.id]?.errors?.minlength
  //     ? `${this.field?.label} has not reached required number of characters`
  //     : !this.form?.controls[this.field.id]?.valid &&
  //       this.form.controls[this.field.id]?.errors?.maxlength
  //     ? `${this.field?.label} has exceeded required number of characters`
  //     : !this.form?.controls[this.field.id]?.valid
  //     ? `${this.field?.label} is required`
  //     : "";
  //   return message;
  // }

  get issueWithTheDataField(): string {
    const fieldValue = this.form?.controls[this.field.id]?.value;
    // Check if the field is required
    const isRequired =
      this.field.required && (fieldValue === null || fieldValue === "");
    // Check for custom error messages based on field validity and errors
    const message =
      !this.form?.controls[this.field.id]?.valid && isRequired
        ? `${this.field?.label} is required`
        : !this.form?.controls[this.field.id]?.valid &&
          this.form.controls[this.field.id]?.errors?.minlength
        ? `${this.field?.label} has not reached the required length`
        : !this.form?.controls[this.field.id]?.valid &&
          this.form.controls[this.field.id]?.errors?.maxlength
        ? `${this.field?.label} has exceeded the required length`
        : this.form.get(this.field?.key)?.errors?.pattern
        ? `${this.field?.label} is invalid`
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
  onFieldUpdate(event?: KeyboardEvent): void {
    this.fieldUpdate.emit(this.form);
  }

  onListenKeyEvent(event: KeyboardEvent, fieldtype: any): void {
    console.log("test in ----",fieldtype);
    if (fieldtype === "number") {

      if (
        event.key === "Backspace" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "Delete"
      ) {
        return;
      }

      if (
        event.key.match(/[a-zA-Z]/) ||
        (event.key.match(/[^0-9]/) && event.key !== ".")
      ) {
        event.preventDefault();
      }

      if (event && event.code === "Enter") {
        this.enterKeyPressedFields.emit(this.field?.key);
      }
    } else {
      if (event && event.code === "Enter") {
        this.enterKeyPressedFields.emit(this.field?.key);
      }
    }
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
    const searchingText = (event.target as HTMLInputElement).value;
    if (!searchingText) {
      let objectToUpdate = {};
      objectToUpdate[field?.key] = null;
      this.form.patchValue(objectToUpdate);
      this.fieldUpdate.emit(this.form);
    }
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

  onClearValue(event: any, field: any): void {
    event.stopPropagation();
    let objectToUpdate: any = {};
    objectToUpdate[field?.key] = null;
    this.form.patchValue(objectToUpdate);
    this.fieldUpdate.emit(this.form);
  }

  searchItemFromOptions(event: any, field: any): void {
    const searchingText = event.target.value;
    this.members$ = of(
      field?.options?.filter(
        (option) =>
          option?.label?.toLowerCase()?.indexOf(searchingText?.toLowerCase()) >
          -1
      ) || []
    );
    let objectToUpdate: any = {};
    if (!searchingText || searchingText?.length === 0) {
      objectToUpdate[field?.key] = null;
      this.form.patchValue(objectToUpdate);
      this.fieldUpdate.emit(this.form);
    }
  }

  getSelectedItemFromOption(event: Event, item: any, field: any): void {
    event.stopPropagation();
    const value =
      field?.searchControlType == "person"
        ? item?.display
        : item?.isDrug
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

  getStockStatus(option: any): any {
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
// onListenKeyEvent(event?: KeyboardEvent): void {
//   if (event && event.code === "Enter") {
//     this.enterKeyPressedFields.emit(this.field?.key);
//   } else {
//     // You can add any additional handling here if needed
//   }
// }
