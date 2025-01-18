import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface PrescriptionNotification {
  patientName: string;
  message: string;
  type: 'POPUP' | 'BANNER' | 'NOTIFICATION_CENTER';
  unreadCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private eventSource: EventSource;
  private notificationSubject = new Subject<PrescriptionNotification[]>();

  constructor() {
    this.eventSource = new EventSource('/api/notifications/subscribe');
    
    this.eventSource.onmessage = (event) => {
      const notifications: PrescriptionNotification[] = JSON.parse(event.data);
      this.notificationSubject.next(notifications);
    };
    
    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.eventSource.close();
      
    };
  }

  getNotifications(): Observable<PrescriptionNotification[]> {
    return this.notificationSubject.asObservable();
  }
}