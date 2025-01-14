import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { uniqBy } from "lodash";
import { Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { LocationService } from "src/app/core/services";
import { IdentifiersService } from "src/app/core/services/identifiers.service";
import { RegistrationService } from "src/app/modules/registration/services/registration.services";
import { OpenMRSGenericOrder } from "src/app/shared/models/orders.models";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import {
  EncounterCreateFull,
  ObsCreate,
} from "src/app/shared/resources/openmrs";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { LabOrdersService } from "../../resources/services/lab-orders.service";
import { SamplesService } from "src/app/shared/services/samples.service";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { keyBy, omit, groupBy } from "lodash";

@Component({
  selector: "app-shared-sample-registration-via-batch",
  templateUrl: "./shared-sample-registration-via-batch.component.html",
  styleUrls: ["./shared-sample-registration-via-batch.component.scss"],
})
export class SharedSampleRegistrationViaBatchComponent implements OnInit {
  @Input() fields: any[];
  @Input() keyedBatchFields: any;
  @Input() existingBatchFieldsInformations: any;
  @Input() mrnGeneratorSourceUuid: string;
  @Input() personPhoneAttributeTypeUuid: string;
  @Input() personEmailAttributeTypeUuid: string;
  @Input() preferredPersonIdentifier: string;
  @Input() registrationCategory: any;
  @Input() currentLocation: any;
  @Input() referFromFacilityVisitAttribute: any;
  @Input() barcodeSettings: any;
  @Input() provider: any;
  @Input() specimenTypeConceptUuid: string;
  @Input() batchSampleCodeFormatReference: string;
  fieldsNotSetOnBatch: any[] = [];
  dynamicFields: any[] = [];
  @Output() fedDynamicFieldsData: EventEmitter<any> = new EventEmitter<any>();
  @Input() category: string;
  formData: any = {};
  addingSample: boolean = false;
  testOrderField: any;
  errors: any[] = [];
  fieldsWithData;
  constructor(
    private httpClient: OpenmrsHttpClientService,
    private registrationService: RegistrationService,
    private locationService: LocationService,
    private identifierService: IdentifiersService,
    private visitsService: VisitsService,
    private conceptsService: ConceptsService,
    private labOrdersService: LabOrdersService,
    private samplesService: SamplesService,
    private orderService: OrdersService
  ) {}

  ngOnInit(): void {
    // console.log("specimenTypeConceptUuid::", this.specimenTypeConceptUuid);
    // console.log(this.keyedBatchFields);
    // console.log(
    //   "referFromFacilityVisitAttribute",
    //   this.referFromFacilityVisitAttribute
    // );
    // console.log(
    //   "existingBatchFieldsInformations",
    //   this.existingBatchFieldsInformations
    // );
    this.testOrderField = [
      ...(this.existingBatchFieldsInformations?.fixedFields?.filter(
        (fixedField: any) => fixedField?.id === "testorders"
      ) || []),
      ...(this.existingBatchFieldsInformations?.staticFields?.filter(
        (staticField: any) => staticField?.id === "testorders"
      ) || []),
      ...(this.existingBatchFieldsInformations?.dynamicFields?.filter(
        (dynamicField: any) => dynamicField?.id === "testorders"
      ) || []),
    ][0];
    this.fieldsNotSetOnBatch = this.fields?.filter(
      (field: any) =>
        (
          uniqBy(
            [
              ...(this.existingBatchFieldsInformations?.fixedFields || []),
              ...(this.existingBatchFieldsInformations?.staticFields || []),
              ...(this.existingBatchFieldsInformations?.dynamicFields || []),
            ],
            "id"
          )?.filter((fieldItem: any) => fieldItem?.id === field?.id) || []
        )?.length === 0
    );

    this.dynamicFields =
      (
        uniqBy(
          [
            ...(uniqBy(
              this.existingBatchFieldsInformations?.dynamicFields || [],
              "id"
            )?.map((savedField: any) => {
              const dynamicField = (this.fields?.filter(
                (field: any) => field?.id === savedField?.id
              ) || [])[0];
              return {
                ...dynamicField,
                value: savedField?.value
                  ? savedField?.value
                  : dynamicField?.value,
              };
            }) || []),
            ...(this.keyedBatchFields?.dynamic || []),
          ],
          "id"
        ) || []
      )?.filter(
        (dyField: any) => dyField?.id && dyField?.id !== "testorders"
      ) || [];
    // console.log(this.fieldsNotSetOnBatch);
    // console.log(this.dynamicFields);
    this.fieldsWithData = uniqBy(
      [
        ...(this.existingBatchFieldsInformations?.fixedFields || []),
        ...(this.existingBatchFieldsInformations?.staticFields || []),
        ...(this.existingBatchFieldsInformations?.dynamicFields || []),
      ],
      "id"
    )?.filter((field: any) => field?.value);
    // console.log("fieldsWithData", this.fieldsWithData);
  }

  onFormUpdate(formValue: FormValue): void {
    this.formData = {
      ...this.formData,
      ...formValue.getValues(),
    };
    // console.log(this.formData);

    // Add support to search patients using either names, file number or any unique reference
    this.fedDynamicFieldsData.emit(this.formData);
  }

  onAddSample2(event: Event): void {
    event.stopPropagation();
    this.addingSample = true;
  }

  onAddSample(event: Event): void {
    event.stopPropagation();
    this.addingSample = true;
    this.getIdentifierGenerationDetails().subscribe((responses: any[]) => {
      if (responses) {
        // console.log(responses);
        const patientIdentifierTypes = responses[0];
        this.getIdentifierData().subscribe((identifierResponse: any) => {
          if (identifierResponse) {
            // console.log("response", identifierResponse);
            // Formulate person data
            this.formData["mrn"] = {
              value: identifierResponse[0],
            };
            const personData = {
              person: {
                names: [
                  {
                    givenName: this.formData?.firstName?.value,
                    familyName: this.formData?.lastName?.value,
                    familyName2: this.formData?.middleName?.value,
                  },
                ],
                gender:
                  this.formData?.gender?.value?.length > 0
                    ? this.formData?.gender?.value
                    : "U",
                age: this.formData?.age?.value,
                birthdate: this.formData?.dob?.value
                  ? this.formData?.dob?.value
                  : null,
                birthdateEstimated: this.formData?.dob?.value ? false : true,
                addresses: [
                  {
                    address1: this.formData?.address?.value,
                    cityVillage: "",
                    country: "",
                    postalCode: "",
                  },
                ],
                attributes: [
                  {
                    attributeType: this.personPhoneAttributeTypeUuid,
                    value: this.formData?.mobileNumber?.value,
                  },
                  {
                    attributeType: this.personEmailAttributeTypeUuid,
                    value: this.formData?.email?.value,
                  },
                ]?.filter((personAttribute: any) => personAttribute?.value),
              },
              identifiers:
                this.registrationCategory?.refKey !== "non-clinical"
                  ? (patientIdentifierTypes || [])
                      .map((personIdentifierType) => {
                        if (
                          personIdentifierType.id ===
                          this.preferredPersonIdentifier
                        ) {
                          return {
                            identifier: this.formData?.mrn?.value,
                            identifierType: personIdentifierType.id,
                            location:
                              this.currentLocation?.uuid ||
                              "7fdfa2cb-bc95-405a-88c6-32b7673c0453", // TODO: Find a way to softcode this,
                            preferred: true,
                          };
                        } else {
                          return {
                            identifier: "",
                            identifierType: personIdentifierType.id,
                            location:
                              this.currentLocation?.uuid ||
                              "7fdfa2cb-bc95-405a-88c6-32b7673c0453", // TODO: Find a way to softcode this,
                            preferred: false,
                          };
                        }
                      })
                      .filter(
                        (patientIdentifier) => patientIdentifier?.identifier
                      )
                  : [
                      {
                        identifier: identifierResponse[0],
                        identifierType: this.preferredPersonIdentifier,
                        location:
                          this.currentLocation?.uuid ||
                          "7fdfa2cb-bc95-405a-88c6-32b7673c0453", // TODO: Find a way to softcode this
                        preferred: true,
                      },
                    ],
            };
            this.createOrUpdatePerson(personData).subscribe(
              (personDataResponse: any) => {
                if (!personDataResponse?.error) {
                  let visAttributes = [
                    {
                      attributeType: "PSCHEME0IIIIIIIIIIIIIIIIIIIIIIIATYPE",
                      value: "00000102IIIIIIIIIIIIIIIIIIIIIIIIIIII",
                    },
                    {
                      attributeType: "PTYPE000IIIIIIIIIIIIIIIIIIIIIIIATYPE",
                      value: "00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII",
                    },
                    {
                      attributeType: "SERVICE0IIIIIIIIIIIIIIIIIIIIIIIATYPE",
                      value: "30fe16ed-7514-4e93-a021-50024fe82bdd",
                    },
                    {
                      attributeType: "66f3825d-1915-4278-8e5d-b045de8a5db9",
                      value: "d1063120-26f0-4fbb-9e7d-f74c429de306",
                    },
                    {
                      attributeType: "6eb602fc-ae4a-473c-9cfb-f11a60eeb9ac",
                      value: "b72ed04a-2c4b-4835-9cd2-ed0e841f4b58",
                    },
                  ];

                  Object.keys(this.formData)?.forEach((key: string) => {
                    if (key?.indexOf("attribute") > -1) {
                      visAttributes = [
                        ...visAttributes,
                        {
                          attributeType: key.split("attribute-")[1],
                          value: this.formData[key]?.value,
                        },
                      ];
                    }
                  });

                  const visitObject = {
                    patient: personDataResponse?.uuid,
                    visitType: "54e8ffdc-dea0-4ef0-852f-c23e06d16066",
                    location: this.currentLocation?.uuid,
                    indication: "Sample Registration",
                    attributes:
                      visAttributes.filter((attribute) => attribute?.value) ||
                      [],
                  };

                  this.createOrUpdateVisit(visitObject).subscribe(
                    (visitResponse: any) => {
                      if (visitResponse) {
                        // console.log("visitResponse", visitResponse);
                        // Create encounter with orders
                        this.errors = [];
                        zip(
                          ...this.testOrderField?.value.map(
                            (testOrderConceptUuid: string) => {
                              return this.conceptsService
                                .getConceptSetsByConceptUuids([
                                  testOrderConceptUuid,
                                ])
                                .pipe(
                                  map((response: any) => {
                                    // console.log("depa", response);
                                    return {
                                      testOrder: testOrderConceptUuid,
                                      department: (response?.filter(
                                        (item: any) =>
                                          item?.systemName
                                            ?.toLowerCase()
                                            ?.indexOf("lab_department") > -1
                                      ) || [])[0],
                                    };
                                  })
                                );
                            }
                          )
                        ).subscribe((response: any) => {
                          // console.log(response);
                          // Create error message is there is missing department
                          this.errors = [
                            ...this.errors,
                            response?.filter(
                              (orderDepartmentDetails: {
                                testOrder: string;
                                department: any;
                              }) => !orderDepartmentDetails?.department
                            ),
                          ];
                          // Create orders via encounter
                          const testOrders: OpenMRSGenericOrder[] = (
                            response?.filter(
                              (orderDepartmentDetails: {
                                testOrder: string;
                                department: any;
                              }) => orderDepartmentDetails?.department
                            ) || []
                          )?.map(
                            (orderDepartmentDetails: {
                              testOrder: string;
                              department: any;
                            }) => {
                              return {
                                concept: orderDepartmentDetails?.testOrder,
                                orderType:
                                  "52a447d3-a64a-11e3-9aeb-50e549534c5e", // TODO: Find a way to soft code this
                                action: "NEW",
                                orderer: this.provider?.uuid,
                                patient: personDataResponse?.uuid,
                                careSetting: "OUTPATIENT",
                                urgency: "ROUTINE", // TODO: Change to reflect users input
                                instructions: "",
                                type: "testorder",
                                department:
                                  orderDepartmentDetails?.department?.uuid,
                                specimenSource: keyBy(
                                  this.fieldsWithData,
                                  "id"
                                )[this.specimenTypeConceptUuid]?.value,
                              };
                            }
                          );

                          let obs: ObsCreate[] = [];

                          let encounterObjects = [
                            {
                              visit: visitResponse?.uuid,
                              patient: personDataResponse?.uuid,
                              encounterType:
                                "9b46d3fe-1c3e-4836-a760-f38d286b578b",
                              location: this.currentLocation?.uuid,
                              orders: testOrders?.map((testOrder: any) => {
                                return omit(testOrder, [
                                  "department",
                                  "specimenSource",
                                ]);
                              }),
                              obs:
                                obs?.filter(
                                  (observation) => observation?.value
                                ) || [],
                              encounterProviders: [
                                {
                                  provider: this.provider?.uuid,
                                  encounterRole: ICARE_CONFIG.encounterRole,
                                },
                              ],
                            },
                          ];
                          zip(
                            ...encounterObjects.map((encounterObject: any) =>
                              this.labOrdersService.createLabOrdersViaEncounter(
                                encounterObject
                              )
                            )
                          ).subscribe(
                            (encountersResponses: EncounterCreateFull[]) => {
                              // console.log(encountersResponses);

                              const testOrdersGroupedByDepartments: any =
                                groupBy(testOrders, "department");
                              const orderUuids: string[] =
                                encountersResponses[0]?.orders?.map(
                                  (order: any) => order?.uuid
                                );
                              this.orderService
                                .getOrdersByUuids(orderUuids)
                                .subscribe((ordersResponse) => {
                                  if (ordersResponse) {
                                    const configs = {
                                      otherContainer: {
                                        id: "eb21ff23-a627-4a62-8bd0-efdc1db2ebb5",
                                        uuid: "eb21ff23-a627-4a62-8bd0-efdc1db2ebb5",
                                      },
                                    };
                                    // console.log(
                                    //   "orders response",
                                    //   ordersResponse
                                    // );

                                    const keyedOrdersByConceptUuid: any = keyBy(
                                      ordersResponse?.map((order: any) => {
                                        return {
                                          ...order,
                                          conceptUuid: order?.concept?.uuid,
                                        };
                                      }),
                                      "conceptUuid"
                                    );
                                    // console.log(
                                    //   "keyedOrdersByConceptUuid",
                                    //   keyedOrdersByConceptUuid
                                    // );
                                    // console.log(
                                    //   "grouped test orders",
                                    //   testOrdersGroupedByDepartments
                                    // );
                                    Object.keys(
                                      testOrdersGroupedByDepartments
                                    )?.map((department: string) => {
                                      this.samplesService
                                        .getIncreamentalSampleLabel()
                                        .subscribe((sampleLabel) => {
                                          if (sampleLabel) {
                                            const sample = {
                                              visit: {
                                                uuid: visitResponse?.uuid,
                                              },
                                              label: sampleLabel,
                                              concept: {
                                                uuid: department,
                                              },
                                              specimenSource: {
                                                uuid: testOrdersGroupedByDepartments[
                                                  department
                                                ][0]?.specimenSource,
                                              },
                                              location: {
                                                uuid: this.currentLocation
                                                  ?.uuid,
                                              },
                                              orders:
                                                testOrdersGroupedByDepartments[
                                                  department
                                                ]?.map(
                                                  (testOrderDetails: any) => {
                                                    return {
                                                      uuid: keyedOrdersByConceptUuid[
                                                        testOrderDetails
                                                          ?.concept
                                                      ]?.uuid,
                                                    };
                                                  }
                                                ),
                                              batchSample: {
                                                uuid: "",
                                              },
                                            };
                                            // Create sample
                                            this.samplesService
                                              .createLabSample(sample)
                                              .subscribe(
                                                (sampleResponse: any) => {
                                                  // console.log(
                                                  //   "sampleResponse",
                                                  //   sampleResponse
                                                  // );
                                                  if (sampleResponse) {
                                                    this.addingSample = false;
                                                    let statuses: any = [];
                                                    statuses = [
                                                      ...statuses,
                                                      {
                                                        sample: {
                                                          uuid: sampleResponse?.uuid,
                                                        },
                                                        user: {
                                                          uuid: localStorage.getItem(
                                                            "userUuid"
                                                          ),
                                                        },
                                                        category:
                                                          "SAMPLE_REGISTRATION_CATEGORY",
                                                        remarks:
                                                          "Sample registration form type reference",
                                                        status:
                                                          this.registrationCategory?.refKey?.toUpperCase(),
                                                      },
                                                      {
                                                        sample: {
                                                          uuid: sampleResponse?.uuid,
                                                        },
                                                        user: {
                                                          uuid: localStorage.getItem(
                                                            "userUuid"
                                                          ),
                                                        },
                                                        remarks:
                                                          "Sample collection",
                                                        category: "COLLECTED",
                                                        status: "COLLECTED",
                                                      },
                                                    ];

                                                    zip(
                                                      this.samplesService.setMultipleSampleStatuses(
                                                        statuses
                                                      )
                                                    ).subscribe(
                                                      (
                                                        sampleStatusResponses: any[]
                                                      ) => {
                                                        // console.log(
                                                        //   "sampleStatusResponses saving",
                                                        //   sampleStatusResponses
                                                        // );
                                                      }
                                                    );
                                                  }
                                                }
                                              );
                                          }
                                        });
                                    });
                                  }
                                });
                            }
                          );
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    });
  }

  getIdentifierGenerationDetails(): Observable<any> {
    return zip(
      this.registrationService.getPatientIdentifierTypes(),
      this.locationService.getFacilityCode(),
      this.registrationService.getAutoFilledPatientIdentifierType()
    );
  }

  getIdentifierData(): Observable<any> {
    // const patientIdentifierTypes = identifierGenerationDetails[0];
    return this.identifierService.generateIds({
      generateIdentifiers: true,
      sourceUuid: this.mrnGeneratorSourceUuid,
      numberToGenerate: 1,
    });
  }

  createOrUpdatePerson(personData: any): Observable<any> {
    return this.registrationService.createPatient(personData).pipe(
      map((response: any) => response),
      catchError((error: any) => of(error))
    );
  }

  createOrUpdateVisit(visitData: any): Observable<any> {
    return this.visitsService.createVisit(visitData).pipe(
      map((response: any) => response),
      catchError((error: any) => of(error))
    );
  }

  createEncounter(encounterData: any): Observable<any> {
    // The encounter will have the orders and obs associated with
    return this.httpClient.post(``, encounterData).pipe(
      map((response: any) => response),
      catchError((error: any) => of(error))
    );
  }
}
