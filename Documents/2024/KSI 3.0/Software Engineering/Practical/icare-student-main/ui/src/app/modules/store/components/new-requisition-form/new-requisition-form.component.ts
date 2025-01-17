import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { RequisitionInput } from "src/app/shared/resources/store/models/requisition-input.model";
import { keyBy } from "lodash";
import { Observable } from "rxjs";
import { StockService } from "src/app/shared/resources/store/services/stock.service";
import { RequisitionService } from "src/app/shared/resources/store/services/requisition.service";
import { ConfigsService } from "src/app/shared/services/configs.service";
import { inpatientComponents } from "src/app/modules/inpatient/components";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";

@Component({
  selector: "app-new-requisition-form",
  templateUrl: "./new-requisition-form.component.html",
  styleUrls: ["./new-requisition-form.component.scss"],
})
export class NewRequisitionFormComponent implements OnInit {
  @Input() currentStore: any;
  @Input() referenceTagsThatCanRequestFromPharmacyConfigs: any;
  @Input() referenceTagsThatCanRequestFromMainStoreConfigs: any;
  @Input() mainStoreLocationTagUuid: any;
  @Input() pharmacyLocationTagUuid: any;
  @Input() stores: any;
  @Input() codeFormatSetting: any;
  @Input() existingRequisitionItem: any;
  @Input() existingRequisition: any;

  @Output() closePopup: EventEmitter<any> = new EventEmitter();;

  requisitionFields: Field<string>[];
  quantityField: Field<string>[];
  requisitionFormValue: FormValue;
  currentLocationTagsUuids: any = {};
  stockStatusForSelectedStore$: Observable<any>;
  specifiedQuantity: number;
  formData: any = {};
  targetStoreField: Dropdown[];
  storeUuid: string;
  itemUuid: string;
  requisitionObject: any;
  addingRequisitions: boolean = false;
  requisition: any;
  constructor(
    private stockService: StockService,
    private requisitionService: RequisitionService,
    private configService: ConfigsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.requisition = this.existingRequisition;
    if (localStorage.getItem('availableRequisition') && !this.requisition) {
      const availableRequisition = JSON.parse(localStorage.getItem('availableRequisition'));
      this.dialog.open(SharedConfirmationComponent, {
        width: "25%",
        data: {
          modalTitle: `Continue with last request (${availableRequisition?.code})`,
          modalMessage: `Do you want to continue with the last request with number ${availableRequisition?.code}`,
          showRemarksInput: false,
          confirmationButtonText: "Continue",
        },
      }).afterClosed().subscribe((closingObject) => {
        if (closingObject?.confirmed) {
          this.requisition = availableRequisition;
        } else {
          localStorage.removeItem("availableRequisition");
        }
        this.initializeRequisitionForm();
      });
    } else {
      this.initializeRequisitionForm();
    }
  }

  initializeRequisitionForm(){
    const keyedMainStoreRequestEligibleTags = keyBy(
      this.referenceTagsThatCanRequestFromMainStoreConfigs,
      "value"
    );
    const keyedPharmacyRequestEligibleTags = keyBy(
      this.referenceTagsThatCanRequestFromPharmacyConfigs,
      "value"
    );
    const canRequestFromMainStore =
      (
        this.currentStore?.tags?.filter(
          (tag) => keyedMainStoreRequestEligibleTags[tag?.uuid]
        ) || []
      )?.length > 0;
    const canRequestFromPharmacy =
      (
        this.currentStore?.tags?.filter(
          (tag) => keyedPharmacyRequestEligibleTags[tag?.uuid]
        ) || []
      )?.length > 0;
    this.targetStoreField = [
      new Dropdown({
        id: "targetStore",
        key: "targetStore",
        label: "Target Store",
        required: true,
        value: this.requisition?.requestedLocation?.uuid,
        options: (this.stores || [])
          .map((store) => {
            if (
              store?.uuid !== this.currentStore?.uuid &&
              ((canRequestFromMainStore &&
                (
                  store?.tags?.filter(
                    (tag) => tag?.uuid === this.mainStoreLocationTagUuid
                  ) || []
                )?.length > 0) ||
                (!canRequestFromPharmacy &&
                  (
                    store?.tags?.filter(
                      (tag) => tag?.uuid === this.pharmacyLocationTagUuid
                    ) || []
                  )?.length > 0) ||
                (canRequestFromMainStore &&
                  (
                    store?.tags?.filter(
                      (tag) => tag?.uuid === this.mainStoreLocationTagUuid
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
          })
          ?.filter((storeLocation) => storeLocation),
      }),
    ];
    this.requisitionFields = [
      new Dropdown({
        id: "requisitionItem",
        key: "requisitionItem",
        label: "Item",
        required: true,
        options: [],
        shouldHaveLiveSearchForDropDownFields: true,
        searchControlType: "billableItem",
      }),
    ];
    this.quantityField = [
      new Textbox({
        id: "quantity",
        key: "quantity",
        label: "Quantity",
        min: 1,
        required: true,
        type: "number",
        value: this.existingRequisitionItem
          ? this.existingRequisitionItem?.quantity
          : "",
      }),
    ];
  }
  onRequest(e: Event) {
    e.stopPropagation();
    this.requisitionObject = {
      requestingLocationUuid: this.currentStore?.id,
      requestedLocationUuid: this.formData?.targetStore?.value,
      items: [
        {
          itemUuid: this.formData?.requisitionItem?.value,
          quantity: parseInt(this.formData?.quantity.value, 10),
        },
      ],
    };

    this.requisitionService
      .createRequest(this.requisitionObject)
      .subscribe((response) => {
        if (response) {
          console.log("==> Response: ", response);
        }
      });
  }

  onAdd(e) {
    if (this.requisition) {
      const item = {
        item: {
          uuid: this.formData?.requisitionItem?.value,
        },
        quantity: parseInt(this.formData?.quantity.value, 10),
        requisition: {
          uuid: this.requisition?.uuid,
        },
        requisitionItemStatus: [
          {
            status: "DRAFT",
          },
        ],
      };
      this.requisitionService
        .createRequisitionItem(item)
        .subscribe((response) => {
          if (!response?.error) {
            const storedRequisition = this.requisition;
            const reserveRequisitionFields = this.requisitionFields;
            const reserveQuantityFields = this.quantityField;
            this.requisition = undefined;
            this.quantityField = [];
            this.requisitionFields = [];
            setTimeout(() => {
              this.requisition = storedRequisition; 
              this.requisitionFields = reserveRequisitionFields;
              this.quantityField = reserveQuantityFields;
            }, 100);
          }
        });
    } else {
      this.requisitionObject = {
        requestingLocation: {
          uuid: this.currentStore?.id,
        },
        requestedLocation: {
          uuid: this.formData?.targetStore?.value,
        },
        requisitionStatuses: [
          {
            status: "DRAFT",
          },
        ],
        requisitionItems: [
          {
            item: {
              uuid: this.formData?.requisitionItem?.value,
            },
            quantity: parseInt(this.formData?.quantity.value, 10),
            requisitionItemStatus: [
              {
                status: "DRAFT",
              },
            ],
          },
        ],
      };

      this.configService
        .generateCode(this.codeFormatSetting?.uuid, "requisition", 1, 5)
        .subscribe((response) => {
          if (!response?.error) {
            const requisitionObject = {
              ...this.requisitionObject,
              code: response[0] ? response[0] : "",
            };
            this.requisitionService
              .createRequisition(requisitionObject)
              .subscribe((response) => {
                if (!response?.error) {
                  this.requisition = response;
                  const reserveRequisitionFields = this.requisitionFields;
                  const reserveQuantityFields = this.quantityField;
                  this.quantityField = [];
                  this.requisitionFields = [];
                  localStorage.setItem('availableRequisition', JSON.stringify(this.requisition));
                  setTimeout(() => {
                    this.requisitionFields = reserveRequisitionFields;
                    this.quantityField = reserveQuantityFields;
                  }, 100);
                }
              });
          }
        });
    }
  }

  onUpdateItem(e: any) {
    e?.stopPropagation();
    const item = {
      item: {
        uuid: this.formData?.requisitionItem?.value?.length
          ? this.formData?.requisitionItem?.value
          : this.existingRequisitionItem?.item?.uuid,
      },
      quantity: this.formData?.quantity.value?.length
        ? parseInt(this.formData?.quantity.value, 10)
        : this.existingRequisitionItem?.quantity,
    };
    this.requisitionService
      .updateRequisitionItem(this.existingRequisitionItem?.uuid, item)
      .subscribe((response) => {
        if (!response?.error) {
          this.closePopup.emit();
        }
      });
  }

  onUpdateForm(formValue: FormValue): void {
    this.requisitionFormValue = formValue;
    this.formData = {
      ...this.formData,
      ...this.requisitionFormValue.getValues(),
    };
    this.storeUuid = formValue.getValues()?.targetStore?.value;
    this.itemUuid = formValue.getValues()?.requisitionItem?.value;
    this.specifiedQuantity = Number(formValue.getValues()?.quantity?.value);
    if (this.itemUuid && this.storeUuid) {
      this.stockStatusForSelectedStore$ =
        this.stockService.getAvailableStockOfAnItem(
          this.itemUuid,
          this.storeUuid
        );
    }
  }
}
