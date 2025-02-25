import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from '../components/notification-dialog/notification-dialog.component';


export interface NotificationInterface {
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'LOADING';
  message: string;
  duration?: number;
  action?: string;

  patientName?: string;
  labName?: string;
  
  horizontalPosition?: MatSnackBarHorizontalPosition;
  verticalPosition?: MatSnackBarVerticalPosition;
    autoClose?: boolean;  }


    @Injectable({providedIn: 'root'})

export class NotificationService {
  constructor(private dialog: MatDialog) {}

  show(notification: { message: string; details?: string }) {
    this.dialog.open(NotificationDialogComponent, {
      data: notification,
      width: '400px',
    });
  }

  private clinicNotificationSubject = new Subject<any>();
  notifyClinic(notification: any): void {
    this.clinicNotificationSubject.next(notification);
  }
  getClinicNotification() {
    return this.clinicNotificationSubject.asObservable();
  }
  
}
export class Notification implements NotificationInterface {
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'LOADING';
  message: string;
  duration: number;
  action: string;
  horizontalPosition: MatSnackBarHorizontalPosition;
  verticalPosition: MatSnackBarVerticalPosition;
  autoClose: boolean;
  constructor(options: NotificationInterface) {
    this.type = options?.type;
    this.message = options?.message;
    this.autoClose = options.autoClose || true;
    this.duration = options?.duration;
    this.action = options?.action || 'OK';

    this.horizontalPosition = this.setHorizontalPosition(
      options?.horizontalPosition,
      this.type
    );

    this.verticalPosition = this.setVericalPosition(
      options?.verticalPosition,
      this.type
    );
  }

  get displayDuration(): number {
    if (this.type === 'ERROR') {
      return undefined;
    }

    if (this.duration) {
      return this.duration;
    }

    return this.autoClose ? 2000 : undefined;
  }

  /**
   * Set horizontal position for notification bar
   * @param horizontalPosition MatSnackBarHorizontalPosition
   * @param type 'SUCCESS' | 'ERROR' | 'WARNING' | 'LOADING'
   */
  setHorizontalPosition(
    horizontalPosition: MatSnackBarHorizontalPosition,
    type?: 'SUCCESS' | 'ERROR' | 'WARNING' | 'LOADING'
  ): MatSnackBarHorizontalPosition {
    if (!type) {
      return horizontalPosition || 'left';
    }

    return type === 'ERROR' ? 'center' : horizontalPosition || 'left';
  }

  /**
   * Set vertical position for notification bar
   * @param verticalPosition MatSnackBarVerticalPosition
   * @param type  'SUCCESS' | 'ERROR' | 'WARNING' | 'LOADING'
   */
  setVericalPosition(
    verticalPosition: MatSnackBarVerticalPosition,
    type?: 'SUCCESS' | 'ERROR' | 'WARNING' | 'LOADING'
  ): MatSnackBarVerticalPosition {
    if (!type) {
      return verticalPosition || 'bottom';
    }

    return type === 'ERROR' ? 'top' : verticalPosition || 'bottom';
  }
}
function handleIncomingNotification(notification: any, any: any) {
  throw new Error('Function not implemented.');
}

