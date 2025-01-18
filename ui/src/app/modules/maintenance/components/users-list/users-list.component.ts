import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  Input,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { UserCreateModel } from "../../models/user.model";
import { CaptureSignatureComponent } from "../../../../shared/components/capture-signature/capture-signature.component";
import { Observable } from "rxjs";
import { UserGet } from "src/app/shared/resources/openmrs";
import { UsersService } from "src/app/modules/laboratory/resources/services/users.service";
import { SystemUsersService } from "src/app/core/services/system-users.service";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.scss"],
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = [
    "index",
    "display",
    "fullName",
    "username",
    "systemId",
    "actions",
  ];
  dataSource: MatTableDataSource<UserCreateModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data = {};
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Input() currentUser: any;
  @Input() users: any[];

  users$: Observable<UserGet[]>;
  searchingText: string = "";
  page: number = 1;
  pageCount: number = 10;
  constructor(
    private dialog: MatDialog,
    private usersService: SystemUsersService
  ) {}

  ngOnInit(): void {
    this.getUsersList();
    // this.dataSource = new MatTableDataSource<UserCreateModel>(this.users);
    // this.dataSource.paginator = this.paginator;
  }

  getUsersList(): void {
    this.users$ = this.usersService.getUsers({
      startIndex: (this.page - 1) * this.pageCount,
      limit: this.pageCount,
      q: this.searchingText,
    });
  }

  getRecord(event: Event, user: any): void {
    this.edit.emit(user);
  }

  onCaptureSignature(event: Event, currentUser: any, user: any): void {
    this.dialog.open(CaptureSignatureComponent, {
      width: "40%",
      data: {
        ...currentUser,
        userUuid: user?.uuid,
        user,
      },
    });
  }

  getUsersData(event: Event, action: string): void {
    event.stopPropagation();
    this.page = action === "next" ? this.page + 1 : this.page - 1;
    this.getUsersList();
  }

  onSearchUsers(event: KeyboardEvent): void {
    this.searchingText = (event.target as HTMLInputElement)?.value;
    this.getUsersList();
  }
}
