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
import { materialModules } from "../shared/material-modules";
import { MenuComponent } from "./components/menu/menu.component";
import { CommonModule } from "@angular/common";
import { ModulesSelectorComponent } from "./components/modules-selector/modules-selector.component";
import { UserAbbreviationComponent } from "./components/user-abbreviation/user-abbreviation.component";

export function initializeDb(indexDbServiceConfig: IndexDbServiceConfig) {
  return () => new IndexDbService(indexDbServiceConfig);
}

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ...materialModules,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot({
      serializer: DefaultRouterStateSerializer,
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  declarations: [
    ...coreContainers,
    ...coreComponents,
    ...coreDialogs,
    MenuComponent,
    ModulesSelectorComponent,
    UserAbbreviationComponent,
  ],
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
