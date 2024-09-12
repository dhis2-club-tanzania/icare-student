import { Component, Input, OnInit } from "@angular/core";
import { MatRadioChange } from "@angular/material/radio";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { CurrentUser } from "src/app/shared/models/current-user.models";
import { SamplesService } from "src/app/shared/services/samples.service";
import { flatten, uniqBy } from "lodash";

@Component({
  selector: "app-shared-batch-registration",
  templateUrl: "./shared-batch-registration.component.html",
  styleUrls: ["./shared-batch-registration.component.scss"],
})
export class SharedBatchRegistrationComponent implements OnInit {
  @Input() currentUser: CurrentUser;
  @Input() sampleRegistrationCategories: any;
  @Input() fromMaintenance: boolean;
  @Input() clinicalFields: any[];
  @Input() personFields: any[];
  @Input() mrnGeneratorSourceUuid: string;
  @Input() specimenTypeConceptUuid: string;

  @Input() preferredPersonIdentifier: string;
  @Input() personPhoneAttributeTypeUuid: string;
  @Input() personEmailAttributeTypeUuid: string;
  @Input() barcodeSettings: any;
  @Input() labTestRequestProgramStageId: string;
  @Input() currentLocation: any;
  @Input() referFromFacilityVisitAttribute: any;
  @Input() provider: any;

  useExistingBatchSet: boolean = false;
  useExistingBatch: boolean = false;
  registrationCategory: any;
  regCategoryItem: any;
  showBatchFieldsDefinition: boolean = true;
  errors: any[] = [];
  batchAndBatchSetsData: any = {};
  batchSampleCodeFormatReference$: Observable<any>;
  keyedBatchFields: any = {};
  formData: any = {};
  saving: boolean = false;
  existingBatchFieldsInformations: any = {};
  allFields: any[] = [];
  showSampleRegistration: boolean = false;
  currentDynamicFieldsData: any = {};
  constructor(
    private systemSettingsService: SystemSettingsService,
    private samplesService: SamplesService
  ) {}

  ngOnInit(): void {
    this.registrationCategory = this.sampleRegistrationCategories[0];
    // console.log(JSON.stringify(this.sampleRegistrationCategories));
    this.batchSampleCodeFormatReference$ = this.systemSettingsService
      .getSystemSettingsDetailsByKey(
        `iCare.laboratory.settings.batch.sample.registration.code.format`
      )
      .pipe(
        tap((response: any) => {
          if (response && !response?.error && response?.uuid) {
            return response;
          } else if (!response?.uuid && !response?.error) {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "iCare.laboratory.settings.batch.sample.registration.code.format is not set",
                },
              },
            ];
          } else {
            this.errors = [...this.errors, response];
          }
        })
      );
  }

  toggleExistingBatchOrBatchSet(event: any, category: string): void {
    if (category === "batchset") {
      this.useExistingBatchSet = !this.useExistingBatchSet;
    } else {
      this.useExistingBatch = !this.useExistingBatch;
    }
  }

  getRegistrationCategorySelection(event: MatRadioChange): void {
    this.registrationCategory = event?.value;

    this.showBatchFieldsDefinition = false;
    setTimeout(() => {
      this.showBatchFieldsDefinition = true;
    }, 20);
  }

  onGetSelectedFields(fields: any): void {
    this.showSampleRegistration = false;
    if (
      flatten(Object.keys(fields)?.map((keyText: string) => fields[keyText]))
        ?.length > 0
    ) {
      Object.keys(fields).forEach((keyText: string) => {
        this.keyedBatchFields[keyText.split("-")[0]] = uniqBy(
          [
            ...(this.keyedBatchFields[keyText.split("-")[0]] || []),
            ...(fields[keyText] || []),
          ],
          "id"
        );
        if (keyText?.indexOf("testorders") > -1) {
          this.formData["testorders"] = {
            value: fields[keyText][0]?.value,
          };
        }
      });
    } else {
      this.keyedBatchFields = {};
    }
    setTimeout(() => {
      this.showSampleRegistration = true;
    }, 30);
  }

  onGetAllFields(fields: any[]): void {
    this.allFields = uniqBy([...this.allFields, ...fields], "id");
    this.showSampleRegistration = false;
    setTimeout(() => {
      this.showSampleRegistration = true;
    }, 20);
  }

  onGetFormFieldsData(formData: any): void {
    // console.log(formData);
    this.formData = {
      ...this.formData,
      ...formData,
    };
  }

  onGetBatchAndBatchSetFormData(formData: any, category: string): void {
    this.batchAndBatchSetsData[category] = formData;
    if (
      (this.batchAndBatchSetsData["batch"]?.name?.value &&
        this.batchAndBatchSetsData["batch"]["selectedBatch"]) ||
      (this.batchAndBatchSetsData["batchset"]?.name?.value &&
        this.batchAndBatchSetsData["batchset"]["selectedBatchset"])
    ) {
      this.showBatchFieldsDefinition = false;
      if (this.batchAndBatchSetsData["batch"]?.name?.value) {
        this.existingBatchFieldsInformations = JSON.parse(
          this.batchAndBatchSetsData["batch"]["selectedBatch"]?.fields
        );
      } else {
        this.existingBatchFieldsInformations = JSON.parse(
          this.batchAndBatchSetsData["batchset"]["selectedBatchset"]?.fields
        );
      }

      setTimeout(() => {
        this.showBatchFieldsDefinition = true;
      }, 20);
    }
  }

  onGetFedDynamicFieldsData(formData: any): void {
    this.currentDynamicFieldsData = formData;

    this.existingBatchFieldsInformations["dynamicFields"] =
      this.existingBatchFieldsInformations["dynamicFields"]?.map(
        (dynamicField: any) => {
          return {
            ...dynamicField,
            value: formData[dynamicField?.id]?.value || null,
          };
        }
      );
  }

  onSave(event: Event): void {
    event.stopPropagation();
    const batchsetsInformation = this.batchAndBatchSetsData["batchset"]?.name
      ?.value
      ? [
          {
            name: this.batchAndBatchSetsData["batchset"]?.name?.value,
            label: this.batchAndBatchSetsData["batchset"]?.name?.value,
            fields: JSON.stringify({
              fixedFields:
                this.keyedBatchFields?.fixed?.map((field: any) => {
                  return {
                    id: field?.id,
                    key: field?.key,
                    label: field?.label,
                    name: field?.name,
                    value: this.formData[field?.id]?.value || null,
                  };
                }) || [],
              staticFields: this.keyedBatchFields?.static?.map((field: any) => {
                return {
                  id: field?.id,
                  key: field?.key,
                  label: field?.label,
                  name: field?.name,
                  value: this.formData[field?.id]?.value || null,
                };
              }),
              dynamicFields: this.keyedBatchFields?.dynamic?.map(
                (field: any) => {
                  return {
                    id: field?.id,
                    key: field?.key,
                    label: field?.label,
                    name: field?.name,
                    value: this.formData[field?.id]?.value || null,
                  };
                }
              ),
            }),
            description:
              this.batchAndBatchSetsData["batchset"]?.description?.value || "",
          },
        ]
      : null;

    let batches = [
      {
        label: this.batchAndBatchSetsData["batch"]?.name?.value,
        name: this.batchAndBatchSetsData["batch"]?.name?.value,
        description: this.batchAndBatchSetsData["batch"]?.description?.value,
        fields: JSON.stringify({
          fixedFields:
            this.keyedBatchFields?.fixed?.map((field: any) => {
              return {
                id: field?.id,
                key: field?.key,
                value: this.formData[field?.id]?.value || null,
              };
            }) || [],
          staticFields: this.keyedBatchFields?.static?.map((field: any) => {
            return {
              id: field?.id,
              key: field?.key,
              value: this.formData[field?.id]?.value || null,
            };
          }),
          dynamicFields: this.keyedBatchFields?.dynamic?.map((field: any) => {
            return {
              id: field?.id,
              key: field?.key,
              value: this.formData[field?.id]?.value || null,
            };
          }),
        }),
      },
    ];

    this.saving = true;
    this.existingBatchFieldsInformations = {};
    this.useExistingBatch = false;
    this.useExistingBatchSet = false;
    if (
      batchsetsInformation &&
      (!this.batchAndBatchSetsData["batchset"]["selectedBatchset"] ||
        (this.batchAndBatchSetsData["batchset"] &&
          this.batchAndBatchSetsData["batchset"]["selectedBatchset"] &&
          !this.batchAndBatchSetsData["batchset"]["selectedBatchset"]?.uuid))
    ) {
      this.samplesService
        .createBatchsets(batchsetsInformation)
        .subscribe((response) => {
          if (!response?.error) {
            batches = batches.map((batch) => {
              return {
                ...batch,
                batchSet: {
                  uuid: response[0]?.uuid,
                  name: response[0]?.name,
                },
              };
            });
            if (this.batchAndBatchSetsData["batchset"]?.name?.value) {
              this.samplesService.createBatch(batches).subscribe((response) => {
                this.saving = false;
              });
            }
          }
        });
    } else {
      batches =
        !this.batchAndBatchSetsData["batchset"]["selectedBatchset"] ||
        (this.batchAndBatchSetsData["batchset"] &&
          this.batchAndBatchSetsData["batchset"]["selectedBatchset"] &&
          !this.batchAndBatchSetsData["batchset"]["selectedBatchset"]?.uuid)
          ? batches
          : batches.map((batch) => {
              return {
                ...batch,
                batchSet: {
                  uuid: this.batchAndBatchSetsData["batchset"][
                    "selectedBatchset"
                  ]?.uuid,
                  name: this.batchAndBatchSetsData["batchset"][
                    "selectedBatchset"
                  ]?.name,
                },
              };
            });
      this.samplesService.createBatch(batches).subscribe((response) => {
        this.saving = false;
      });
    }
  }
}
