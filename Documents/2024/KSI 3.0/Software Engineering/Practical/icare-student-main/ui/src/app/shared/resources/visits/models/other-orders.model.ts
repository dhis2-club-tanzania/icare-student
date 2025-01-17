export class OtherOrder {
  constructor(private order: any) {}

  get uuid(): string {
    return this.order?.uuid;
  }

  get id(): string {
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
  get orderType(): string {
    return this.order?.orderType?.display;
  }

  get orderInstructions(): string {
    return this.order?.instructions;
  }

  get orderTypeDetails(): any {
    return this.order?.orderType;
  }

  get dateActivated(): string {
    return this.order?.dateActivated;
  }

  get dateStopped(): string {
    return this.order?.dateStopped;
  }

  get careSetting(): any {
    return this.order?.careSetting;
  }

  get action(): string {
    return this.order?.action;
  }

  get orderReason(): string {
    return this.order?.orderReason;
  }

  get urgency(): string {
    return this.order?.urgency;
  }

  toJson(): any {
    return {
      id: this.uuid,
      uuid: this.uuid,
      orderNumber: this.orderNumber,
      patientUuid: this.patientUuid,
      concept: this.concept,
      encounterUuid: this.encounterUuid,
      orderer: this.orderer,
      orderType: this.orderType,
      display: this.display,
      type: this.type,
      instructions: this.orderInstructions,
      orderTypeDetails: this.orderTypeDetails,
      dateActivated: this.dateActivated,
      dateStopped: this.dateStopped,
      careSetting: this.careSetting,
      action: this.action,
      orderReason: this.orderReason,
      urgency: this.urgency,
    };
  }
}
