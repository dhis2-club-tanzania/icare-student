import { Component, Input, OnInit } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Observable } from "rxjs";
import { AdditionalFieldsService } from "../../resources/services/additional-fields.service";
import { flatten } from "lodash";
import { map } from "rxjs/operators";

@Component({
  selector: "app-define-additional-data-fields",
  templateUrl: "./define-additional-data-fields.component.html",
  styleUrls: ["./define-additional-data-fields.component.scss"],
})
export class DefineAdditionalDataFieldsComponent implements OnInit {
  additionalFields$: Observable<any>;
  selectedFields: any = {};
  @Input() worksheet: any;
  allocations: any[] = [];
  readyToSave: boolean = false;
  saving: boolean = false;
  constructor(private additionalFieldsService: AdditionalFieldsService) {}

  ngOnInit(): void {
    this.getAdditionalFields();
    this.allocations = flatten(
      this.worksheet?.worksheetSamples?.map((worksheetSample: any) => {
        return worksheetSample?.sample?.allocations;
      })
    )?.filter((allocation) => allocation);
  }

  getAdditionalFields(): void {
    this.additionalFields$ = this.additionalFieldsService.getAdditionalFields();
  }

  onChooseItem(event: MatCheckboxChange, field: any): void {
    this.selectedFields[field?.uuid] = event?.checked ? field : null;
    this.readyToSave =
      (
        Object.keys(this.selectedFields).filter(
          (key) => this.selectedFields[key]
        ) || []
      )?.length > 0;
  }

  onAdd(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    let testAllocationAssociatedFields = [];
    Object.keys(this.selectedFields).forEach((key) => {
      if (this.selectedFields[key]) {
        testAllocationAssociatedFields = this.allocations?.map((allocation) => {
          return {
            testAllocation: {
              uuid: allocation?.uuid,
            },
            associatedField: {
              uuid: key,
            },
          };
        });
      }
    });
    this.additionalFieldsService
      .createTestAllocationAssociatedFields(testAllocationAssociatedFields)
      .subscribe((response) => {
        if (response && !response?.error) {
          this.saving = false;
          this.getAdditionalFields();
        } else {
          this.saving = false;
        }
      });
  }
}
