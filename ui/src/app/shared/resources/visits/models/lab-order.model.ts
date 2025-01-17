export class LabOrder {
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

  get orderDate(): string {
    return this.order?.dateActivated.substring(0, 10);
  }

  get orderTime(): string {
    return this.order?.dateActivated.substring(11, 19);
  }

  get dateActivated(): string {
    return this.order?.dateActivated;
  }

  get location(): any {
    return {
      ...this.order?.location,
      isBed:
        (
          this.order?.location?.tags.filter(
            (tag) => tag?.display === "Bed Location"
          ) || []
        )?.length > 0,
    };
  }

  get careSetting(): any {
    return this.order?.careSetting;
  }

  get action(): string {
    return this.order?.action;
  }

  get orderHasResult(): boolean {
    return (
      this.order.encounter?.obs.filter(
        (observation) =>
          observation?.display?.split(":")[0] === this.order?.display
      ) || []
    ).legth > 0
      ? true
      : false;
  }

  get accessionNumber(): string {
    return this.order?.accessionNumber;
  }

  get fulfillerStatus(): string {
    return this.order?.fulfillerStatus;
  }

  get voided(): boolean {
    return this.order?.voided;
  }

  get orderInstructions(): string {
    return this.order?.instructions;
  }

  get dateStopped(): string {
    return this.order?.dateStopped;
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
      orderHasResult: this.orderHasResult,
      display: this.display,
      type: this.type,
      action: this.action,
      orderDate: this.orderDate,
      orderTime: this.orderTime,
      location: this.location,
      careSetting: this.careSetting,
      accessionNumber: this.accessionNumber,
      fulfillerStatus: this.fulfillerStatus,
      voided: this.voided,
      dateActivated: this.dateActivated,
      dateStopped: this.dateStopped,
      orderInstructions: this.orderInstructions,
    };
  }
}
