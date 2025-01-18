import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { RequisitionInput } from "src/app/shared/resources/store/models/requisition-input.model";
import { keyBy } from "lodash";
import { Observable } from "rxjs";
import { StockService } from "src/app/shared/resources/store/services/stock.service";

@Component({
  selector: "app-requisition-form",
  templateUrl: "./requisition-form.component.html",
  styleUrls: ["./requisition-form.component.scss"],
})
export class RequisitionFormComponent implements OnInit {
  requisitionFields: Field<string>[];
  quantityField: Field<string>;
  requisitionFormValue: FormValue;
  currentLocationTagsUuids: any = {};
  stockStatusForSelectedStore$: Observable<any>;
  specifiedQuantity: number;
  formData: any = {};
  constructor(
    private dialogRef: MatDialogRef<RequisitionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockService: StockService
  ) {}

  ngOnInit() {
    const keyedMainStoreRequestEligibleTags = keyBy(
      this.data?.referenceTagsThatCanRequestFromMainStoreConfigs,
      "value"
    );
    const keyedPharmacyRequestEligibleTags = keyBy(
      this.data?.referenceTagsThatCanRequestFromPharmacyConfigs,
      "value"
    );
    const canRequestFromMainStore =
      (
        this.data?.currentStore?.tags?.filter(
          (tag) => keyedMainStoreRequestEligibleTags[tag?.uuid]
        ) || []
      )?.length > 0;
    const canRequestFromPharmacy =
      (
        this.data?.currentStore?.tags?.filter(
          (tag) => keyedPharmacyRequestEligibleTags[tag?.uuid]
        ) || []
      )?.length > 0;
    this.requisitionFields = [
      new Dropdown({
        id: "requisition_item",
        key: "requisitionItem",
        label: "Item",
        required: true,
        options: [],
        shouldHaveLiveSearchForDropDownFields: true,
        searchControlType: "billableItem",
      }),
      new Dropdown({
        id: "target_store",
        key: "targetStore",
        label: "Target Store",
        required: true,
        options: (this.data?.stores || [])
          .map((store) => {
            if (
              store?.uuid !== this.data?.currentStore?.uuid &&
              ((canRequestFromMainStore &&
                (
                  store?.tags?.filter(
                    (tag) => tag?.uuid === this.data?.mainStoreLocationTagUuid
                  ) || []
                )?.length > 0) ||
                (!canRequestFromPharmacy &&
                  (
                    store?.tags?.filter(
                      (tag) => tag?.uuid === this.data?.pharmacyLocationTagUuid
                    ) || []
                  )?.length > 0) ||
                (canRequestFromMainStore &&
                  (
                    store?.tags?.filter(
                      (tag) => tag?.uuid === this.data?.mainStoreLocationTagUuid
                    ) || []
                  )?.length === 0 &&
                  (
                    store?.tags?.filter(
                      (tag) => keyedPharmacyRequestEligibleTags[tag?.uuid]
                    ) || []
                  )?.length > 0))
            ) {
              return {
                key: store.id,
                value: store.id,
                label: store.name,
              };
            }
            // return {
            //   key: store.id,
            //   value: store.id,
            //   label: store.name,
            // };
          })
          ?.filter((storeLocation) => storeLocation),
      }),
    ];
    this.quantityField = new Textbox({
      id: "quantity",
      key: "quantity",
      label: "Quantity",
      min: 1,
      required: true,
      type: "number",
    });
  }

  onCancel(e: Event): void {
    e.stopPropagation();
    this.dialogRef.close();
  }

  onRequest(e: Event) {
    e.stopPropagation();
    const requisitionInput: any = {
      requestingLocationUuid: this.data?.currentStore?.id,
      requestedLocationUuid: this.formData?.targetStore?.value,
      items: [
        {
          itemUuid: this.formData?.requisitionItem?.value,
          quantity: parseInt(this.formData?.quantity.value, 10),
        },
      ],
    };

    this.dialogRef.close({ requisitionInput });
  }

  onUpdateForm(formValue: FormValue): void {
    this.requisitionFormValue = formValue;
    this.formData = {
      ...this.formData,
      ...this.requisitionFormValue.getValues(),
    };
    const storeUid = formValue.getValues()?.targetStore?.value;
    const itemUuid = formValue.getValues()?.requisitionItem?.value;
    this.specifiedQuantity = Number(formValue.getValues()?.quantity?.value);
    if (itemUuid && storeUid) {
      this.stockStatusForSelectedStore$ =
        this.stockService.getAvailableStockOfAnItem(itemUuid, storeUid);
    }
  }
}
