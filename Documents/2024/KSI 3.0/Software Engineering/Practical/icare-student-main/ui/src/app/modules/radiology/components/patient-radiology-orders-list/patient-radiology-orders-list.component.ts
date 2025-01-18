import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { zip } from "rxjs";
import { map } from "rxjs/operators";
import { addBillStatusToOrders } from "src/app/shared/helpers/add-bill-status-to-ordered-items.helper";
import { OrdersService } from "src/app/shared/resources/order/services/orders.service";
import { VisitsService } from "src/app/shared/resources/visits/services";
import { AppState } from "src/app/store/reducers";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-patient-radiology-orders-list",
  templateUrl: "./patient-radiology-orders-list.component.html",
  styleUrls: ["./patient-radiology-orders-list.component.scss"],
})
export class PatientRadiologyOrdersListComponent implements OnInit {
  @Input() currentUser: any;
  @Input() allUserRoles: any;
  @Input() userPrivileges: any;
  @Input() orders: any[];
  @Input() currentBills: any[];
  @Input() patientId: string;
  @Input() activeVisitUuid: string;
  @Input() activeVisit: any;

  file: any;
  values: any = {};
  obsKeyedByConcepts: any = {};

  saving: boolean = false;
  constructor(
    private httpClient: HttpClient,
    private visitService: VisitsService,
    private ordersService: OrdersService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.visitService
      .getVisitDetailsByVisitUuid(this.activeVisitUuid, {
        v: "custom:(encounters:(uuid,display,obs,orders,encounterDatetime,encounterType,location))",
      })
      .subscribe((response) => {
        if (response && response?.encounters?.length > 0) {
          response?.encounters?.forEach((encounter, index) => {
            encounter?.obs?.forEach((obs) => {
              this.obsKeyedByConcepts[obs?.concept?.uuid] = {
                ...obs,
                uri:
                  obs?.value?.links && obs?.value?.links?.uri
                    ? obs?.value?.links?.uri?.replace("http", "https")
                    : null,
              };
            });

            // encounter?.orders?.forEach((order) => {
            //   this.obsKeyedByConcepts[order?.concept?.uuid] = order;
            // });
          });
        }
      });
    this.orders = addBillStatusToOrders(this.orders, this.currentBills, this.activeVisit);
  }

  fileSelection(event, order): void {
    event.stopPropagation();
    const fileInputElement: HTMLElement = document.getElementById(
      "file-selector-" + order?.uuid
    );
    this.file = event.target.files[0];
    this.values[order?.uuid] = this.file;
  }

  getRemarks(event, order): void {
    this.values[order?.uuid + "-comment"] = event?.target?.value;
  }

  onSave(event: Event, order: any): void {
    event.stopPropagation();
    this.saving = true;
    let data = new FormData();
    const jsonData = {
      concept: order?.concept?.uuid,
      person: this.patientId,
      encounter: order?.encounterUuid,
      obsDatetime: new Date(),
      voided: false,
      status: "PRELIMINARY",
      order: order?.uuid,
      comment: this.values[order?.uuid + "-comment"],
    };
    data.append("file", this.file);
    data.append("json", JSON.stringify(jsonData));

    // void first the existing observation
    if (
      this.obsKeyedByConcepts[order?.concept?.uuid] &&
      this.obsKeyedByConcepts[order?.concept?.uuid]?.value
    ) {
      const existingObs = {
        concept: order?.concept?.uuid,
        person: this.patientId,
        obsDatetime:
          this.obsKeyedByConcepts[order?.concept?.uuid]?.encounter?.obsDatetime,
        encounter:
          this.obsKeyedByConcepts[order?.concept?.uuid]?.encounter?.uuid,
        status: "PRELIMINARY",
        comment:
          this.obsKeyedByConcepts[order?.concept?.uuid]?.encounter?.comment,
      };
      this.httpClient
        .post(
          `../../../openmrs/ws/rest/v1/obs/${
            this.obsKeyedByConcepts[order?.concept?.uuid]?.uuid
          }`,
          {
            ...existingObs,
            voided: true,
          }
        )
        .subscribe((response) => {
          if (response) {
            this.saving = false;
          }
        });
    }

    const orders = [
      {
        uuid: order?.uuid,
        fulfillerStatus: "RECEIVED",
        encounter: order?.encounterUuid,
      },
    ];

    this.ordersService
      .updateOrdersViaEncounter(orders)
      .subscribe((response) => {
        this.saving = false;
      });

    this.httpClient
      .post(`../../../openmrs/ws/rest/v1/obs`, data)
      .subscribe((response: any) => {
        if (response) {
          this.obsKeyedByConcepts[order?.concept?.uuid] = {
            ...response,
            uri: response?.value?.links
              ? response?.value?.links?.uri?.replace("http", "https")
              : null,
          };
        }
      });
  }
}
