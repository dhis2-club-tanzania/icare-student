import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  addLoadedUserDetails,
  authenticateUser,
  authenticateUserFail,
  loadAllLocations,
  loadProviderDetails,
  loadRolesDetails,
  setUserLocations,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getParentLocation } from "src/app/store/selectors";
import {
  getAuthenticationLoadingState,
  getLoginErrorStatus,
} from "src/app/store/selectors/current-user.selectors";
import { formatCurrentUserDetails } from "../../helpers";
import { Credentials } from "../../models";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  authenticationLoading$: Observable<boolean>;
  loginErrorStatus$: Observable<boolean>;
  parentLocation$: Observable<any>;
  hide: boolean = true;

  @Output() closeLogin = new EventEmitter();
  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.parentLocation$ = this.store.select(getParentLocation);
    this.authenticationLoading$ = this.store.select(
      getAuthenticationLoadingState
    );
    this.loginErrorStatus$ = this.store.select(getLoginErrorStatus);
  }

  onLogin(credentials): void {
    const credentialsToken = btoa(
      credentials.username + ":" + credentials.password
    );

    this.authService.login(credentialsToken).subscribe(
      ({
        authenticatedUser,
        authenticated,
        userUuid,
        loginResponse,
        user,
        userLocations,
      }) => {
        if (authenticated) {
          // sessionStorage.setItem("JSESSIONID", loginResponse?.sessionId);
          localStorage.setItem("credentialsToken", credentialsToken);
          localStorage.setItem("userUuid", user.uuid);
          this.store.dispatch(
            setUserLocations({ userLocations: userLocations })
          );
          this.store.dispatch(loadProviderDetails({ userUuid }));
          this.store.dispatch(
            addLoadedUserDetails({
              userDetails: formatCurrentUserDetails(authenticatedUser),
            })
          );
          // this.store.dispatch(loadRolesDetails());
          this.closeLogin.emit();
        } else {
          authenticateUserFail({
            error: {
              status: 403,
              message: "incorrect username or password",
            },
          });
        }
      },
      () => {}
    );
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
}
