import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { storePages } from './pages';
import { SharedModule } from '../../shared/shared.module';
import { storeModals } from './modals';
import { stockComponents } from './components';
import { RequestCancelComponent } from './modals/request-cancel/request-cancel.component';

@NgModule({
  declarations: [...storePages, ...storeModals, ...stockComponents, RequestCancelComponent],
  entryComponents: [...storeModals],
  imports: [CommonModule, StoreRoutingModule, SharedModule],
})
export class StoreModule {}
