import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { loadCustomOpenMRSForms } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getCustomOpenMRSFormsByIds } from "src/app/store/selectors/form.selectors";
import { keyBy, uniqBy } from "lodash";
import { map } from "rxjs/operators";

@Component({
  selector: "app-shared-batch-fields-definitions-form",
  templateUrl: "./shared-batch-fields-definitions-form.component.html",
  styleUrls: ["./shared-batch-fields-definitions-form.component.scss"],
})
export class SharedBatchFieldsDefinitionsFormComponent implements OnInit {
  @Input() formUuids: string[];
  @Input() existingBatchFieldsInformations: any;
  @Input() fromMaintenance: boolean;
  @Input() clinicalFields: any[];
  @Input() personFields: any[];
  @Input() specimenTypeConceptUuid: string;

  @Output() fields: EventEmitter<any> = new EventEmitter<any>();
  allFields: any[] = [];
  forms$: Observable<any>;
  keyedSelectedFields: any = {};
  formData: any = {};
  @Output() selectedFieldsByCategory: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() selectedFieldsData: EventEmitter<any> = new EventEmitter<any>();
  // @ViewChild(SharedRenderBatchDefnFieldsComponent)
  // sharedRenderBatchDefnFieldsComponent!: SharedRenderBatchDefnFieldsComponent;
  showTestOrderSelection: boolean = true;
  selectedTestOrdersValues: any[] = [];
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.showTestOrderSelection = false;
    this.selectedTestOrdersValues =
      [
        ...(this.existingBatchFieldsInformations?.fixedFields?.filter(
          (fixedField: any) => fixedField?.id === "testorders"
        ) || []),
        ...(this.existingBatchFieldsInformations?.staticFields?.filter(
          (staticField: any) => staticField?.id === "testorders"
        ) || []),
        ...(this.existingBatchFieldsInformations?.dynamicFields?.filter(
          (dynamicField: any) => dynamicField?.id === "testorders"
        ) || []),
      ][0]?.value || [];
    if (this.selectedTestOrdersValues) {
      this.showTestOrderSelection = true;
    }
    // console.log("selectedTestOrdersValues", this.selectedTestOrdersValues);
    this.store.dispatch(
      loadCustomOpenMRSForms({
        formUuids: this.formUuids,
      })
    );

    this.forms$ = this.store
      .select(getCustomOpenMRSFormsByIds(this.formUuids))
      .pipe(
        map((response: any) => {
          return [
            {
              id: "person",
              uuid: "person",
              name: "Person details",
              display: "Person details",
              formFields: this.personFields,
            },
            {
              id: "diagnosis_and_istory",
              uuid: "diagnosis_and_istory",
              name: "Diagnosis & History",
              display: "Diagnosis & History",
              formFields: this.clinicalFields,
            },
            ...response,
          ];
        })
      );
  }

  onGetSelectedBatchFields(selectedFields: any, form: any, key: string): void {
    this.keyedSelectedFields[key + "-" + form?.uuid] = selectedFields;
    this.selectedFieldsByCategory.emit(this.keyedSelectedFields);
  }

  onGetAllFields(fields: any[]): void {
    this.allFields = uniqBy([...this.allFields, ...fields], "id");
    this.fields.emit(this.allFields);
  }

  onFormUpdate(formValue: FormValue, fieldsReferenceKey: string): void {
    // const unKeyedSavedDataValues = keyBy(
    //   [
    //     ...(this.existingBatchFieldsInformations?.fixedFields || []),
    //     ...(this.existingBatchFieldsInformations?.staticFields || []),
    //     ...(this.existingBatchFieldsInformations?.dynamicFields || []),
    //   ],
    //   "id"
    // );
    this.formData = { ...this.formData, ...formValue.getValues() };
    this.selectedFieldsData.emit(this.formData);
    if (
      this.specimenTypeConceptUuid &&
      this.formData[this.specimenTypeConceptUuid]?.value
    ) {
      this.showTestOrderSelection = false;
      setTimeout(() => {
        this.showTestOrderSelection = true;
      }, 20);
    }
  }

  onGetSelectedOrders(orders: any[], category): void {
    if (orders && orders?.length > 0) {
      this.keyedSelectedFields[category + "-testorders"] = [
        {
          id: "testorders",
          name: "Test orders",
          label: "Test orders",
          value: orders?.map((order: any) => order?.uuid),
          selectedItems: orders,
        },
      ];
      this.selectedTestOrdersValues = orders?.map((order: any) => order?.uuid);
      this.selectedFieldsByCategory.emit(this.keyedSelectedFields);
    }
  }
}
