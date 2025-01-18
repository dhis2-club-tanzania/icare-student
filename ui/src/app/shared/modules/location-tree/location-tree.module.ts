import { NgModule } from "@angular/core";
import { LocationTreeComponent } from "./containers/location-tree/location-tree.component";
import { LocationTreeHomeComponent } from "./components/location-tree-home/location-tree-home.component";
import { materialModules } from "../../material-modules";
import { LocationElementComponent } from "./components/location-element/location-element.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    LocationTreeComponent,
    LocationTreeHomeComponent,
    LocationElementComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, ...materialModules],
  exports: [LocationTreeComponent],
  providers: [],
})
export class NgxOpenmrsLocationTreeModule {}
