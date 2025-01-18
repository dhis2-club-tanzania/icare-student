import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { Api } from "../../resources/openmrs";

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  exports: [],
  providers: [Api],
})
export class NgxOpenmrsHttpclientServiceModule {}
