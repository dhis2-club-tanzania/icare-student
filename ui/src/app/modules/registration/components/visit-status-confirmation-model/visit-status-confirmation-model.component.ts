import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import {
  getVisitLoadedState,
  getVisitLoadingState,
} from 'src/app/store/selectors/visit.selectors';

@Component({
  selector: 'app-visit-status-confirmation-model',
  templateUrl: './visit-status-confirmation-model.component.html',
  styleUrls: ['./visit-status-confirmation-model.component.scss'],
})
export class VisitStatusConfirmationModelComponent implements OnInit {
  loadingVisit$: Observable<boolean>;
  visitLoadedState$: Observable<boolean>;
  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<VisitStatusConfirmationModelComponent>
  ) {}

  ngOnInit(): void {
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
    this.visitLoadedState$ = this.store.pipe(select(getVisitLoadedState));
  }

  onClose(event) {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
