import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { SystemUsersService } from "src/app/core/services/system-users.service";
import { AppState } from "src/app/store/reducers";
import { StoreEditUserModalComponent } from "../../store-modals/store-edit-user-modal/store-edit-user-modal.component";
import { StoreAddNewUserModalComponent } from "../../store-modals/store-add-new-user-modal/store-add-new-user-modal.component";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";

@Component({
  selector: "app-store-user-management-dashboard",
  templateUrl: "./store-user-management-dashboard.component.html",
  styleUrls: ["./store-user-management-dashboard.component.scss"],
})
export class StoreUserManagementDashboardComponent implements OnInit {
  @Input() currentUser: any;
  itemSearchTerm: string;
  addingUserItem: boolean;
  currentUser$: Observable<any>;
  loading: boolean = true;
  displayedColumns: string[] = [
    "index",
    "display",
    "fullName",
    "username",
    "systemId",
    "actions",
  ];
  dataSource: MatTableDataSource<any>;
  users$: Observable<any>;
  page: number = 1;
  pageCount: number = 25;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterValue: string = "";
  public data = {};
  securitySystemSettings$: Observable<any[]>;

  constructor(
    private store: Store<AppState>,
    private service: SystemUsersService,
    private dialog: MatDialog,
    private systemSettingsService: SystemSettingsService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    // TODO: current user to be used for privilages control
    this.getUsers();

    this.securitySystemSettings$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey("security.");
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getRecord(row: any): void {
    localStorage.setItem("selectedUser", JSON.stringify(row));
    this.service.getUserById(row?.uuid).subscribe((userResponse) => {
      if (userResponse) {
        this.data = userResponse;
        this.dialog.open(StoreEditUserModalComponent, {
          minWidth: "60%",
          data: this.data,
        });
      }
    });
  }

  onAddUser(event: Event, securitySystemSettings: any[]): void {
    event.stopPropagation();
    this.dialog.open(StoreAddNewUserModalComponent, {
      minWidth: "60%",
      data: securitySystemSettings,
    });
    this.trackActionForAnalytics(`Add user: Open`);
  }
  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }
  onEditChild(e) {}

  onDelete(e) {}

  onOpenDetails(e) {}

  applyFilter(event: Event): void {
    event.stopPropagation();
    this.filterValue = (event.target as HTMLInputElement).value;
    this.page = 1;
    this.getUsers();
  }

  getUsers(): void {
    this.users$ = this.service.getUsers({
      q: this.filterValue,
      limit: this.pageCount,
      startIndex: (this.page - 1) * this.pageCount,
    });
  }

  getUsersList(event: Event, action: string): void {
    event.stopPropagation();
    this.page = action === "next" ? this.page + 1 : this.page - 1;
    this.getUsers();
  }
}
