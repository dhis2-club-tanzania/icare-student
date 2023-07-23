import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core";
import { SchedulesmsComponent } from './schedulesms/schedulesms.component';
export const config: any = {
  sizeUnit: "Octet",
};

@NgModule({
  declarations: [AppComponent, SchedulesmsComponent],
  imports: [
    CoreModule.forRoot({
      namespace: "icare",
      version: 1,
      models: {
        prescriptions: "id",
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
