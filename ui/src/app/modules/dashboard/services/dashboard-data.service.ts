import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor() { }

  getData(indicators, period, location) {
    return of({

    })
  }
}
