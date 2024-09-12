import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Observable } from "rxjs";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptGet } from "src/app/shared/resources/openmrs";
import { SampleAllocationObject } from "src/app/shared/resources/sample-allocations/models/allocation.model";

import { orderBy } from "lodash";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { upsertEnteredDataValues } from "src/app/store/actions";
import { getDataValuesEntities } from "src/app/store/selectors";
import { ResultEntryFormComponent } from "../result-entry-form/result-entry-form.component";

@Component({
  selector: "app-test-parameter-entry",
  templateUrl: "./test-parameter-entry.component.html",
  styleUrls: ["./test-parameter-entry.component.scss"],
})
export class TestParameterEntryComponent implements OnInit {
  @Input() parameterUuid: string;
  @Input() multipleResultsAttributeType: string;
  @Input() allocation: SampleAllocationObject;
  @Input() disabled: boolean;
  @Input() isLIS: boolean;
  @Input() conceptNameType: string;
  @Input() finalResult: any;
  @Input() parametersRelationshipConceptSourceUuid: string;
  @Input() relatedResult: any;
  @Input() calculatedValueExpressionAttributeType: any;
  testParameter$: Observable<ConceptGet>;
  @Output() data: EventEmitter<any> = new EventEmitter<any>();
  @Output() attributes: EventEmitter<any> = new EventEmitter<any>();
  latestResult: any;
  errors: any[] = [];
  multipleResultsAttributeType$: Observable<string>;

  @ViewChild(ResultEntryFormComponent)
  resultEntryFormComponent!: ResultEntryFormComponent;
  constructor(
    private conceptService: ConceptsService,
    private systemSettingsService: SystemSettingsService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.testParameter$ = this.conceptService.getConceptDetailsByUuid(
      this.parameterUuid,
      "custom:(uuid,display,datatype,names,answers:(uuid,display,names),attributes:(uuid,display,voided,value,attributeType:(uuid,display)))"
    );
    this.multipleResultsAttributeType$ = this.systemSettingsService
      .getSystemSettingsByKey(
        `iCare.laboratory.settings.testParameters.attributes.multipleResultsAttributeTypeUuid`
      )
      .pipe(
        map((response) => {
          if (response && !response?.error) {
            return response;
          } else {
            this.errors = [...this.errors, response];
            return response;
          }
        })
      );
    if (this.finalResult && !this.finalResult?.groups) {
      this.latestResult = {
        ...this.finalResult,
        value: this.finalResult?.valueNumeric
          ? this.finalResult?.valueNumeric
          : this.finalResult?.valueBoolean
          ? this.finalResult?.valueBoolean
          : this.finalResult?.valueComplex
          ? this.finalResult?.valueComplex
          : this.finalResult?.valueCoded
          ? this.finalResult?.valueCoded?.uuid
          : this.latestResult?.valueText
          ? this.latestResult?.valueText
          : this.latestResult?.valueModifier
          ? this.latestResult?.valueModifier
          : null,
      };
    } else {
      // console.log("relatedResult", this.relatedResult?.uuid);
      // console.log("final res", this.finalResult?.groups);
      this.latestResult = {
        ...(!this.relatedResult
          ? this.finalResult?.groups[this.finalResult?.groups?.length - 1]
              ?.results[0]
          : orderBy(
              (this.finalResult?.groups?.filter(
                (group) => group?.key === this.relatedResult?.uuid
              ) || [])[0]?.results,
              ["dateCreated"],
              ["desc"]
            )[0]),
        isArray: true,
        value: (!this.relatedResult
          ? this.finalResult?.groups[this.finalResult?.groups?.length - 1]
              ?.results
          : [
              orderBy(
                (this.finalResult?.groups?.filter(
                  (group) => group?.key === this.relatedResult?.uuid
                ) || [])[0]?.results,
                ["dateCreated"],
                ["desc"]
              )[0],
            ]
        )?.map((result) => {
          return result?.valueNumeric
            ? result?.valueNumeric
            : result?.valueBoolean
            ? result?.valueBoolean
            : result?.valueComplex
            ? result?.valueComplex
            : result?.valueCoded
            ? result.valueCoded?.uuid
            : result?.valueText
            ? result?.valueText
            : result?.valueModifier
            ? result?.valueModifier
            : null;
        }),
      };
    }

    if (this.finalResult && this.finalResult?.value) {
      this.store.dispatch(
        upsertEnteredDataValues({
          dataValues: [
            {
              id: this.parameterUuid,
              value: this.finalResult?.value,
            },
          ],
        })
      );
    }
  }

  onGetFormData(data: any, parameter: any): void {
    const resultPayload: any = {
      value: data,
      previousValue: this.latestResult?.value
        ? this.latestResult?.value
        : this.latestResult?.valueText,
      multipleResults: data[0]?.value ? true : false,
      parameter: {
        ...parameter,
        isNumeric: parameter?.datatype?.name === "Numeric",
        isCoded: parameter?.datatype?.name === "Coded",
        isText: parameter?.datatype?.name === "Text",
        isFile: parameter?.datatype?.name == "Complex",
      },
    };

    this.store.dispatch(
      upsertEnteredDataValues({
        dataValues: [
          {
            id: this.parameterUuid,
            value: data,
          },
        ],
      })
    );
    this.data.emit(resultPayload);
  }

  onGetAttributes(data: any) {
    this.attributes.emit(data);
  }

  setFieldValue(fieldValueDetails: any): void {
    this.store.dispatch(
      upsertEnteredDataValues({
        dataValues: fieldValueDetails,
      })
    );
    const parameterValue = (fieldValueDetails?.filter(
      (dataValue: any) => dataValue?.id === this.parameterUuid
    ) || [])[0]?.value;
    if (parameterValue)
      this.resultEntryFormComponent.createFormFields(parameterValue);
  }
}
