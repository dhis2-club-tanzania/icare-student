import { Component, Input, OnInit } from "@angular/core";
import { OpenmrsHttpClientService } from "../../modules/openmrs-http-client/services/openmrs-http-client.service";
import { Observable } from "rxjs";
import { Dropdown } from "../../modules/form/models/dropdown.model";
import { FormValue } from "../../modules/form/models/form-value.model";

@Component({
  selector: "app-shared-remote-patient-history",
  templateUrl: "./shared-remote-patient-history.component.html",
  styleUrl: "./shared-remote-patient-history.component.scss",
})
export class SharedRemotePatientHistoryComponent implements OnInit {
  @Input() patient: any;
  @Input() activeVisit: any;
  @Input() dataExchangeLocations: any[];
  @Input() hfrCodeLocationAttribute: string;
  selectedIdentifier: string;
  selectedHFRCode: string;
  remotePatientHistory$: Observable<any>;
  identifierFormField: any;
  locationFormField: any;
  constructor(private httpClientService: OpenmrsHttpClientService) {}

  ngOnInit(): void {
    this.selectedIdentifier = this.getPreferredIdentifier(
      this.patient?.identifiers
    );
    this.identifierFormField = new Dropdown({
      id: "identifierType",
      key: "identifierType",
      label: "Identifier Types",
      options: this.patient?.identifiers?.map((identifier: any) => {
        return {
          key: identifier?.identifierType?.display,
          name: identifier?.identifierType?.display,
          label: identifier?.identifierType?.display,
          value: identifier?.identifierType?.display,
        };
      }),
    });
    this.locationFormField = new Dropdown({
      id: "location",
      key: "location",
      label: "Health Facility",
      options: this.dataExchangeLocations?.map((location: any) => {
        return {
          key: location?.uuid,
          name: location?.display,
          label: location?.display,
          value: this.getHFRCode(location?.attributes),
        };
      }),
    });
    this.getRemoteHistory();
  }

  getHFRCode(locationAttributes: any): string {
    return (locationAttributes?.filter(
      (location: any) =>
        location?.attributeType?.uuid === this.hfrCodeLocationAttribute
    ) || [])[0]?.value;
  }

  getRemoteHistory(): void {
    this.remotePatientHistory$ = this.httpClientService.get(
      `icare/sharedrecords?id=${this.selectedIdentifier}${
        this.selectedHFRCode ? "&hfrCode=" + this.selectedHFRCode : ""
      }`
    );
  }

  onFormUpdate(formValue: FormValue): void {
    const values = formValue.getValues();
    const identifierType = values?.identifierType?.value
      ? values?.identifierType?.value
      : "MRN";
    this.selectedHFRCode = values?.location?.value;
    if (identifierType) {
      this.selectedIdentifier = this.getIdentifierByIdentifierType(
        identifierType,
        this.patient?.identifiers
      );
    }
    if (this.selectedHFRCode || this.selectedIdentifier) {
      this.getRemoteHistory();
    }
  }

  getIdentifierByIdentifierType(
    identifierType: string,
    identifiers: any[]
  ): string {
    return (identifiers?.filter(
      (identifier: any) =>
        identifier?.identifierType?.display === identifierType
    ) || [])[0]?.identifier;
  }

  getPreferredIdentifier(identifiers: any[]): string {
    return (identifiers?.filter((identifier: any) => identifier?.preferred) ||
      [])[0]?.identifier;
  }
}
