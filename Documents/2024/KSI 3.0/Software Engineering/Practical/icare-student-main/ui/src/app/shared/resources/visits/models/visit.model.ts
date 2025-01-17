import { VisitType } from "./visit-type.model";
import { flatten, groupBy, keys } from "lodash";
import { LabOrder } from "./lab-order.model";
import { Observation } from "../../observation/models/observation.model";
import { VisitObject } from "./visit-object.model";
import { Diagnosis } from "../../diagnosis/models/diagnosis.model";
import { VisitAttribute } from "./visit-attribute.model";
import { Patient } from "../../patient/models/patient.model";
import { RadiologyOrder } from "./radiology-order.model";
import { ProcedureOrder } from "./procedure-order.model";
import { filter } from "lodash";
import { DrugOrder } from "src/app/shared/resources/order/models/drug-order.model";
import * as moment from "moment";
import { ICARE_CONFIG } from "../../config";
import { Observable, of } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { Bill } from "src/app/modules/billing/models/bill.model";
import { Payment } from "src/app/modules/billing/models/payment.model";
import { OtherOrder } from "./other-orders.model";

export class Visit {
  // TODO: Need to find best way to type incoming patient
  constructor(
    public visit: any,
    public bills?: Bill[],
    public payments?: Payment[]
  ) {}

  get uuid(): string {
    return this.visit?.uuid;
  }

  get isEmergency(): boolean {
    let emergencyAttributeArray = filter(
      this.visit?.attributes || [],
      (attribute) => {
        return attribute?.attributeType?.display == "EmergencyVisit";
      }
    );

    return emergencyAttributeArray?.length > 0 ? true : false;
  }

  get visitType(): VisitType {
    return new VisitType(this.visit?.visitType);
  }

  get visitTypeName(): string {
    return this.visitType?.name;
  }

  get visitStartTime(): string {
    return moment(this.visit.startDatetime).format("MMMM Do YYYY, h:mm:ss a");
  }

  get visitStopTime(): string {
    return moment(this.visit.stopDatetime).format("MMMM Do YYYY, h:mm:ss a");
  }

  get patient(): Patient {
    return new Patient(this.visit?.patient);
  }

  get patientUuid(): string {
    return this.visit?.patient?.uuid;
  }

  get patientName(): string {
    return this.visit?.patient?.display;
  }

  get patientGender(): string {
    return this.patient?.gender;
  }

  get patientAge(): string {
    return this.patient?.age;
  }

  get encounters(): any {
    return this.visit?.encounters;
  }

  get startDate(): string {
    return this.visit?.startDatetime;
  }

  get stopDate(): string {
    return this.visit?.stopDatetime;
  }

  get location(): {
    uuid: string;
    parentLocation: any;
    display: string;
    tags: any[];
  } {
    return {
      uuid: this.visit?.location?.uuid,
      parentLocation: this.visit?.location?.parentLocation,
      display: this.visit?.location?.display,
      tags: this.visit?.location?.tags,
    };
  }

  get locationName(): string {
    return this.location.display;
  }

  get isAdmitted(): boolean {
    /**
     * TODO: Remove this hard coded filter
     */
    return this.location?.tags.some((tag) => tag?.name === "Bed Location");
  }

  get waitingToBeAdmitted(): boolean {
    // TODO: Softcode tag name and admission encounter type uuid
    return (
      !this.location?.tags.some((tag) => tag?.name === "Bed Location") &&
      (
        this.visit.encounters.filter(
          (encounter) =>
            encounter?.encounterType?.uuid ===
            "e22e39fd-7db2-45e7-80f1-60fa0d5a4378"
        ) || []
      ).length > 0
    );
  }

  get attributes(): VisitAttribute[] {
    return (this.visit?.attributes || []).map(
      (attribute) => new VisitAttribute(attribute)
    );
  }

  get patientProfileAttributes(): any[] {
    return this.attributes.filter(
      (attribute) =>
        attribute.attributeType.uuid ===
          "PSCHEME0IIIIIIIIIIIIIIIIIIIIIIIATYPE" ||
        attribute.attributeType.uuid ===
          "INSURANCEAUTHNOIIIIIIIIIIIIIIIIATYPE" ||
        attribute.attributeType.uuid ===
          "INSURANCEIDIIIIIIIIIIIIIIIIIIIIATYPE" ||
        attribute.attributeType.uuid === "INSURANCEIIIIIIIIIIIIIIIIIIIIIIATYPE"
    );
  }

  get isEnsured(): boolean {
    return (
      (
        this.visit.attributes.filter((attribute) => {
          if (
            (attribute?.attributeType &&
              attribute?.attributeType?.uuid &&
              attribute?.attributeType?.uuid ===
                "INSURANCEIDIIIIIIIIIIIIIIIIIIIIATYPE") ||
            (attribute.display &&
              attribute.display.indexOf("Insurance ID") > -1)
          ) {
            return attribute;
          }
        }) || []
      )?.length > 0
    );
  }

  get billingOrders(): DrugOrder[] {
    return flatten(
      (this.encounters || []).map((encounter) => encounter?.orders)
    )
      .filter(
        (order) =>
          order?.orderType?.uuid === "BIL00000IIIIIIIIIIIIIIIIIIIIIIIOTYPE"
      )
      .map((order) => new DrugOrder(order, this.bills, this.payments));
  }

  get drugOrders(): DrugOrder[] {
    return flatten(
      (this.encounters || []).map((encounter) => encounter?.orders)
    )
      .filter(
        (order) =>
          order && order.orderType?.display.toLowerCase() === "prescription"
      )
      .map((order) => new DrugOrder(order, this.bills, this.payments));
  }

  get dispensingDrugOrders(): DrugOrder[] {
    const groupedOrders = groupBy(this.drugOrders, "concept.uuid");
    return keys(groupedOrders)
      .map((conceptUuid) => {
        const groupedDrugOrders = groupedOrders[conceptUuid] || [];
        if (groupedDrugOrders.length === 1) {
          return groupedDrugOrders[0];
        }

        return groupedDrugOrders.filter((order) => order.uuid)[0];
      })
      .filter((order) => order);
  }

  get dispensingDrugOrderTableList(): MatTableDataSource<DrugOrder> {
    return new MatTableDataSource(this.dispensingDrugOrders);
  }

  get dispensingDrugOrderTableList$(): Observable<
    MatTableDataSource<DrugOrder>
  > {
    return of(this.dispensingDrugOrderTableList);
  }

  get drugOrderTableList(): MatTableDataSource<DrugOrder> {
    return new MatTableDataSource(this.drugOrders);
  }

  get drugOrderTableList$(): Observable<MatTableDataSource<DrugOrder>> {
    return of(this.drugOrderTableList);
  }

  get drugOrderCount(): number {
    return this.drugOrders?.length;
  }

  get labOrders(): LabOrder[] {
    return flatten(
      (this.encounters || []).map((encounter) => {
        return encounter?.orders.map((order) => {
          return {
            ...order,
            encounter: encounter,
            location: encounter?.location,
          };
        });
      })
    )
      .filter(
        (order) =>
          order &&
          order.type === "testorder" &&
          !order?.dateStopped &&
          !order?.previousOrder &&
          !order?.voided
      )
      .map((order) => new LabOrder(order));
  }

  get radiologyOrders(): RadiologyOrder[] {
    return flatten(
      (this.encounters || []).map((encounter) => encounter?.orders)
    )
      .filter(
        (order) =>
          order &&
          order?.orderType?.name.toLowerCase() === "radiology order" &&
          !order?.dateStopped &&
          !order?.previousOrder
      )
      .map((order) => new RadiologyOrder(order));
  }

  get procedureOrders(): ProcedureOrder[] {
    return flatten(
      (this.encounters || []).map((encounter) => {
        return encounter?.orders.map((order) => {
          return { ...order, location: encounter?.location };
        });
      })
    )
      .filter(
        (order) =>
          order &&
          order?.orderType?.name.toLowerCase() === "procedure order" &&
          !order?.dateStopped &&
          !order?.previousOrder
      )
      .map((order) => new ProcedureOrder(order));
  }

  get otherOrders(): any[] {
    return flatten(
      (this.encounters || []).map((encounter) => {
        return encounter?.orders.map((order) => {
          return { ...order, location: encounter?.location };
        });
      })
    )
      .filter(
        (order) =>
          order &&
          order?.orderType?.name.toLowerCase() !== "procedure order" &&
          order?.orderType?.name.toLowerCase() !== "radiology order" &&
          order.type !== "testorder" &&
          !order?.dateStopped &&
          !order?.previousOrder
      )
      .map((order) => new OtherOrder(order));
  }

  get observations(): Observation[] {
    return flatten(
      flatten(
        this.encounters?.map((encounter) =>
          (encounter?.obs || []).map((observation) => {
            const encounterProvider = encounter?.encounterProviders[0];
            const formattedObs = {
              ...observation,
              encounterProvider: {
                ...encounterProvider?.provider,
                name:
                  encounterProvider?.provider &&
                  encounterProvider?.provider?.display?.indexOf(":") > -1
                    ? encounterProvider?.provider?.display?.split(":")[0]
                    : encounterProvider?.provider?.display?.split("- ")[1],
              },
              encounterType: encounter.encounterType,
            };
            return formattedObs;
          })
        )
      )
    ).map((observation) => new Observation(observation));
  }

  get diagnoses(): Diagnosis[] {
    return flatten(
      (this.encounters || []).map((encounter) => encounter?.diagnoses)
    ).map((diagnosis) => new Diagnosis(diagnosis));
  }

  get markedAsDead(): boolean {
    const matchedDeathEncounters =
      this.encounters.filter(
        (encounter) =>
          encounter?.encounterType?.uuid ===
          ICARE_CONFIG.death.encounterType.uuid
      ) || [];
    return matchedDeathEncounters?.length == 0
      ? false
      : (
          matchedDeathEncounters.filter(
            (matchedDeathEncounter) => matchedDeathEncounter?.obs?.length > 0
          ) || []
        )?.length == 0
      ? false
      : true;
  }

  get paymentType(): string {
    return this.visit.paymentType;
  }

  get transferedOutSide(): boolean {
    // TODO: Find a better way to softcode encounter type
    return (
      (
        (this.encounters || []).filter(
          (encounter) => encounter?.encounterType?.display === "referto"
        ) || []
      )?.length > 0
    );
  }

  get transferToEncounterDetails(): any {
    // TODO: Find a better way to softcode encounter type
    return ((this.encounters || []).filter(
      (encounter) => encounter?.encounterType?.display === "referto"
    ) || [])[0];
  }

  get consultationStarted(): boolean {
    // TODO: order type uuid should be softcoded
    return (
      (
        (this.encounters || []).filter(
          (encounter) =>
            (
              encounter?.orders.filter(
                (order) =>
                  order?.accessionNumber &&
                  order?.orderType?.uuid ===
                    "iCARESTS-ADMS-1111-1111-525400e4297f"
              ) || []
            ).length > 0
        ) || []
      )?.length > 0
    );
  }

  get consultationStatusOrder(): boolean {
    const encounter = ((this.encounters || []).filter(
      (encounter) =>
        (
          encounter?.orders.filter(
            (order) =>
              order?.orderType?.uuid === "iCARESTS-ADMS-1111-1111-525400e4297f"
          ) || []
        ).length > 0
    ) || [])[0];
    return encounter
      ? (encounter?.orders.filter(
          (order) =>
            order?.orderType?.uuid === "iCARESTS-ADMS-1111-1111-525400e4297f"
        ) || [])[0]
      : null;
  }

  get hasProvisonalDiagnosis(): boolean {
    const diagnoses = this.diagnoses;
    return diagnoses.length > 0
      ? (
          diagnoses.filter(
            (diagnosis) =>
              diagnosis["diagnosisDetails"]["certainty"] &&
              !diagnosis["diagnosisDetails"].voided
          ) || []
        )?.length > 0
      : false;
  }

  get hasConfirmedDiagnosis(): boolean {
    const diagnoses = this.diagnoses;
    return diagnoses.length > 0
      ? (
          diagnoses.filter(
            (diagnosis: any) =>
              diagnosis?.diagnosisDetails?.certainty === "CONFIRMED" &&
              !diagnosis?.diagnosisDetails?.voided
          ) || []
        )?.length > 0
      : false;
  }

  toJson(): VisitObject {
    return {
      id: this.uuid,
      uuid: this.uuid,
      visitType: this.visitType?.toJson(),
      attributes: this.attributes,
      patientUuid: this.patientUuid,
      encounters: this.encounters,
      location: this.location,
      labOrders: this.labOrders,
      startDate: this.startDate,
      stopDate: this.stopDate,
      isAdmitted: this.isAdmitted,
      waitingToBeAdmitted: this.waitingToBeAdmitted,
      radiologyOrders: this.radiologyOrders,
      procedureOrders: this.procedureOrders,
      otherOrders: this.otherOrders,
      isEmergency: this.isEmergency,
      markedAsDead: this.markedAsDead,
      isEnsured: this.isEnsured,
      paymentType: this.paymentType,
      transferedOutSide: this.transferedOutSide,
      transferToEncounterDetails: this.transferToEncounterDetails,
      patientProfileAttributes: this.patientProfileAttributes,
      consultationStarted: this.consultationStarted,
      consultationStatusOrder: this.consultationStatusOrder,
      hasProvisonalDiagnosis: this.hasProvisonalDiagnosis,
      hasConfirmedDiagnosis: this.hasConfirmedDiagnosis,
      observations: this.observations,
      drugOrders: this.drugOrders,
    };
  }

  static toTableData(visits: Visit[]): MatTableDataSource<Visit> {
    return new MatTableDataSource(visits);
  }

  static getVisitWithDrugOrders(
    openmrsApi
  ): Observable<MatTableDataSource<Visit>> {
    return new Observable((observer) => {
      openmrsApi.visit
        .getAllVisits({
          includeInactive: false,
          v: "custom:(uuid,visitType,startDatetime,stopDatetime,encounters:(orders),attributes:(uuid,display),location:(uuid,display,tags,parentLocation:(uuid,display)),patient:(uuid,display,identifiers,person,voided)",
        } as any)
        .then((visitResponse: any) => {
          const visits = (visitResponse.results || [])
            .map((visit) => new Visit(visit))
            .filter((visit: Visit) => visit?.drugOrders?.length > 0);
          observer.next(Visit.toTableData(visits));
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  static getVisitWithBillingOrders(
    openmrsApi
  ): Observable<MatTableDataSource<Visit>> {
    return new Observable((observer) => {
      openmrsApi.visit
        .getAllVisits({
          includeInactive: false,
          v: "custom:(uuid,visitType,startDatetime,stopDatetime,encounters:(orders),attributes:(uuid,display),location:(uuid,display,tags,parentLocation:(uuid,display)),patient:(uuid,display,identifiers,person,voided)",
        } as any)
        .then((visitResponse: any) => {
          const visits = (visitResponse.results || [])
            .map((visit) => new Visit(visit))
            .filter((visit: Visit) => visit?.billingOrders?.length > 0);
          observer.next(Visit.toTableData(visits));
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}

export class VisitExt extends Visit {
  constructor(
    public visit: any,
    public bills?: Bill[],
    public payments?: Payment[]
  ) {
    super(visit);
  }

  get uuid(): string {
    return this.visit?.uuid;
  }

  get isEmergency(): boolean {
    let emergencyAttributeArray = filter(
      this.visit?.attributes || [],
      (attribute) => {
        return attribute?.attributeType?.display == "EmergencyVisit";
      }
    );

    return emergencyAttributeArray?.length > 0 ? true : false;
  }

  get patient(): Patient {
    return new Patient(this.visit?.visit?.patient);
  }

  get patientUuid(): string {
    return this.visit.visit.patient.uuid;
  }

  get patientName(): string {
    return this.visit?.patient?.name;
  }

  get patientGender(): string {
    return this.patient?.gender;
  }
}
