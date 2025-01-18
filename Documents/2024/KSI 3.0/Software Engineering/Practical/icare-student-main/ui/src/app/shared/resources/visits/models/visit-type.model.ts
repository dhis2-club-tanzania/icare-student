export class VisitType {
  constructor(private visitType: any) {}

  get uuid(): string {
    return this.visitType?.uuid;
  }

  get name(): string {
    return this.visitType?.name;
  }

  get retired(): boolean {
    return this.visitType?.retired;
  }

  toJson(): any {
    return {
      id: this.uuid,
      uuid: this.uuid,
      name: this.name,
      retired: this.retired,
    };
  }
}
