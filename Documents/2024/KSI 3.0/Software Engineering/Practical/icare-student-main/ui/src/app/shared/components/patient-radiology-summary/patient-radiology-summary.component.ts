import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { FormValue } from "../../modules/form/models/form-value.model";
import { OrdersService } from "../../resources/order/services/orders.service";
import { Visit } from "../../resources/visits/models/visit.model";
import { VisitsService } from "../../resources/visits/services";
import { flatten, orderBy, uniqBy } from "lodash";
import { SharedConfirmationComponent } from "../shared-confirmation/shared-confirmation.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-patient-radiology-summary",
  templateUrl: "./patient-radiology-summary.component.html",
  styleUrls: ["./patient-radiology-summary.component.scss"],
})
export class PatientRadiologySummaryComponent implements OnInit {
  @Input() patientVisit: Visit;
  @Input() investigationAndProceduresFormsDetails: any;
  @Input() forConsultation: boolean;
  @Input() isInpatient: boolean;
  @Input() provider: any;
  @Input() orderTypes: any[];
  addingOrder: boolean = false;
  hasError: boolean = false;
  errors: any[] = [];
  formFields: any[];
  isFormValid: boolean = false;
  formValuesData: any = {};
  orders$: Observable<any>;
  fields: string =
    "custom:(uuid,encounters:(uuid,location:(uuid,display),encounterType,display,encounterProviders,encounterDatetime,voided,obs,orders:(uuid,display,orderer,orderType,dateActivated,orderNumber,concept,display)))";
  creatingOrdersResponse$: Observable<any>;
  formDetails: FormValue;
  @Output() updateConsultationOrder = new EventEmitter();
  constructor(
    private ordersService: OrdersService,
    private visitService: VisitsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.orders$ = this.visitService.getActiveVisitRadiologyOrders(
      this.patientVisit.uuid,
      this.fields
    );

    this.getFormFields();
  }

  getFormFields() {
    this.formFields = [
      {
        id: "radiology",
        key: "radiology",
        label: "Order",
        name: "Order",
        controlType: "dropdown",
        type: "text",
        options:
          this.investigationAndProceduresFormsDetails &&
          this.investigationAndProceduresFormsDetails?.setMembers
            ? this.getRadiologyServices(
                this.investigationAndProceduresFormsDetails?.setMembers
              )
            : [],
        conceptClass: "radiology",
        searchControlType: "searchFromOptions",
        shouldHaveLiveSearchForDropDownFields: true,
      },
      {
        id: "remarks",
        key: "remarks",
        label: "Remarks / Instructions",
        name: "Remarks / Instructions",
        controlType: "textbox",
        type: "textarea",
      },
    ];
  }

  onFormUpdate(formValues: FormValue): void {
    this.formValuesData = formValues.getValues();
    this.formDetails = formValues;
    this.isFormValid = formValues.isValid;
  }

  getRadiologyServices(departments): any {
    const procedureDepartment = ((departments || [])?.filter(
      (department) => department?.name?.toLowerCase().indexOf("radiology") === 0
    ) || [])[0];
    return !procedureDepartment
      ? []
      : uniqBy(
          orderBy(
            flatten(
              procedureDepartment?.setMembers.map((setMember) => {
                return setMember?.setMembers;
              })
            ),
            ["name"],
            ["asc"]
          ),
          "uuid"
        );
  }

  onSave(event: Event): void {
    event.stopPropagation();
    let orders = [];
    this.formDetails.clear();
    this.addingOrder = true;
    if (this.formValuesData["radiology"]) {
      orders = [
        ...orders,
        {
          concept: this.formValuesData["radiology"]?.value,
          orderType: (this.orderTypes.filter(
            (orderType) =>
              orderType?.display.toLowerCase().indexOf("radiology") === 0
          ) || [])[0]?.uuid,
          action: "NEW",
          patient: this.patientVisit?.patientUuid,
          careSetting: !this.patientVisit?.isAdmitted
            ? "OUTPATIENT"
            : "INPATIENT",
          orderer: this.provider?.uuid,
          urgency: "ROUTINE",
          instructions: this.formValuesData["remarks"]?.value,
          encounter: JSON.parse(localStorage.getItem("patientConsultation"))[
            "encounterUuid"
          ],
          type: "order",
        },
      ];
    }
    this.ordersService
      .createOrdersViaEncounter(orders)
      .subscribe((response) => {
        if (response) {
          this.addingOrder = false;
          if (!response?.error) {
            this.orders$ = this.visitService.getActiveVisitRadiologyOrders(
              this.patientVisit.uuid,
              this.fields
            );
            this.hasError = false;
            this.getFormFields();
          } else {
            this.hasError = true;
            this.errors = [
              ...this.errors,
              {
                error: response?.error,
              },
            ];
            this.getFormFields();
          }
        }
      });
    this.updateConsultationOrder.emit();
  }

  onDeleteOrder(e: Event, order: any) {
    e.stopPropagation();
    const confirmDialog = this.dialog.open(SharedConfirmationComponent, {
      width: "25%",
      data: {
        modalTitle: `Delete ${order?.concept?.display}`,
        modalMessage: `You are about to delete ${order?.concept?.display} for this patient, Click confirm to delete!`,
        showRemarksInput: true,
      },
      disableClose: false,
      panelClass: "custom-dialog-container",
    });
    confirmDialog.afterClosed().subscribe((confirmationObject) => {
      if (confirmationObject?.confirmed) {
        this.ordersService
          .voidOrderWithReason({
            ...order,
            voidReason: confirmationObject?.remarks || "",
          })
          .subscribe((response) => {
            if (!response?.error) {
              // this.reloadOrderComponent.emit();
            }
            if (response?.error) {
              this.errors = [...this.errors, response?.error];
            }
          });
      }
    });
  }
}
