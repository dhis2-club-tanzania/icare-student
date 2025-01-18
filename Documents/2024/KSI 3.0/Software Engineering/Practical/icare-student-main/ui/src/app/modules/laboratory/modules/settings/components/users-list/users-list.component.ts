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
import { CaptureSignatureComponent } from "src/app/shared/components/capture-signature/capture-signature.component";

@Component({
  selector: "lab-users-list",
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
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data = {};
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Input() currentUser: any;
  @Input() users: any[];
  @Input() pageCount: number;
  @Input() page: number;
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.users);
    this.dataSource.paginator = this.paginator;
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
}
