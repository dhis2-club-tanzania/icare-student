import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

/**
 * Mat Dialog mock
 */
export class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ action: true }),
    };
  }
}

export const matDialogProviderMock = {
  provide: MatDialog,
  useClass: MatDialogMock,
};

/**
 * MatSnackBar mock
 */

export class MatSnackBarMock {
  open(message, action, options) {}
}
export const matSnackBarProviderMock = {
  provide: MatSnackBar,
  useClass: MatSnackBarMock,
};

/**
 * MatDialogRef mock
 */
const mockDialogRef = {
  close: jasmine.createSpy('close'),
};

export const matDialogRefMock = {
  provide: MatDialogRef,
  useValue: mockDialogRef,
};

/**
 * MAT_DIALOG_DATA mock
 */
export const matDialogDataMock = {
  provide: MAT_DIALOG_DATA,
  useValue: null,
};
