import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Credentials } from "src/app/core";
import { Location } from "src/app/core/models";
import {
  authenticateUser,
  loadLoginLocations,
  loadRolesDetails,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getParentLocation } from "src/app/store/selectors";
import {
  getAuthenticationLoadingState,
  getLoginErrorStatus,
} from "src/app/store/selectors/current-user.selectors";
import { LoginHelpComponent } from "../../components/login-help/login-help.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  authenticationLoading$: Observable<boolean>;
  loginErrorStatus$: Observable<boolean>;
  parentLocation$: Observable<Location>;
  hide: boolean = true;
  logo: any;
  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.store.dispatch(loadLoginLocations());
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.parentLocation$ = this.store.select(getParentLocation).pipe(tap((data) => {
      this.logo = data?.attributes?.filter((attribute) => attribute?.attributeType?.display?.toLowerCase() === 'logo')[0]?.value
    }));
    this.authenticationLoading$ = this.store.select(
      getAuthenticationLoadingState
    );
    this.loginErrorStatus$ = this.store.select(getLoginErrorStatus);
  }

  onLogin(credentials): void {
    const credentialsToken = btoa(
      credentials.username + ":" + credentials.password
    );
    this.store.dispatch(authenticateUser({ credentialsToken }));
  }

  onSubmit(): void {
    const credentials: Credentials = {
      username: this.loginForm?.value?.username,
      password: this.loginForm?.value?.password,
    };
    if (credentials.username && credentials.password) {
      this.onLogin(credentials);
    }
  }

  onOpenHelpModal(): void {
    this.dialog.open(LoginHelpComponent, {
      width: "25%",
      panelClass: "custom-dialog-container",
    });
  }
}
