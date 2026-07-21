import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RadiologyBadgeService {
  private showRadiologyBadgeSubject = new BehaviorSubject<boolean>(false);
  showRadiologyBadge$ = this.showRadiologyBadgeSubject.asObservable();

  setShowRadiologyBadge(value: boolean): void {
    this.showRadiologyBadgeSubject.next(value);
  }
}