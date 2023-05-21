import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GlobalEventHandlersEvent } from 'src/app/modules/maintenance/models/user.model';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  passwordFocusOut: Boolean = false;
  passwordStrong: Boolean = true;
  hide: Boolean = true;
  userForm: UntypedFormGroup;
  oldPassword: Boolean = true;
  confirmFocusOut: Boolean = false;
  saving: boolean = false;
  currentPasswordIsEquelToNew: Boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialogRef<ChangePasswordComponent>,
    private service: ConfigsService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userForm = this.generateForm();
  }
  generateForm() {
    return this.fb.group({
      oldpassword: new UntypedFormControl('', Validators.required),
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: [''],
    });
  }
  get passwordInput() {
    return this.userForm.get('password');
  }
  get confirmpassword() {
    return this.userForm.get('confirmpassword');
  }
  get oldPasswordInput() {
    return this.userForm.get('oldpassword');
  }
  get passwordMatch() {
    if (this.hide) {
      if (this.passwordInput.value === this.confirmpassword.value) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  confirmStrongPassword(e: GlobalEventHandlersEvent) {
    this.passwordFocusOut = true;
    e.stopPropagation();
    if (this.passwordInput.value && this.passwordInput.value !== '') {
      if (this.passwordInput.value === this.oldPasswordInput.value) {
        this.currentPasswordIsEquelToNew = true;
      }
      const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
      const test = strongPassword.test(this.passwordInput.value);
      if (test) {
        this.passwordStrong = true;
      } else {
        this.passwordStrong = false;
      }
    }
  }
  onClose() {
    this.dialog.close();
  }
  confirmPassword(e: GlobalEventHandlersEvent) {
    e.stopPropagation();
    this.confirmFocusOut = true;
  }
  onFocus(e: GlobalEventHandlersEvent) {
    e.stopPropagation();
    this.passwordFocusOut = false;
    this.confirmFocusOut = false;
    this.currentPasswordIsEquelToNew = false;
  }
  onConfirmPassWordFocus(e: GlobalEventHandlersEvent) {
    e.stopPropagation();
    this.confirmFocusOut = false;
  }
  saveData() {
    this.saving = true;
    const rawValues = this.userForm.getRawValue();
    const data = {
      newPassword: rawValues.password,
      oldPassword: rawValues.oldpassword,
    };
    this.service.changePassword({ data }).subscribe(
      () => {
        this._snackBar.open(`Password updated successfully`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000,
          panelClass: ['snack-color'],
        });
        this.saving = false;
        localStorage.clear();
        window.localStorage.clear();
        sessionStorage.clear();
        this.dialog.close();
        window.location.href = '#/login/';
      },
      (response) => {
        this._snackBar.open(
          `An error ocurred. Please try again. [Error Hint: ${response.error.message}]`,
          'CLOSE',
          {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 10000,
            panelClass: ['snack-color-error'],
          }
        );
        this.saving = false;
      }
    );
  }
}
