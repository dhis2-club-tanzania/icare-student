import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";
import { CaptureSignatureComponent } from "../../../../../shared/components/capture-signature/capture-signature.component";
import { UserCreateModel } from "../../../models/user.model";
import { UserService } from "../../../services/users.service";

@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.scss"],
})
export class UserManagementComponent implements OnInit, AfterViewInit {
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
  dataSource: MatTableDataSource<UserCreateModel>;
  users$: Observable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data = {};

  constructor(
    private store: Store<AppState>,
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // TODO: current user to be used for privilages control
    this.currentUser$ = this.store.select(getCurrentUserDetails);
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getRecord(row: UserCreateModel): void {
    this.data = row;
    localStorage.setItem("selectedUser", JSON.stringify(row));
    // this.router.navigate(["manage-user"], {
    //   state: this.data,
    //   relativeTo: this.route,
    //   queryParams: { id: row.uuid },
    // });
    this.store.dispatch(
      go({
        path: ["/maintenance/users-management/manage-user"],
        query: { queryParams: { id: row.uuid } },
      })
    );
  }

  onEditChild(e) {}

  onDelete(e) {}

  onOpenDetails(e) {}

  applyFilter(event: Event): void {
    event.stopPropagation();
    const filterValue = (event.target as HTMLInputElement).value;
    this.users$ = this.service.getUsers({ q: filterValue });
  }

  onRouteToManageUser(event: Event): void {
    event.stopPropagation();
    this.store.dispatch(
      go({ path: ["/maintenance/users-management/manage-user"] })
    );
  }
}
