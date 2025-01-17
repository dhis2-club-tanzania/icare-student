import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { theatreComponents } from './components';
import { theatrePages } from './pages';
import { TheatreRoutingModule } from './theatre-routing.module';
@NgModule({
  declarations: [...theatrePages, ...theatreComponents],
  entryComponents: [...theatreComponents],
  providers: [],
  imports: [CommonModule, TheatreRoutingModule, SharedModule],
})
export class TheatreModule {}
