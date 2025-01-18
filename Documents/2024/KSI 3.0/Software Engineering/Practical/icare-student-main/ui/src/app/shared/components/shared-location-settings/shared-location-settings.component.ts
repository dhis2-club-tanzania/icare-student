import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { LocationService } from "src/app/core/services";
import {
  LocationGet,
  LocationGetFull,
  LocationtagGetFull,
} from "../../resources/openmrs";
import { ManageLocationModalComponent } from "../manage-location-modal/manage-location-modal.component";
import { RetireMetadataReasonModalComponent } from "../retire-metadata-reason-modal/retire-metadata-reason-modal.component";

@Component({
  selector: "app-shared-location-settings",
  templateUrl: "./shared-location-settings.component.html",
  styleUrls: ["./shared-location-settings.component.scss"],
})
export class SharedLocationSettingsComponent implements OnInit {
  @Input() locationTag: LocationtagGetFull;
  @Input() locationTags: LocationtagGetFull[];
  locationsByTag$: Observable<LocationGetFull[]>;
  page: number = 1;
  pageSize: number = 10;

  saving: boolean = false;
  errorMessage: string;
  constructor(
    private locationService: LocationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getLocations();
  }

  getLocations(): void {
    this.locationsByTag$ = this.locationService.getLocationsByTagName(
      this.locationTag?.display,
      {
        limit: this.pageSize,
        startIndex: (this.page - 1) * this.pageSize,
        v: "custom:(uuid,display,description,tags:(uuid,display))",
      }
    );
  }

  openModal(event: Event, locationTag: any, parentLocation: LocationGet): void {
    // event.stopPropagation();
    this.dialog
      .open(ManageLocationModalComponent, {
        width: "75%",
        data: {
          locationTag,
          locationTags: this.locationTags,
          parentLocation: parentLocation?.uuid,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.getLocations();
      });
  }

  getItems(event: Event, actionType: string): void {
    event.stopPropagation();
    this.page = actionType === "next" ? this.page + 1 : this.page - 1;
    this.getLocations();
  }

  onEdit(event: Event, location: LocationGet): void {
    this.locationService
      .getLocationById(location?.uuid)
      .subscribe((response) => {
        if (response) {
          this.dialog
            .open(ManageLocationModalComponent, {
              width: "75%",
              data: {
                edit: true,
                location: response,
                locationTags: this.locationTags,
              },
            })
            .afterClosed()
            .subscribe(() => {
              this.getLocations();
            });
        }
      });
  }

  onDelete(event: Event, locationUuid: string): void {
    // event.stopPropagation();
    this.saving = true;
    this.locationService
      .deleteLocation(locationUuid, true)
      .subscribe((response) => {
        if (response && !response?.error) {
          this.saving = false;
          this.getLocations();
        } else {
          this.errorMessage = response?.error?.message;
          this.saving = false;
        }
      });
  }

  onRetire(event: Event, location: LocationtagGetFull): void {
    this.dialog
      .open(RetireMetadataReasonModalComponent, {
        width: "40%",
        data: {
          type: "location",
          info: location,
        },
      })
      .afterClosed()
      .subscribe((reason) => {
        if (reason) {
          this.locationService
            .deleteLocation(location?.uuid, false)
            .subscribe((response) => {
              this.getLocations();
              return response;
            });
        }
      });
  }

  closeAlart(event: Event): void {
    event.stopPropagation();
    this.errorMessage = null;
  }
}
