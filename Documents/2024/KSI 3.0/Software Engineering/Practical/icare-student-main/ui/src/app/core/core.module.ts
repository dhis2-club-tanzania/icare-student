import { HttpClientModule } from "@angular/common/http";
import {
  APP_INITIALIZER,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EffectsModule } from "@ngrx/effects";
import {
  DefaultRouterStateSerializer,
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "src/environments/environment";
import { SharedModule } from "../shared/shared.module";
import { effects } from "../store/effects";
import { reducers, metaReducers } from "../store/reducers";
import { AppRoutingModule } from "./app-routing.module";
import { coreComponents } from "./components";
import { coreContainers } from "./containers";
import { coreDialogs } from "./dialogs";
import {
  IndexDbService,
  IndexDbServiceConfig,
} from "./services/index-db.service";
import { RouteSerializer } from "./utils";

export function initializeDb(indexDbServiceConfig: IndexDbServiceConfig) {
  return () => new IndexDbService(indexDbServiceConfig);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    SharedModule,
    StoreRouterConnectingModule.forRoot({
      serializer: DefaultRouterStateSerializer,
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  declarations: [...coreContainers, ...coreComponents, ...coreDialogs],
  entryComponents: [...coreDialogs],
  providers: [{ provide: RouterStateSerializer, useClass: RouteSerializer }],
  exports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error("CoreModule is already loaded. Import only in AppModule");
    }
  }

  static forRoot(
    config: IndexDbServiceConfig
  ): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: IndexDbServiceConfig, useValue: config },
        {
          provide: APP_INITIALIZER,
          useFactory: initializeDb,
          deps: [IndexDbServiceConfig],
          multi: true,
        },
      ],
    };
  }
}
