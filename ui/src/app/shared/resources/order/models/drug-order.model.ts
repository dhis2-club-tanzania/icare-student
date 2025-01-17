import { find, flatten } from "lodash";
import { BillItem } from "src/app/modules/billing/models/bill-item.model";
import { Bill } from "src/app/modules/billing/models/bill.model";
import { Payment } from "src/app/modules/billing/models/payment.model";
import { PaymentStatus } from "../../../models/payment-status.model";
import { OrderAction } from "./order-action.model";

export interface DrugOrderObject {
  id?: string;
  uuid?: string;
  orderNumber?: string;
  patientUuid?: string;
  concept: any;
  dateActivated?: string;
  scheduledDate?: string;
  dateStopped?: string;
  autoExpireDate?: string;
  encounterUuid?: string;
  orderer: any;
  reason?: string;
  reasonNonCoded?: string;
  urgency: string;
  instructions?: string;
  display?: string;
  drug?: any;
  genericName?: string;
  drugUuid?: string;
  dose?: string;
  doseUnits?: string;
  frequency?: string;
  quantity: number;
  numRefills?: number;
  dosingInstructions?: string;
  duration?: string;
  durationUnits?: string;
  route: string;
  brandName?: string;
  dispenseAsWritten?: boolean;
  patient?: string;
  type?: string;
  orderType?: string;
  previousOrder?: string;
  action?: string;
  obs?: any;
  formulatedDescription?: string;
  status?: string;
  remarks?: string;
}
export class DrugOrder {
  constructor(
    public drugOrder: any,
    public bills?: Bill[],
    public payments?: Payment[]
  ) {}

  get uuid(): string {
    return this.drugOrder?.uuid;
  }

  get display(): string {
    return this.drugOrder?.display + ", " + this.drugOrder?.instructions;
  }

  get type(): string {
    return this.drugOrder?.type;
  }

  get orderType(): any {
    return this.drugOrder?.orderType;
  }

  get orderNumber(): string {
    return this.drugOrder?.orderNumber;
  }

  get dateActivated(): string {
    return this.drugOrder?.dateActivated;
  }

  get scheduledDate(): string {
    return this.drugOrder?.scheduledDate;
  }

  get dateStopped(): string {
    return this.drugOrder?.dataStopped;
  }

  get autoExpireDate(): string {
    return this.drugOrder?.autoExpireDate;
  }

  get drugUuid(): string {
    return this.drugOrder?.drug?.uuid;
  }

  get patientUuid(): string {
    return this.drugOrder?.patient?.uuid;
  }

  get patientName(): string {
    return this.drugOrder?.patient?.name;
  }

  get encounterUuid(): string {
    return this.drugOrder?.encounter?.uuid;
  }

  get paymentMode(): { display: string; uuid: string } {
    const matchedBill = (this.bills.filter(
      (bill: any) =>
        this.bill && this.bill["bill"] && bill?.id === this.bill["bill"]
    ) || [])[0];
    return matchedBill ? matchedBill["billDetails"]?.paymentMode : null;
  }

  get bill(): BillItem {
    const billItems: BillItem[] = flatten(
      (this.bills || []).map((bill: any) => {
        return bill?.items;
      })
    );
    // console.log('billItems', find(billItems, ['order.uuid', this.uuid]));
    return find(billItems, ["order.uuid", this.uuid]);
  }

  get paymentStatus(): PaymentStatus {
    // console.log('paymentMode', this.paymentMode);
    // console.log('bill', this.bill);
    // console.log('drug id', this.drugUuid);
    return this.drugOrder
      ? (this.bill && this.paymentMode?.display === "Insurance") || !this.bill
        ? PaymentStatus.PAID
        : PaymentStatus.NOT_PAID
      : PaymentStatus.NOT_CALCULATED;
  }

  get actionOptionsToHide(): string[] {
    let optionsToHide = [];

    if (this.paymentStatus !== PaymentStatus.NOT_CALCULATED) {
      optionsToHide = [...optionsToHide, "CALCULATE_PRESCRIPTION"];
    }

    if (this.paymentStatus !== PaymentStatus.PAID) {
      optionsToHide = [...optionsToHide, "DISPENSE_PRESCRIPTION"];
    }

    return optionsToHide;
  }

  get price(): number {
    return this.bill?.amount;
  }

  get concept(): { uuid: string; display: string } {
    return {
      uuid: this.drugOrder?.concept?.uuid,
      display: this.drugOrder.concept.display,
    };
  }

  get orderer(): { uuid: string; display: string } {
    return {
      uuid: this.drugOrder?.orderer?.uuid,
      display: this.drugOrder.orderer.display,
    };
  }

  get orderedBy(): string {
    return this.orderer?.display;
  }

  get drug(): any {
    return this.drugOrder?.drug;
  }

  get genericName(): string {
    return this.drugOrder?.concept?.uuid;
  }

  get dose(): string {
    return this.drugOrder?.dose;
  }

  get doseUnits(): string {
    return this.drugOrder?.doseUnits?.uuid;
  }

  get frequency(): string {
    return this.drugOrder?.frequency?.uuid;
  }

  get route(): string {
    return this.drugOrder?.route?.uuid;
  }

  get duration(): string {
    return this.drugOrder?.duration;
  }

  get durationUnits(): string {
    return this.drugOrder?.durationUnits?.uuid;
  }

  get reason(): string {
    return this.drugOrder?.orderReason;
  }

  get instructions(): string {
    return this.drugOrder?.instructions;
  }

  get quantity(): number {
    return this.drugOrder?.quantity;
  }

  get isFromDoctor(): boolean {
    return this.drugOrder?.drugUuid ? false : true;
  }

  get orderReasonNonCoded(): string {
    return this.drugOrder?.orderReasonNonCoded;
  }

  get urgency(): string {
    return this.drugOrder?.urgency;
  }

  get numRefills(): number {
    return this.drugOrder?.numRefills;
  }

  get dosingInstructions(): string {
    return this.drugOrder?.dosingInstructions;
  }

  get brandName(): string {
    return this.drugOrder?.brandName;
  }

  get dispenseAsWritten(): boolean {
    return this.drugOrder?.dispenseAsWritten;
  }

  get action(): OrderAction {
    return this.drugOrder?.action;
  }

  get asNeeded(): boolean {
    return this.drugOrder?.asNeeded;
  }

  get asNeededCondition(): string {
    return this.drugOrder?.asNeededCondition;
  }

  get providerUuid(): string {
    return this.drugOrder?.provider?.uuid;
  }

  get status(): string {
    return this.drugOrder?.status;
  }

  get remarks(): string {
    return this.drugOrder?.remarks;
  }

  toJson(): DrugOrderObject {
    return {
      id: this.uuid,
      uuid: this.uuid,
      orderNumber: this.orderNumber,
      patientUuid: this.patientUuid,
      concept: this.concept,
      dateActivated: this.dateActivated,
      scheduledDate: this.scheduledDate,
      dateStopped: this.dateStopped,
      autoExpireDate: this.autoExpireDate,
      encounterUuid: this.encounterUuid,
      orderer: this.orderer,
      reason: this.reason,
      reasonNonCoded: this.orderReasonNonCoded,
      type: this.type,
      orderType: this.orderType,
      urgency: this.urgency,
      instructions: this.instructions,
      display: this.display,
      drug: this.drug,
      genericName: this.genericName,
      drugUuid: this.drugUuid,
      dose: this.dose,
      doseUnits: this.doseUnits,
      frequency: this.frequency,
      quantity: this.quantity,
      numRefills: this.numRefills,
      dosingInstructions: this.dosingInstructions,
      duration: this.duration,
      durationUnits: this.durationUnits,
      route: this.route,
      brandName: this.brandName,
      dispenseAsWritten: this.dispenseAsWritten,
      action: this.action,
      patient: this.patientUuid,
      status: this.status,
      remarks: this.remarks,
    };
  }

  static getFormFields(metadata: {
    drugsConceptsList: any;
    dosingUnits: any;
    drugOrderFrequencies: any;
    drugRoutes: any;
    durationUnits: any;
    drugs: any;
    fromDispensing: boolean;
  }) {}

  static getOrderForSaving(
    order: any,
    includePreviousOrder: boolean = false
  ): DrugOrderObject {
    // TODO: Review drug order
    const drugOrder = {
      encounter: order?.encounterUuid,
      orderType: order?.orderType,
      concept: order.concept.uuid,
      drug: order?.drug?.uuid,
      action: order?.action || "NEW",
      urgency: order?.urgency,
      type: "prescription",
      orderer: order?.orderer?.uuid || order?.providerUuid,
      patient: order.patientUuid,
      dose: order.dose,
      orderReason: order.orderReason,
      instructions: order.instructions,
      doseUnits: order.doseUnits,
      route: order?.route,
      frequency: order?.frequency,
      duration: order?.duration,
      durationUnits: order?.durationUnits,
      careSetting: order?.careSetting || "OUTPATIENT",
      quantity: Number(order?.quantity) || undefined,
      quantityUnits: order?.doseUnits,
      numRefills: order.numRefills || 1,
      dispenseAsWritten: order.dispenseAsWritten,
      status: order?.status,
      remarks: order?.remarks,
      previousOrder: order?.previousOrder,
    };
    return drugOrder;
  }
}
