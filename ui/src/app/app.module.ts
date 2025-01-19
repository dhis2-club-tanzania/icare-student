import { AppComponent } from "./app.component";
import { CoreModule } from "./core";
import { BrowserModule } from "@angular/platform-browser";
import { GoogleAnalyticsService } from "./google-analytics.service";
import { ServiceWorkerModule } from "@angular/service-worker";
import { NgModule, isDevMode } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { DrugOrdersEffects } from './store/effects/drug-orders.effects';

export const config: any = {
  sizeUnit: "Octet",
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule.forRoot({
      namespace: "icare",
      version: 1,
      models: {
        prescriptions: "id",
      },
    }),
    BrowserModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
    EffectsModule.forFeature([DrugOrdersEffects])
  ],
  providers: [GoogleAnalyticsService, { provide: "window", useValue: window }],
  bootstrap: [AppComponent],
})
export class AppModule {}
