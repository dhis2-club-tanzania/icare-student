export class Admission {
  constructor(private admissionLocation: any) {}

  get uuid(): string {
    return this.admissionLocation?.uuid;
  }

  get beds(): any[] {
    this.admissionLocation;
    return [];
  }
}
