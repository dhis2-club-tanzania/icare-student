import { Component, Input, OnInit } from "@angular/core";
import { flatten } from "lodash";
import { Observable, of, zip } from "rxjs";
import { map } from "rxjs/operators";
import { FormValue } from "../../modules/form/models/form-value.model";
import { DrugsService } from "../../resources/drugs/services/drugs.service";
import { ConceptGet } from "../../resources/openmrs";
import { DrugOrdersService } from "../../resources/order/services";

@Component({
  selector: "app-non-drug-order-container",
  templateUrl: "./non-drug-order-container.component.html",
  styleUrls: ["./non-drug-order-container.component.scss"],
})
export class NonDrugOrderContainerComponent implements OnInit {
  @Input() drugOrderConceptDetails: ConceptGet;
  @Input() drugOrderFromDoctor: any;
  drugsAssociatedWithSetMembersOfTheGenericDrug$: Observable<any[]>;
  formData: any;
  isFormValid: boolean = false;

  errorsData: any = {};
  saving: boolean = false;
  constructor(
    private drugsService: DrugsService,
    private drugOrderService: DrugOrdersService
  ) {}

  ngOnInit(): void {
    this.drugsAssociatedWithSetMembersOfTheGenericDrug$ = zip(
      ...this.drugOrderConceptDetails?.setMembers?.map(
        (consumableGeneric: any) => {
          return this.drugsService
            .getDrugsUsingConceptUuid(consumableGeneric?.uuid)
            .pipe(map((response) => response?.results));
        }
      )
    ).pipe(map((response) => flatten(response)));
  }

  onAdd(event: Event, nonDrug: any, allNonDrugs): void {
    event.stopPropagation();
    const nonDrugOrder = {
      encounter: this.drugOrderFromDoctor?.encounter?.uuid,
      orderType: this.drugOrderFromDoctor?.orderType?.uuid,
      concept: nonDrug?.concept?.uuid,
      drug: nonDrug?.uuid,
      action: "NEW",
      urgency: this.drugOrderFromDoctor?.urgency,
      type: "prescription",
      orderer:
        this.drugOrderFromDoctor?.orderer?.uuid ||
        this.drugOrderFromDoctor?.providerUuid,
      patient: this.drugOrderFromDoctor?.patient?.uuid,
      dose: null,
      orderReason: null,
      instructions: this.formData[nonDrug?.uuid + "-remarks"]?.value,
      doseUnits: null,
      route: null,
      frequency: null,
      duration: null,
      durationUnits: null,
      careSetting:
        this.drugOrderFromDoctor?.careSetting?.display || "OUTPATIENT",
      quantity: Number(this.formData[nonDrug?.uuid]?.value) || undefined,
      quantityUnits: null,
      numRefills: 0,
    };
    this.saving = true;

    this.drugOrderService.saveDrugOrder(nonDrugOrder).subscribe((response) => {
      if (response && !response?.message) {
        this.saving = false;
        this.drugsAssociatedWithSetMembersOfTheGenericDrug$ = of(null);
        setTimeout(() => {
          this.drugsAssociatedWithSetMembersOfTheGenericDrug$ = of(allNonDrugs);
        }, 200);
      } else {
        this.saving = false;

        this.errorsData[nonDrug?.uuid] = [{ error: response }];
      }
    });
  }

  onGetFormData(formValue: FormValue): void {
    this.formData = { ...this.formData, ...formValue.getValues() };
    this.isFormValid = formValue.isValid;
  }
}
