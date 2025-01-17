export class VisitAttribute {
  constructor(private visitAttributeDetails: any) {}
  get uuid(): string {
    return this.visitAttributeDetails?.uuid;
  }

  get display(): string {
    return this.visitAttributeDetails?.display;
  }

  get value(): string {
    return this.visitAttributeDetails?.value;
  }

  get attributeType(): { uuid: string; display: string } {
    return {
      uuid: this.visitAttributeDetails?.attributeType?.uuid,
      display: this.visitAttributeDetails?.attributeType?.display,
    };
  }
}
