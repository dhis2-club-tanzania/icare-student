import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable, zip } from "rxjs";
import { ConceptSourcesService } from "src/app/core/services/concept-sources.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { BillableItemsService } from "src/app/shared/resources/billable-items/services/billable-items.service";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import {
  ConceptdatatypeGet,
  ConceptGetFull,
  ConceptsourceGet,
} from "src/app/shared/resources/openmrs";

import { omit, uniqBy } from "lodash";
import { Field } from "../../modules/form/models/field.model";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";

@Component({
  selector: "app-shared-concept-create",
  templateUrl: "./shared-concept-create.component.html",
  styleUrls: ["./shared-concept-create.component.scss"],
})
export class SharedConceptCreateComponent implements OnInit {
  @Input() conceptClass: string;
  @Input() standardSearchTerm: string;
  @Input() setMembersSearchTerm: string;
  @Input() searchTermForTestMethod: string;
  @Input() dataType: string;
  @Input() isSet: boolean;
  @Input() itemTypeName: string;
  @Input() setMembersHeaderName: string;
  @Input() conceptDataTypes: ConceptdatatypeGet[];
  @Input() inheritProperties: boolean;
  @Input() saveOnTheComponent: boolean;
  @Input() showItemTypeName: boolean;
  @Input() conceptSources: any[];
  @Input() multipleSelectionCompHeight: string;
  @Input() conceptData: any;
  @Input() showCodesSection: boolean;
  @Input() isItemStockable: boolean;
  basicConceptFields: any[];
  dataTypeField: any;
  unitsField: any;
  displayPrecisionField: any;
  formData: any = {};
  isFormValid: boolean = false;
  selectedCodingItems: any[] = [];
  mappings: any[] = [];
  readyToCollectCodes: boolean = false;

  codesMappingsSourceField: Field<string>;

  @Output() conceptCreated: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() conceptToCreate: EventEmitter<any> = new EventEmitter<any>();

  saving: boolean = false;
  editingSet: boolean = false;
  conceptUuid: string;

  selectedSetMembers: ConceptGetFull[] = [];
  testMethodSelected: boolean = false;
  selectedTestMethodDetails$: Observable<ConceptGetFull[]>;

  conceptSources$: Observable<ConceptsourceGet[]>;

  selectedItems: any[] = [];
  selectedCodingSource: any;

  alertType: string = "";

  savingMessage: string;

  testMethodUuid: string;
  conceptBeingEdited: ConceptGetFull;

  errors: any[] = [];
  currentMappings: any[] = [];
  constructor(
    private conceptService: ConceptsService,
    private billableItemService: BillableItemsService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.createBasicConceptFields(this.conceptData);
    this.createCodesMappingSourceField(this.conceptData);
    this.selectedSetMembers =
      this.conceptData && this.conceptData?.setMembers
        ? this.conceptData?.setMembers
        : [];
    if (!this.dataType && this.conceptDataTypes) {
      this.createDataTypeField(this.conceptData);
      this.createDisplayPrecisionField();
      this.createUnitField();
    }

    if (this.inheritProperties) {
      this.createUnitField();
    }
  }

  onFormUpdateForSource(formValues: FormValue): void {
    this.selectedCodingSource = null;
    setTimeout(() => {
      this.selectedCodingSource = formValues.getValues()?.source?.value;
    }, 200);
  }

  createDataTypeField(data?: any): void {
    this.dataTypeField = new Dropdown({
      id: "datatype",
      key: "datatype",
      label: "Data type",
      required: true,
      value: data ? data?.datatype?.uuid : null,
      options: this.conceptDataTypes.map((conceptDataType) => {
        return {
          key: conceptDataType?.uuid,
          value: conceptDataType?.uuid,
          label: conceptDataType?.display,
          name: conceptDataType?.display,
        };
      }),
    });
  }

  createDisplayPrecisionField() {
    this.displayPrecisionField = new Textbox({
      id: "precision",
      key: "precision",
      label: "Display precision",
      type: "number",
    });
  }

  createUnitField(): void {
    this.unitsField = new Textbox({
      id: "units",
      key: "units",
      label: "Units",
      type: "text",
    });
  }

  createCodesMappingSourceField(data?: any): void {
    const conceptSourceUuid =
      data && data?.mappings?.length > 0
        ? data?.mappings[0]?.conceptReferenceTerm?.conceptSource?.uuid
        : null;

    // console.log("conceptSourceUuid", conceptSourceUuid);
    // console.log(data?.mappings);

    this.currentMappings =
      data && data?.mappings?.length > 0
        ? data?.mappings?.filter(
            (mapping) =>
              mapping?.conceptReferenceTerm?.conceptSource?.uuid ===
              conceptSourceUuid
          ) || []
        : [];
    this.codesMappingsSourceField = new Dropdown({
      id: "source",
      key: "source",
      label: "Mapping Reference",
      value: conceptSourceUuid,
      options: this.conceptSources.map((source) => {
        return {
          key: source?.uuid,
          label: source?.display,
          value: source?.uuid,
          name: source?.display,
        };
      }),
    });
  }

  createBasicConceptFields(data?: any): void {
    const shortNameDetails = (data?.names.filter(
      (name) => name?.conceptNameType === "SHORT"
    ) || [])[0];
    // Add support to support multiple languages
    const descriptionsDetails = data?.descriptions[0];
    this.readyToCollectCodes = true;
    this.basicConceptFields = [
      new Textbox({
        id: "name",
        key: "name",
        label: "Name",
        value:
          data && data?.display
            ? (this.standardSearchTerm === "TEST_ORDERS" ? "TO: " : "") +
              data?.display
            : null,
        required: true,
      }),
      new Textbox({
        id: "shortName",
        key: "shortName",
        label: "Short name",
        value: shortNameDetails ? shortNameDetails?.name : null,
        required: true,
      }),
      new TextArea({
        id: "description",
        key: "description",
        value: descriptionsDetails ? descriptionsDetails?.description : null,
        label: "Description",
      }),
    ];
  }

  onFormUpdate(formValues: FormValue): void {
    this.formData = { ...this.formData, ...formValues.getValues() };
    this.isFormValid = formValues.isValid;
    this.conceptToCreate.emit(this.formData);
  }

  onFormUpdateForDataType(formValues: FormValue): void {
    this.formData = { ...this.formData, ...formValues.getValues() };
    this.conceptToCreate.emit(this.formData);
  }

  onGetSelectedMembers(event): void {
    // console.log(event);
    this.selectedItems = event;
  }

  onFormUpdateTestMethod(formValues: FormValue): void {
    this.formData = { ...this.formData, ...formValues.getValues() };
    const methodUuid = this.formData["testmethod"]?.value;
    this.testMethodUuid = methodUuid;
    if (methodUuid) {
      this.testMethodSelected = true;
      this.formData["testmethod"]?.value;
      this.selectedTestMethodDetails$ =
        this.conceptService.getConceptDetailsByUuid(methodUuid, "full");

      this.selectedTestMethodDetails$.subscribe((response: any) => {
        if (response) {
          this.createBasicConceptFields(response);
        }
      });
    }
  }

  onGetSelectedSetMembers(selectedSetMembers: ConceptGetFull[]): void {
    this.selectedSetMembers = selectedSetMembers;
    this.conceptToCreate.emit({
      ...this.formData,
      setMembers: this.selectedSetMembers,
    });
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.createBasicConceptFields();
    this.editingSet = true;
    setTimeout(() => {
      this.editingSet = false;
      this.conceptUuid = null;
      this.selectedSetMembers = [];
    }, 200);
  }

  onConceptEdit(concept: ConceptGetFull): void {
    this.conceptUuid = concept?.uuid;
    // First get concept details
    this.conceptService
      .getConceptDetailsByUuid(
        concept?.uuid,
        "custom:(uuid,display,datatype,set,retired,descriptions,name,names,setMembers:(uuid,display),conceptClass:(uuid,display),answers:(uuid,display),mappings:(conceptReferenceTerm:(uuid,display,conceptSource:(uuid,display))))"
      )
      .subscribe((response) => {
        if (response) {
          this.createBasicConceptFields(response);
          this.createCodesMappingSourceField(response);
          this.editingSet = true;
          this.readyToCollectCodes = false;
          this.selectedCodingItems =
            response?.mappings.map(
              (mapping) => mapping?.conceptReferenceTerm
            ) || [];
          this.mappings = response?.mappings;
          setTimeout(() => {
            this.editingSet = false;
            this.readyToCollectCodes = true;
            this.selectedSetMembers = response?.setMembers;
          }, 200);
        }
      });
  }

  onGetSelectedCodes(selectedItems: any): void {
    this.selectedItems = selectedItems;
    this.conceptToCreate.emit({ ...this.formData, codes: selectedItems });
  }

  onSave(event: Event, selectedTestMethodDetails?: any): void {
    event.stopPropagation();
    this.errors = [];
    const conceptName = this.formData["name"]?.value;
    let searchIndexedTerms = [
      {
        name: this.standardSearchTerm,
        locale: "en",
        localePreferred: false,
        conceptNameType: "INDEX_TERM",
      },
    ];
    searchIndexedTerms = [
      ...searchIndexedTerms,
      ...(this.selectedItems || []).map((item) => {
        return {
          name: item?.display.split(" (")[0],
          locale: "en",
          localePreferred: false,
          conceptNameType: "INDEX_TERM",
        };
      }),
    ];

    let names = [];
    this.saving = true;
    names = [
      ...names,
      {
        name: this.formData["name"]?.value,
        locale: "en",
        localePreferred: true,
        conceptNameType: "FULLY_SPECIFIED",
      },
    ];

    names = [
      ...names,
      {
        name: this.formData["shortName"]?.value,
        locale: "en",
        localePreferred: false,
        conceptNameType: "SHORT",
      },
    ];

    const conceptMapType = "35543629-7d8c-11e1-909d-c80aa9edcf4e";

    let mappings =
      this.selectedItems && this.selectedItems.length > 0
        ? this.selectedItems.map((item) => {
            return {
              conceptReferenceTerm: item?.uuid,
              conceptMapType,
            };
          })
        : [];

    if (this.conceptBeingEdited) {
      mappings = [
        ...mappings,
        ...this.conceptBeingEdited?.mappings.map((mapping) => {
          return {
            conceptReferenceTerm: mapping?.conceptReferenceTerm?.uuid,
            conceptMapType,
          };
        }),
      ];
      searchIndexedTerms = searchIndexedTerms.filter(
        (searchIndexedTerm) =>
          (
            this.conceptBeingEdited?.names?.filter(
              (savedName) =>
                savedName?.name != searchIndexedTerm?.name &&
                savedName?.conceptNameType == "INDEX_TERM"
            ) || []
          ).length === 0
      );
    }

    let concept = {
      names: names,
      descriptions: [
        {
          description: this.formData["description"]?.value,
          locale: "en",
        },
      ],
      datatype: this.dataType
        ? this.dataType
        : this.formData["datatype"]?.value
        ? this.formData["datatype"]?.value
        : "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
      // Softcode concept class
      set: this.isSet ? this.isSet : false,
      setMembers:
        this.selectedSetMembers?.length > 0
          ? this.selectedSetMembers.map((member) => member?.uuid)
          : [],
      conceptClass: this.conceptClass,
      units: this.formData["units"]?.value
        ? this.formData["units"]?.value
        : null,
      displayPrecision:
        this.formData["datatype"]?.value ===
          "8d4a4488-c2cc-11de-8d13-0010c6dffd0f" &&
        this.formData["precision"]?.value
          ? this.formData["precision"]?.value
          : null,
      mappings: uniqBy(mappings, "conceptReferenceTerm"),
    };

    const keys: any[] = Object.keys(concept);
    if (concept) {
      keys.forEach((key) => {
        if (!concept[key]) {
          concept = omit(concept, key);
        }
      });
    }

    // Check if concept exists
    this.conceptService
      .searchConcept({ q: conceptName, conceptClass: this.conceptClass })
      .subscribe((checkResponse) => {
        if (checkResponse?.length > 0 && !this.conceptUuid) {
          this.saving = false;
          this.alertType = "danger";
          this.savingMessage = "Item with name " + conceptName + " exists";
          setTimeout(() => {
            this.savingMessage = null;
          }, 4000);
        } else {
          (!this.conceptUuid
            ? this.conceptService.createConcept(concept)
            : this.conceptService.updateConcept(this.conceptUuid, concept)
          ).subscribe((response: any) => {
            if (response && !response?.error) {
              // If it is test order create as a billable item
              if (
                !this.conceptUuid &&
                this.standardSearchTerm === "TEST_ORDERS"
              ) {
                const billableItem = {
                  concept: { uuid: response?.uuid },
                  unit: "default",
                  stockable: this.isItemStockable,
                };
                this.billableItemService
                  .createBillableItem(billableItem)
                  .subscribe((billableItemResponse) => {
                    if (billableItemResponse && !billableItemResponse?.error) {
                      // Create prices
                      const prices = [
                        {
                          item: {
                            uuid: billableItemResponse?.uuid,
                          },
                          paymentScheme: {
                            uuid: "00000102IIIIIIIIIIIIIIIIIIIIIIIIIIII",
                          },
                          paymentType: {
                            uuid: "00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
                          },
                          price: "0",
                        },
                        {
                          item: {
                            uuid: billableItemResponse?.uuid,
                          },
                          paymentScheme: {
                            uuid: "5f53b4e2-da03-4139-b32c-ad6edb699943",
                          },
                          paymentType: {
                            uuid: "00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
                          },
                          price: "0",
                        },
                      ];
                      zip(
                        ...prices.map((priceObject) => {
                          return this.billableItemService.createPrice(
                            priceObject
                          );
                        })
                      ).subscribe((priceResponses) => {
                        if (priceResponses) {
                          this.conceptService
                            .createConceptNames(
                              response?.uuid,
                              searchIndexedTerms
                            )
                            .subscribe((conceptNameResponse: any) => {
                              if (
                                conceptNameResponse &&
                                !conceptNameResponse?.error
                              ) {
                                this.saving = false;
                                this.conceptUuid = null;
                                this.savingMessage =
                                  "Successfully created " + conceptName;
                                this.alertType = "success";
                                setTimeout(() => {
                                  this.savingMessage = null;
                                }, 4000);
                                this.conceptCreated.emit(true);
                                this.selectedSetMembers = [];
                                this.createBasicConceptFields();
                              } else {
                                this.saving = false;
                                this.errors = [
                                  ...this.errors,
                                  conceptNameResponse,
                                ];
                              }
                            });
                        }
                      });
                    } else {
                      this.saving = false;
                      this.errors = [...this.errors, billableItemResponse];
                    }
                  });
              } else {
                this.conceptService
                  .createConceptNames(
                    response?.uuid,
                    uniqBy(searchIndexedTerms, "name")
                  )
                  .subscribe((conceptNameResponse: any) => {
                    if (conceptNameResponse && !conceptNameResponse?.error) {
                      this.saving = false;
                      this.alertType = "success";
                      this.savingMessage =
                        "Successfully created " + conceptName;
                      this.trackActionForAnalytics(`Non Drugs: Save`);

                      setTimeout(() => {
                        this.savingMessage = null;
                      }, 4000);
                      this.conceptUuid = null;
                      this.conceptCreated.emit(true);
                      this.selectedSetMembers = [];
                      this.createBasicConceptFields();
                    } else {
                      this.saving = false;
                      this.errors = [...this.errors, conceptNameResponse];
                    }
                  });
              }
            } else {
              this.saving = false;
              this.errors = [...this.errors, response];
            }
          });
        }
      });
  }

  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
    this.googleAnalyticsService.sendAnalytics(
      "Pharmacy",
      eventname,
      "Pharmacy"
    );
  }
}
