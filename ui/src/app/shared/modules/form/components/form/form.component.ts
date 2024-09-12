import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  ViewChild,
  SimpleChanges,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Field } from "../../models/field.model";
import { FieldControlService } from "../../services";
import { FieldsData } from "../../models/fields-data.model";
import { FormValue } from "../../models/form-value.model";
import { FieldComponent } from "../field/field.component";
import { validateFormFields } from "../../helpers/validate-form-fields.helper";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { Observable } from "rxjs";
import { calculateFieldValueFromCalculationExpression } from "../../../../../core/helpers/autocalculation.helper";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormComponent implements OnInit {
  @Input() fields: Field<string>[];
  @Input() dataType: any;
  @Input() isFormHorizontal: boolean;
  @Input() showSaveButton: boolean;
  @Input() fieldsData: FieldsData;
  @Input() fieldClass: string;
  @Input() shouldRenderAsCheckBoxesButton: boolean;
  @Input() shouldDisable: boolean;
  @Input() isReport: boolean;
  @Input() colClass: string;
  @Input() dependedFields: string[];

  @Output() formUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() enterKeyPressedFields: EventEmitter<any> = new EventEmitter<any>();
  @Output() fileFormUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Input() formId: string;
  @Input() formValidationRules: any[];

  values: any;

  form: FormGroup;
  payload = "";
  fieldsResponsedToEnterKey: any = {};

  @ViewChild(FieldComponent, { static: false })
  fieldComponent: FieldComponent;
  validationIssues: any = {};
  dataValueEntities$: Observable<any>;

  constructor(
    private fieldControlService: FieldControlService,
    private store: Store<AppState>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.shouldDisable = this.isReport ? true : this.shouldDisable;
    this.values = this.form?.getRawValue();
    if (this.values) {
      this.validationIssues = validateFormFields(
        this.formValidationRules,
        this.values
      );
    }

    this.form = this.fieldControlService.toFormGroup(
      this.fields,
      this.fieldsData
    );

    // console.log("formValidationRules", this.formValidationRules);
  }

  ngOnInit(): void {
    // console.log("FIELDS data", this.fieldsData);
    this.form = this.fieldControlService.toFormGroup(
      this.fields,
      this.fieldsData
    );
  }

  onSubmit(): void {
    // this.formUpdate.emit(this.form.getRawValue());
  }

  onFieldUpdate(form: FormGroup): void {
    if (!this.showSaveButton && form) {
      this.values = this.form?.getRawValue();

      if (this.values) {
        this.validationIssues = validateFormFields(
          this.formValidationRules,
          this.values
        );
      }
      this.formUpdate.emit(
        new FormValue(this.form, this.fields, null, this.formId)
      );
    }
  }

  onGetFieldsResponsedToEnterKey(fieldKey: string): void {
    this.fieldsResponsedToEnterKey[fieldKey] = fieldKey;
    this.enterKeyPressedFields.emit(this.fieldsResponsedToEnterKey);
  }

  onFileFieldUpdate(fileData: File): void {
    this.formUpdate.emit(
      new FormValue(this.form, this.fields, fileData, this.formId)
    );
    this.values = fileData;
  }

  onClear(): void {
    this.form.reset();
  }

  isFormInValid() {
    return this.form?.invalid;
  }

  patchFormValueValue(objectToUpdate: any): void {
    this.fieldComponent.updateFieldOnDemand(objectToUpdate);
  }
}
