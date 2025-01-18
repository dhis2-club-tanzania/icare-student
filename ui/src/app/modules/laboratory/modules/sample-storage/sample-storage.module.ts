import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { HomeComponent } from "./pages/home/home.component";
import { SampleStorageRoutingModule } from "./sample-storage-routing.module";
import { storageComponents } from "./components";
import { SampleStorageComponent } from "./sample-storage/sample-storage.component";
import { SharedLabModule } from "../../shared/modules/shared-lab.module";

@NgModule({
  declarations: [SampleStorageComponent, HomeComponent, ...storageComponents],
  imports: [
    CommonModule,
    SampleStorageRoutingModule,
    SharedModule,
    SharedLabModule,
  ],
})
export class SampleStorageModule {}
