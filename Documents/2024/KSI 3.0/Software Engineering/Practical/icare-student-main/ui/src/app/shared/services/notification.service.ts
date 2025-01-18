import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

export interface NotificationInterface {
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'LOADING';
  message: string;
  duration?: number;
  action?: string;
  horizontalPosition?: MatSnackBarHorizontalPosition;
  verticalPosition?: MatSnackBarVerticalPosition;
  autoClose?: boolean;
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

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show notification snack bar for the supplied options
   * @param notification Notification
   */
  show(notification: Notification): void {
    this.snackBar.open(notification?.message, notification?.action, {
      duration: notification?.displayDuration,
      horizontalPosition: notification?.horizontalPosition,
      verticalPosition: notification?.verticalPosition,
    });
  }
}
