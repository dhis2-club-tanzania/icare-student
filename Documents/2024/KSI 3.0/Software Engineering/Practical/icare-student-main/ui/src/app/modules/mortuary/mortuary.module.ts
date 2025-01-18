import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { mortuaryComponents } from './components';
import { MortuaryRoutingModule } from './mortuary-routing.module';
import { mortuaryPages } from './pages';
@NgModule({
  declarations: [...mortuaryPages, ...mortuaryComponents],
  entryComponents: [],
  providers: [],
  imports: [CommonModule, MortuaryRoutingModule, SharedModule],
})
export class MortuaryModule {}
