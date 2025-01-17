export class DrugOrderOld {
  constructor(private order: any) {}

  get uuid(): string {
    return this.order?.uuid;
  }

  get display(): string {
    return this.order?.display;
  }

  get type(): string {
    return this.order?.type;
  }

  get orderNumber(): string {
    return this.order?.orderNumber;
  }

  get dateActivated(): string {
    return this.order?.dateActivated;
  }

  get scheduledDate(): string {
    return this.order?.scheduledDate;
  }

  get dateStopped(): string {
    return this.order?.dataStopped;
  }

  get autoExpireDate(): string {
    return this.order?.autoExpireDate;
  }

  get patientUuid(): string {
    return this.order?.patient?.uuid;
  }

  get encounterUuid(): string {
    return this.order?.encounter?.uuid;
  }

  get concept(): { uuid: string; display: string } {
    return {
      uuid: this.order?.concept?.uuid,
      display: this.order.concept.display,
    };
  }

  get orderer(): { uuid: string; display: string } {
    return {
      uuid: this.order?.orderer?.uuid,
      display: this.order.orderer.display,
    };
  }

  get orderReason(): string {
    return this.order?.orderReason;
  }
  get orderReasonNonCoded(): string {
    return this.order?.orderReasonNonCoded;
  }
  get orderType(): string {
    return this.order?.orderType?.display;
  }
  get urgency(): string {
    return this.order?.urgency;
  }

  get instructions(): string {
    return this.order?.instructions;
  }
  get drugUuid(): string {
    return this.order?.drug;
  }
  get dose(): number {
    return Number(this.order?.dose);
  }
  get doseUnits(): { uuid: string; display: string } {
    return {
      uuid: this.order?.doseUnits?.uuid,
      display: this.order?.doseUnits?.display,
    };
  }
  get frequency(): { uuid: string; display: string } {
    return {
      uuid: this.order?.frequency?.uuid,
      display: this.order?.frequency?.display,
    };
  }
  get quantity(): number {
    return Number(this.order?.quantity);
  }
  get numRefills(): number {
    return this.order?.numRefills;
  }
  get dosingInstructions(): string {
    return this.order?.dosingInstructions;
  }
  get duration(): number {
    return this.order?.duration;
  }
  get durationUnits(): any {
    return this.order?.durationUnits;
  }
  get route(): { uuid: string; display: string } {
    return {
      uuid: this.order?.route?.uuid,
      display: this.order?.route?.display,
    };
  }
  get brandName(): string {
    return this.order?.brandName;
  }

  get dispenseAsWritten(): boolean {
    return this.order?.dispenseAsWritten;
  }

  toJson(): any {
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
      orderReason: this.orderReason,
      orderReasonNonCoded: this.orderReasonNonCoded,
      orderType: this.orderType,
      urgency: this.urgency,
      instructions: this.instructions,
      display: this.display,
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
      type: this.type,
    };
  }
}
