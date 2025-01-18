import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService, PrescriptionNotification } from './notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  template: `
    <!-- Popup Notification -->
    <div *ngFor="let notification of popupNotifications" 
         class="popup-notification"
         [@fadeInOut]>
      {{ notification.message }}
    </div>

    <!-- Dashboard Banner -->
    <div *ngFor="let notification of bannerNotifications" 
         class="banner-notification">
      {{ notification.message }}
    </div>

    <!-- Notification Center -->
    <div class="notification-center">
      <div *ngFor="let notification of centerNotifications">
        {{ notification.message }}
      </div>
    </div>
  `,
  styles: [`
    .popup-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .banner-notification {
      width: 100%;
      padding: 10px;
      background: #f0f8ff;
      border-left: 4px solid #007bff;
      margin-bottom: 10px;
    }

    .notification-center {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  `],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition('void <=> *', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  popupNotifications: PrescriptionNotification[] = [];
  bannerNotifications: PrescriptionNotification[] = [];
  centerNotifications: PrescriptionNotification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.getNotifications()
      .subscribe(notifications => {
        notifications.forEach(notification => {
          switch(notification.type) {
            case 'POPUP':
              this.popupNotifications = [notification];
              // Auto-remove popup after 5 seconds
              setTimeout(() => {
                this.popupNotifications = this.popupNotifications
                  .filter(n => n !== notification);
              }, 5000);
              break;
            case 'BANNER':
              this.bannerNotifications = [notification];
              break;
            case 'NOTIFICATION_CENTER':
              this.centerNotifications = [notification, ...this.centerNotifications];
              break;
          }
        });
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}