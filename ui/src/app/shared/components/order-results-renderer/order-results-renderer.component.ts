import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { keyBy, flatten, orderBy, uniqBy } from "lodash";
import { Observable } from "rxjs";
import {
  createLabOrders,
  deleteLabOrder,
  voidOrder,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getCreatingLabOrderState,
  getLabOrderVoidingState,
} from "src/app/store/selectors";
import { FormValue } from "../../modules/form/models/form-value.model";
import { InvestigationProcedureService } from "../../resources/investigation-procedure/services/investigation-procedure.service";
import { OrdersService } from "../../resources/order/services/orders.service";
import { Visit } from "../../resources/visits/models/visit.model";
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";
import { SharedConfirmationComponent } from "../shared-confirmation/shared-confirmation.component";

@Component({
  selector: "app-order-results-renderer",
  templateUrl: "./order-results-renderer.component.html",
  styleUrls: ["./order-results-renderer.component.scss"],
})
export class OrderResultsRendererComponent implements OnInit {
  @Input() labOrdersResultsInformation: any[];
  @Input() testSetMembersDetails: any;
  @Input() codedResultsData: any;
  @Input() observationsKeyedByConcept: any;
  @Input() forConsultation: boolean;
  @Input() isInpatient: boolean;
  @Input() investigationAndProceduresFormsDetails: any;
  @Input() visit: Visit;
  @Input() orderTypes: any[];
  @Input() provider: any;
  @Input() iCareGeneralConfigurations: any;
  // TODO: Softcode department for common lab tests
  @Input() commonLabTestsConceptReference: string =
    "26172ff2-c058-44a9-8b09-980b24f6e973";
  showCommonLabTests: boolean = false;
  creatingLabOrderState$: Observable<boolean>;

  testSetMembersKeyedByConceptUuid: any = {};
  showParameters: any = {};
  currentLabTest: any;
  showOtherDetails: any = {};
  formFields: any[];
  formValuesData: any;
  commonLabTestsFields: any[] = [];
  voidingLabOrderState$: Observable<boolean>;

  isFormValid: boolean = false;
  @Output() updateConsultationOrder = new EventEmitter();
  @Output() reloadOrderComponent = new EventEmitter();
  errors: any[] = [];
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private investigationPrecedureService: InvestigationProcedureService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.testSetMembersKeyedByConceptUuid = keyBy(
      this.testSetMembersDetails,
      "uuid"
    );
    this.creatingLabOrderState$ = this.store.select(getCreatingLabOrderState);
    this.formFields = [
      {
        id: "order",
        key: "order",
        label: "Test",
        name: "Test",
        controlType: "dropdown",
        type: "text",
        options: this.getLabTests(
          this.investigationAndProceduresFormsDetails?.setMembers
        ),
        conceptClass: "test",
        searchControlType: "searchFromOptions",
        shouldHaveLiveSearchForDropDownFields: true,
      },
      {
        id: "remarks",
        key: "remarks",
        label: "Remarks",
        name: "Remarks",
        controlType: "textbox",
        type: "textarea",
      },
    ];
    this.voidingLabOrderState$ = this.store.select(getLabOrderVoidingState);

    this.labOrdersResultsInformation = this.labOrdersResultsInformation.filter(
      labTest => !labTest.voided
    );
  }

  toggleParametes(event: Event, labTest: any): void {
    event.stopPropagation();
    this.showParameters[labTest?.uuid] = this.showParameters[labTest?.uuid]
      ? null
      : labTest;
      // console.log("after table click toggle ----------------------------",this.showParameters[labTest?.uuid]);
      // console.log("also visit ---------------------------------------->",this.visit);
  }

  setCurrentOrderedItemForOtherDetailsView(event: Event, labTest) {
    event.stopPropagation();
    this.currentLabTest = labTest;
    this.showOtherDetails[labTest?.uuid] = this.showOtherDetails[labTest?.uuid]
      ? null
      : labTest;
  }

  onFormUpdate(formValues: FormValue): void {
    this.formValuesData = formValues.getValues();
    this.isFormValid = formValues.isValid;
  }

  onAddTest(event: Event): void {
    event.stopPropagation();
    let labOrders = uniqBy(
      Object.keys(this.formValuesData)
        .map((key) => {
          if (
            key !== "order" &&
            key !== "remarks" &&
            this.formValuesData[key]?.value
          ) {
            return {
              concept: this.formValuesData[key]?.id,
              orderType: (this.orderTypes.filter(
                (orderType) => orderType?.conceptClassName === "Test"
              ) || [])[0]?.uuid,
              action: "NEW",
              visit: this.visit?.uuid,
              patient: this.visit?.patientUuid,
              careSetting: !this.visit?.isAdmitted ? "OUTPATIENT" : "INPATIENT",
              orderer: this.provider?.uuid,
              urgency: "ROUTINE",
              instructions: "",
              encounter: JSON.parse(
                localStorage.getItem("patientConsultation")
              )["encounterUuid"],
              type: "testorder",
            };
          } else {
            return null;
          }
        })
        .filter((labOrder) => labOrder),
      "concept"
    );
    if (this.formValuesData["order"]) {
      labOrders = [
        ...labOrders,
        {
          concept: this.formValuesData["order"]?.value,
          orderType: (this.orderTypes.filter(
            (orderType) => orderType?.conceptClassName === "Test"
          ) || [])[0]?.uuid,
          action: "NEW",
          visit: this.visit?.uuid,
          patient: this.visit?.patientUuid,
          careSetting: !this.visit?.isAdmitted ? "OUTPATIENT" : "INPATIENT",
          orderer: this.provider?.uuid,
          urgency: "ROUTINE",
          instructions: this.formValuesData["remarks"]?.value,
          type: "testorder",
        },
      ];
    }
    this.store.dispatch(
      createLabOrders({
        orders: labOrders,
        patientId: this.visit?.patientUuid,
      })
    );

    this.updateConsultationOrder.emit();
  }

    onDeleteTest(e: Event, labOrder: any): void {
      e.stopPropagation();
      this.store.dispatch(deleteLabOrder({ uuid: labOrder?.uuid }));
      const confirmDialog = this.dialog.open(SharedConfirmationComponent, {
        minWidth: "25%",
        data: {
          modalTitle: `Delete ${labOrder?.concept?.display}`,
          modalMessage: `You are about to delete ${labOrder?.concept?.display} for this patient, Click confirm to delete!`,
          showRemarksInput: true,
        },
        disableClose: false,
        panelClass: "custom-dialog-container",
      });
      confirmDialog.afterClosed().subscribe((confirmationObject) => {
        if (confirmationObject?.confirmed) {
          this.ordersService
            .voidOrderWithReason({
              ...labOrder,
              voidReason: confirmationObject?.remarks || "",
            })
            .subscribe((response) => {
              if (!response?.error) {
                this.labOrdersResultsInformation = this.labOrdersResultsInformation.filter(
                  (order) => order.uuid !== labOrder.uuid
                );
                this.reloadOrderComponent.emit();
              }
              if (response?.error) {
                this.errors = [...this.errors, response?.error];
              }
            });
        }
      });
    }

    // refreshLabTests(): void {
    //   const departments = this.investigationAndProceduresFormsDetails?.setMembers;
    //   this.labOrdersResultsInformation = this.getLabTests(departments);
    // }
    
  getLabTests(departments): any {
    const labDepartment = ((departments || [])?.filter(
      (department) => department?.name?.toLowerCase().indexOf("lab") === 0
    ) || [])[0];
    return !labDepartment
      ? []
      : uniqBy(
          orderBy(
            flatten(
              labDepartment?.setMembers.map((setMember) => {
                return setMember?.setMembers?.map((setMember) => {
                  const availabilityMapping = (setMember?.mappings?.filter(
                    (mapping) =>
                      mapping?.display
                        ?.toLowerCase()
                        ?.indexOf("lab test availability") > -1
                  ) || [])[0];
                  const availability = !availabilityMapping
                    ? true
                    : availabilityMapping?.display
                        ?.toLowerCase()
                        ?.indexOf(": no") > -1
                    ? false
                    : true;
                  return {
                    ...setMember,
                    disabled: !availability,
                    message: "Test can not be performed on lab",
                  };
                });
              })
            ),
            ["name"],
            ["asc"]
          ),
          "uuid"
        );
  }

  onToggleCommonLabTests(
    event: Event,
    investigationAndProceduresFormsDetails
  ): void {
    // TODO: Add support to use system settings to determine if its lab department
    event.stopPropagation();
    this.showCommonLabTests = !this.showCommonLabTests;
    const commonLabTestsSetId =
      this.iCareGeneralConfigurations?.commonLabTest?.id;
    const labDepartment =
      (investigationAndProceduresFormsDetails?.setMembers.filter(
        (department) => department?.name.toLowerCase().indexOf("lab") > -1
      ) || [])[0];
    // console.log("labDepartment", labDepartment);
    const commonLabTestsSet = !labDepartment
      ? null
      : (labDepartment?.setMembers.filter(
          (member) => member?.id === commonLabTestsSetId
        ) || [])[0];
    // TODO: Find a better way to handle the following process - to identify test availability
    this.commonLabTestsFields = commonLabTestsSet?.setMembers?.map(
      (setMember) => {
        // console.log(setMember);
        const availabilityMapping = (setMember?.mappings?.filter(
          (mapping) =>
            mapping?.display?.toLowerCase()?.indexOf("lab test availability") >
            -1
        ) || [])[0];
        // console.log("availabilityMapping", availabilityMapping);
        const availability = !availabilityMapping
          ? true
          : availabilityMapping?.display?.toLowerCase()?.indexOf(": no") > -1
          ? false
          : true;
        return {
          ...setMember?.formField,
          availability: availability,
          disabled: !availability,
          message: "Test can not be performed on lab",
        };
      }
    );
  }

  onDeleteLabTest(e: any) {
    const dialog = this.dialog.open(DeleteConfirmationComponent, {
      width: "600px",
      disableClose: true,
      data: {
        modalTitle: "Delete Lab Test",
        modalMessage: `Are you sure you want to delete "${e?.concept?.display}" from the lab orders list?`,
      },
    });

    dialog.afterClosed().subscribe((data) => {
      if (data) {
        // this.store.dispatch(voidOrder({ order: e }));
        let order = {
          uuid: e?.uuid,
          action: "DISCONTINUE",
          location: e?.location?.uuid,
          dateStopped: new Date(),
          encounter: e?.encounter?.uuid,
        };
        this.ordersService.updateOrdersViaEncounter([order]).subscribe();
        // console.log("==> Deleted Lab test: ", e);
      }
    });
  }
}
