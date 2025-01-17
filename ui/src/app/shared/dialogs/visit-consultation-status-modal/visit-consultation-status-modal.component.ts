import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Dropdown } from "../../modules/form/models/dropdown.model";
import { Field } from "../../modules/form/models/field.model";
import { FormValue } from "../../modules/form/models/form-value.model";
import { ICARE_CONFIG } from "../../resources/config";
import { ObservationService } from "../../resources/observation/services";
import { EncountersService } from "../../services/encounters.service";

@Component({
  selector: "app-visit-consultation-status-modal",
  templateUrl: "./visit-consultation-status-modal.component.html",
  styleUrls: ["./visit-consultation-status-modal.component.scss"],
})
export class VisitConsultationStatusModalComponent implements OnInit {
  dialogData: any;
  saving: boolean = false;

  formField: Field<string>;
  isFormValid: boolean = false;
  formData: any = {};
  shouldConfirm: boolean = false;
  errors: any[];
  constructor(
    private dialogRef: MatDialogRef<VisitConsultationStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private encounterService: EncountersService,
    private observationService: ObservationService
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
    this.formField = new Dropdown({
      id: this.dialogData?.uuid,
      key: this.dialogData?.uuid,
      label: this.dialogData?.display,
      required: true,
      options: this.dialogData?.answers?.map((answer) => {
        return {
          value: answer?.uuid,
          label: answer?.display,
          key: answer?.uuid,
          name: answer?.display,
        };
      }),
    });
  }

  onFormUpdate(formValues: FormValue): void {
    this.isFormValid = formValues.isValid;
    this.formData = formValues.getValues();
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onSave(event: Event, confirmed?: boolean): void {
    event.stopPropagation();
    if (confirmed) {
      this.shouldConfirm = false;
      this.saving = true;
      const data = {
        encounterType: this.dialogData?.consultationEncounterType,
        patient: this.dialogData?.patient?.uuid,
        location: this.dialogData?.location?.uuid,
        encounterProviders: [
          {
            provider: this.dialogData?.provider?.uuid,
            encounterRole: ICARE_CONFIG?.encounterRole?.uuid,
          },
        ],
        orders: [],
        obs: [
          {
            concept: this.dialogData?.uuid,
            value: this.formData[this.dialogData?.uuid]?.value,
            obsDatetime: new Date(),
            person: this.dialogData?.patient?.uuid,
          },
        ],
        visit: this.dialogData?.visit?.uuid,
      };
      this.encounterService.createEncounter(data).subscribe((response) => {
        if (response && !response?.error) {
          this.saving = false;
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 200);
        } else {
          this.errors = [response];
          this.saving = false;
        }
      });
    } else {
      this.shouldConfirm = true;
    }
  }
}
