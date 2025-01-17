import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, timer } from "rxjs";
import { LoginDialogComponent } from "./core/dialogs/login-dialog/login-dialog.component";
import { AuthService } from "./core/services/auth.service";
import { loadDHIS2ReportsConfigs } from "./store/actions";
import { AppState } from "./store/reducers";
import { getIfNonLoginRoute } from "./store/selectors";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "iCare";

  isNonLoginRoute$: Observable<boolean>;
  isDialogOpen: boolean;
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.monitorSession();
    this.isNonLoginRoute$ = this.store.pipe(select(getIfNonLoginRoute));
  }

  monitorSession() {
    timer(2000, 10000).subscribe(() => {
      this.auth.session().subscribe((session) => {
        if (
          !session?.authenticated &&
          !this.isDialogOpen &&
          !window.location.href.includes("login")
        ) {
          this.isDialogOpen = true;
          const dialog = this.dialog.open(LoginDialogComponent, {
            width: "25%",
            panelClass: "custom-dialog-container",
            disableClose: true,
          });

          dialog.afterClosed().subscribe(() => {
            this.isDialogOpen = false;
          });
        }
      });
    });
  }
}
