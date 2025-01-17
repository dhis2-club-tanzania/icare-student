import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import { getProviderDetails } from 'src/app/store/selectors/current-user.selectors';
import { getActiveVisit } from 'src/app/store/selectors/visit.selectors';

@Component({
  selector: 'app-order-lab-test-home',
  templateUrl: './order-lab-test-home.component.html',
  styleUrls: ['./order-lab-test-home.component.scss'],
})
export class OrderLabTestHomeComponent implements OnInit {
  provider$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.provider$ = this.store.select(getProviderDetails);
  }
}
