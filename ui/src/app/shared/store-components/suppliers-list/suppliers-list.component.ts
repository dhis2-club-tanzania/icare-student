import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { from, interval, Observable, of } from "rxjs";
import { debounceTime, map, tap } from "rxjs/operators";
import { LocationService } from "src/app/core/services";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { SupplierService } from "src/app/shared/resources/store/services/supplier.service";
import { SupplierFormComponent } from "../supplier-form/supplier-form.component";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";

@Component({
  selector: "app-suppliers-list",
  templateUrl: "./suppliers-list.component.html",
  styleUrls: ["./suppliers-list.component.scss"],
})
export class SuppliersListComponent implements OnInit {
  suppliers$: Observable<any>;
  errors: any[] = [];
  loadingSuppliers: boolean = false;
  supplierLocations$: Observable<any>;
  constructor(
    public dialog: MatDialog,
    private supplierService: SupplierService,
    private locationService: LocationService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadingSuppliers = true;
    this.suppliers$ = this.supplierService.getSuppliers().pipe(
      map((response) => {
        this.loadingSuppliers = false;
        if (!response?.error) {
          return response;
        }
        if (response?.error) {
          this.errors = [...this.errors, response.error];
        }
      })
    );

    this.supplierLocations$ =
      this.locationService.getLocationsByTagName("supplier+location");
  }

  onAddNewSupplier(e: any, locations) {
    e?.stopPropagation();
    this.dialog
      .open(SupplierFormComponent, {
        minWidth: "40%",
        panelClass: "custom-dialog-container",
        data: {
          locations: locations,
        },
      })
      .afterClosed()
      .subscribe((response) => {
        this.ngOnInit();
      });

      this.trackActionForAnalytics(`Add New Supplier: Open`);
  }

  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }


  onUpdateSupplier(e: any, supplier: any, locations?: any[]) {
    e?.stopPropagation();
    this.dialog
      .open(SupplierFormComponent, {
        minWidth: "40%",
        data: {
          supplier: supplier,
          locations: locations,
        },
      })
      .afterClosed()
      .subscribe((response) => {
        this.ngOnInit();
      });
  }

  onDeleteSupplier(e: any, supplier: any) {
    this.dialog
      .open(SharedConfirmationComponent, {
        minWidth: "25%",
        data: {
          modalTitle: "Are you sure to delete this supplier?",
          modalMessage:
            "This action is irreversible. Please, click confirm to delete this supplier and click cancel to stop the action.",
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data?.confirmed) {
          const supplierObject = {
            ...supplier,
            voided: true,
          };

          this.supplierService
            .updateSupplier(supplier?.uuid, supplierObject)
            .pipe(
              tap((response) => {
                if (!response?.error) {
                  this.ngOnInit();
                }
              })
            )
            .subscribe();
        }
      });
  }
}
