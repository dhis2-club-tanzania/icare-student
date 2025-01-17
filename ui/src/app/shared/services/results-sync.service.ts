import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResultsSyncService {
  private resultsUpdated = new BehaviorSubject<any>(null);
  resultsUpdated$ = this.resultsUpdated.asObservable();

  emitResultsUpdate(updatedResults: any) {
    this.resultsUpdated.next(updatedResults);
  }
  emitResultsUpdate(updatedResults: any) {
  if (!updatedResults) {
    console.error('No results to update');
    return;
  }
  this.resultsUpdated.next(updatedResults);
}

}
