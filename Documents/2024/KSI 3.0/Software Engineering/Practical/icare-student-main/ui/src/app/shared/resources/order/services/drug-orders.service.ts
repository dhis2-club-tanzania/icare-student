import { Injectable } from "@angular/core";
import { from, Observable, of, throwError, zip } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { flatten, keyBy } from "lodash";
import {
  DrugOrder,
  DrugOrderObject,
} from "src/app/shared/resources/order/models/drug-order.model";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api, ConceptGet } from "../../openmrs";
import {
  formatConceptAnswersAsOptions,
  formatConceptSetMembersAsOptions,
  formatDrugOrderFrequencyConcept,
} from "../helpers/sanitise-concepts-for-prescription.helper";
import { formatDrugs } from "../helpers/sanitize-drug.helper";
import { DrugOrderMetadata } from "../models/drug-order-metadata.model";
import { Visit } from "../../visits/models/visit.model";
import { StockService } from "../../store/services/stock.service";
import { IndexDbService } from "src/app/core/services/index-db.service";
import { OrderIntention } from "../models";

@Injectable({
  providedIn: "root",
})
export class DrugOrdersService {
  private drugs: any[];
  private setMembersAsOptions = {};
  private drugOrderFrequency: any;
  private conceptAnswerAsOptions: any;
  private _encounterEntities = {};
  private _encounterType = {
    prescription: null,
    dispensing: null,
  };
  constructor(
    private api: Api,
    private openmrsService: OpenmrsHttpClientService,
    private stockService: StockService
  ) {}

  async getSetMembersAsOptions(
    fieldName: string,
    fields: string
  ): Promise<any> {
    if (this.setMembersAsOptions[fieldName]) {
      return this.setMembersAsOptions[fieldName];
    }
    const results = await this.api.concept.getAllConcepts({
      v: fields,
      name: fieldName,
    });

    const conceptResult = (results?.results || [])[0];
    const formattedConceptsAsOptions =
      formatConceptSetMembersAsOptions(conceptResult);

    this.setMembersAsOptions[fieldName] = formattedConceptsAsOptions;
    return formattedConceptsAsOptions;
  }

  async getConceptDetails(conceptName): Promise<any> {
    const conceptResults = await this.api.concept.getAllConcepts({
      v: "full",
      name: conceptName,
    });
    const concept: ConceptGet = (conceptResults?.results || [])[0];
    const { name, uuid, retired } = concept;
    return {
      name: name,
      retired: retired,
      key: uuid,
      value: name,
      id: uuid,
      label: name,
    };
  }

  async getDrugOrdersFrequency(fields): Promise<any> {
    if (this.drugOrderFrequency) {
      return this.drugOrderFrequency;
    }
    const drugOrderFreqResults =
      await this.api.orderfrequency.getAllOrderFrequencies({ v: fields });
    const freqResults = drugOrderFreqResults?.results || [];
    this.drugOrderFrequency = formatDrugOrderFrequencyConcept(freqResults);
    return this.drugOrderFrequency;
  }

  async getConceptAnswersAsOptions(conceptName, fields): Promise<any> {
    if (this.conceptAnswerAsOptions) {
      return this.conceptAnswerAsOptions;
    }
    const conceptResult = await this.api.concept.getAllConcepts({
      v: fields,
      name: conceptName,
    });

    const conceptDetails = (conceptResult?.results || [])[0];
    this.conceptAnswerAsOptions = formatConceptAnswersAsOptions(conceptDetails);
    return this.conceptAnswerAsOptions;
  }

  async getAllDrugs(fields): Promise<any> {
    if (this.drugs) {
      return this.drugs;
    }
    const drugsResults = await this.api.drug.getAllDrugs({ v: fields });
    this.drugs = drugsResults?.results || [];
    return formatDrugs(this.drugs);
  }

  getDrugOrderStatus(visitUuid): Observable<any> {
    return this.openmrsService.get(`store/orderStatus/${visitUuid}`).pipe(
      map((response) => {
        return keyBy(response, "order");
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getDrugOrders(uuids?: string[]): Observable<DrugOrderObject[]> {
    if (!uuids || uuids.length === 0) {
      return of([]);
    }

    return zip(...uuids.map((uuid) => this.getDrugOrderByUuid(uuid)));
  }

  getDrugOrderByUuid(uuid): Observable<DrugOrderObject> {
    return from(this.api.order.getOrder(uuid)).pipe(
      map((drugOrderResponse) => new DrugOrder(drugOrderResponse).toJson())
    );
  }

  dispenseOrderedDrugOrder(dispenseDetails): Observable<any> {
    return this.openmrsService
      .post(`store/drugOrder/${dispenseDetails?.uuid}/dispense`, {
        location: dispenseDetails?.location,
      })
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }

  saveDrugOrder(
    order: DrugOrderObject,
    orderIntention?: OrderIntention,
    visit?: Visit,
    location?: string,
    provider?: string
  ): Observable<any> {
    return this.openmrsService.post("icare/prescription", order);
    return this.getDrugOrderEncounter(
      {
        order,
        visit,
        location,
        provider,
      },
      orderIntention
    ).pipe(
      switchMap((drugOrderEncounter) => {
        return from(
          this.api.order.createOrder({
            ...order,
            encounter: drugOrderEncounter.uuid,
          } as any)
        );
      })
    );
  }

  updateDrugOrder(order): Observable<any> {
    return from(this.openmrsService.put("order/" + order.uuid, order)).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getDrugOrderEncounter(
    orderDetails: {
      order: DrugOrderObject;
      visit: Visit;
      location: string;
      provider: any;
    },
    orderIntention: OrderIntention
  ): Observable<any> {
    const { visit, order, provider, location } = orderDetails;

    const encounterID = `${order.patient}_${location}_${orderIntention}`;

    if (this._encounterEntities[encounterID]) {
      return of(this._encounterEntities[encounterID]).pipe(
        catchError((error) => {
          return of(error);
        })
      );
    }

    return this.getOrderEncounterType(orderIntention).pipe(
      switchMap((encounterTypeResponse: any) => {
        const encounterDetails = {
          visit: visit?.uuid,
          patient: order.patient,
          location,
          encounterType: encounterTypeResponse
            ? encounterTypeResponse.uuid
            : "28ac28e3-e8a6-45f3-ae42-ec3d664a955b",
          encounterProviders: [
            {
              provider: order?.orderer,
              // TODO: Find best way to get encounter provider details
              encounterRole: "240b26f9-dd88-4172-823d-4a8bfeb7841f",
            },
          ],
        };

        return from(
          this.api.encounter.createEncounter(encounterDetails as any)
        ).pipe(
          tap((encounterResponse) => {
            this._encounterEntities[encounterID] = encounterResponse;
          }),
          catchError((error) => {
            return of(error);
          })
        );
      })
    );
  }

  getOrderType(): Observable<any> {
    return from(
      this.api.systemsetting.getAllSystemSettings({
        q: "drugOrder.orderType",
        v: "custom:(uuid,display,property,value)" as any,
      })
    ).pipe(
      switchMap((res) => {
        const orderTypeSetting: any = res?.results ? res.results[0] : null;
        return orderTypeSetting?.value
          ? from(this.api.ordertype.getOrderType(orderTypeSetting.value)).pipe(
              catchError((error) => {
                return of(error);
              })
            )
          : of(null);
      })
    );
  }

  getOrderEncounterType(orderIntention: OrderIntention) {
    switch (orderIntention) {
      case "DISPENSE":
        return this.getDispensingEncounterType();
      case "PRESCRIBE":
        return this.getPrescriptionEncounterType();
      default:
        return of(null);
    }
  }

  getDispensingEncounterType(): Observable<any> {
    return this._encounterType?.dispensing
      ? of(this._encounterType.dispensing)
      : from(
          this.api.systemsetting.getAllSystemSettings({
            q: "drugOrder.dispensingEncounterType",
            v: "custom:(uuid,display,property,value)" as any,
          })
        ).pipe(
          switchMap((res) => {
            const orderTypeSetting: any = res?.results ? res.results[0] : null;
            return orderTypeSetting?.value
              ? from(
                  this.api.encountertype.getEncounterType(
                    orderTypeSetting.value
                  )
                )
              : of(null);
          }),
          tap((encounterType) => {
            this._encounterType.dispensing = encounterType;
          })
        );
  }

  getPrescriptionEncounterType(): Observable<any> {
    return this._encounterType.prescription
      ? of(this._encounterType.prescription)
      : from(
          this.api.systemsetting.getAllSystemSettings({
            q: "drugOrder.prescriptionEncounterType",
            v: "custom:(uuid,display,property,value)" as any,
          })
        ).pipe(
          switchMap((res) => {
            const orderTypeSetting: any = res?.results ? res.results[0] : null;
            return orderTypeSetting?.value
              ? from(
                  this.api.encountertype.getEncounterType(
                    orderTypeSetting.value
                  )
                )
              : of(null);
          }),
          tap((encounterType) => {
            this._encounterType.prescription = encounterType;
          })
        );
  }

  getDrugsConcepts() {
    return from(
      this.getSetMembersAsOptions(
        "Reference application common drug allergens",
        "full"
      )
    ).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getDosingUnit() {
    return from(this.getSetMembersAsOptions("Dosing Unit", "full")).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getOrderFrequency() {
    return from(this.getDrugOrdersFrequency("full")).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getDrugRoutes() {
    return from(
      this.getSetMembersAsOptions("Routes of administration", "full")
    ).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getDurationUnits() {
    return from(this.getConceptAnswersAsOptions("Duration units", "full")).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  getDrugOrderMetadata(
    drugOrder: DrugOrderObject,
    locations: any[],
    fromDispensing: boolean,
    doctorPrescriptionDetails: any,
    metadataConfigs: any
  ): Observable<any> {
    return zip(
      this.getOrderType(),
      this.getDosingUnit(),
      this.getOrderFrequency(),
      this.getDrugRoutes(),
      this.getDurationUnits()
    ).pipe(
      map((res) => {
        const metadata = {
          orderType: res[0],
          drugsConceptsList: [],
          dosingUnits: res[1],
          drugOrderFrequencies: res[2],
          drugRoutes: res[3],
          durationUnits: res[4],
          stockedDrugs: [],
        };

        const drugFormField = new Dropdown({
          options: [],
          key: "drug",
          id: "drug",
          value:
            metadataConfigs?.specificDrugConceptUuid && fromDispensing
              ? doctorPrescriptionDetails?.obs[
                  metadataConfigs?.specificDrugConceptUuid
                ]?.valueDrug?.uuid
              : drugOrder?.drug?.uuid,
          required: true,
          label: "Drug",
        });

        const doseField = new Textbox({
          id: "dose",
          key: "dose",
          label: "Dose",
          order: 2,
          required: true,
          type: "number",
          value: !metadataConfigs?.fromDispensing
            ? drugOrder?.dose
            : doctorPrescriptionDetails?.obs[
                metadataConfigs?.generalPrescriptionDoseConcept
              ]?.value,
        });

        const dosingUnitsField = new Dropdown({
          id: "doseUnits",
          options: (metadata.dosingUnits || []).map((dosingUnit) => ({
            id: dosingUnit.uuid,
            key: dosingUnit.uuid,
            label: dosingUnit.name,
            value: dosingUnit.uuid,
          })),
          label: "Dosing unit",
          order: 3,
          required: true,
          key: "doseUnits",
          value: !metadataConfigs?.fromDispensing
            ? drugOrder?.doseUnits
            : doctorPrescriptionDetails?.obs[
                metadataConfigs?.dosingUnitsSettings
              ]?.value?.uuid,
        });

        const freq =
          doctorPrescriptionDetails?.obs[
            metadataConfigs?.generalPrescriptionFrequencyConcept
          ]?.value?.uuid;

        const drugOrderFrequencyField = new Dropdown({
          id: "frequency",
          options: (metadata.drugOrderFrequencies || []).map(
            (orderFrequency) => ({
              id: orderFrequency.uuid,
              key: orderFrequency.uuid,
              label: orderFrequency.name,
              value: orderFrequency.uuid,
            })
          ),
          label: "Frequency",
          order: 4,
          required: true,
          key: "frequency",
          value: drugOrder?.frequency
            ? drugOrder?.frequency
            : freq?.split("AAAA")[0] + "OFAAAAAAAAAAAAAAA",
        });

        const drugRoutesField = new Dropdown({
          options: (metadata.drugRoutes || []).map((orderFrequency) => ({
            id: orderFrequency.uuid,
            key: orderFrequency.uuid,
            label: orderFrequency.name,
            value: orderFrequency.uuid,
          })),
          label: "Route",
          order: 5,
          required: true,
          key: "route",
          id: "route",
          value: !metadataConfigs.fromDispensing
            ? drugOrder?.route
            : doctorPrescriptionDetails?.obs[
                metadataConfigs?.drugRoutesSettings
              ]?.value?.uuid,
        });

        const durationUnitsFormField = new Dropdown({
          options: (metadata.durationUnits || []).map((durationUnit) => ({
            id: durationUnit.uuid,
            key: durationUnit.uuid,
            label: durationUnit.name,
            value: durationUnit.uuid,
          })),
          label: "Duration Units",
          order: 6,
          required: true,
          key: "durationUnits",
          id: "durationUnits",
          value: !metadataConfigs.fromDispensing
            ? drugOrder?.durationUnits
            : doctorPrescriptionDetails?.obs[
                metadataConfigs?.durationUnitsSettings
              ]?.value?.uuid,
        });

        const doseDurationField = new Textbox({
          key: "duration",
          id: "duration",
          label: "Duration",
          order: 2,
          required: true,
          type: "text",
          value: !metadataConfigs.fromDispensing
            ? drugOrder?.duration
            : doctorPrescriptionDetails?.obs[
                metadataConfigs?.generalPrescriptionDurationConcept
              ]?.value,
        });

        const genericNameField = new Dropdown({
          options: (metadata.drugsConceptsList || []).map((genericDrug) => ({
            id: genericDrug.uuid,
            key: genericDrug.uuid,
            label: genericDrug.name,
            value: genericDrug.uuid,
          })),
          value: drugOrder?.genericName,
          disabled: fromDispensing,
          controlType: "dropDown",
          key: "concept",
          id: "concept",
          label: "Drug name",
          required: true,
          type: "text",
        });

        const orderReasonField = new Textbox({
          value: drugOrder?.reason,
          key: "orderReason",
          id: "orderReason",
          required: false,
          label: "Reason",
          type: "text",
        });

        const instructionField = new Textbox({
          value: drugOrder?.instructions,
          key: "instructions",
          id: "instructions",
          label: "Instructions",
          required: false,
          type: "text",
        });

        const quantityField = new Textbox({
          value: drugOrder?.quantity?.toString(),
          key: "quantity",
          id: "quantity",
          label: "Quantity",
          required: true,
          type: "number",
        });

        const durationFormFields = [doseDurationField, durationUnitsFormField];
        const doseFormFields = [
          doseField,
          dosingUnitsField,
          drugOrderFrequencyField,
        ];

        return {
          ...metadata,
          drugFormField,
          doseField,
          dosingUnitsField,
          drugOrderFrequencyField,
          drugRoutesField,
          durationUnitsFormField,
          doseDurationField,
          genericNameField,
          orderReasonField,
          instructionField,
          quantityField,
          durationFormFields,
          doseFormFields,
        };
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }
}
