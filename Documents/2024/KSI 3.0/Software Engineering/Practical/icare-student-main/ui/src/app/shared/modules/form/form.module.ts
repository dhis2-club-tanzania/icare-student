import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { materialModules } from "../../material-modules";
import { fieldComponents } from "./components";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...materialModules],
  declarations: [...fieldComponents],
  providers: [],
  exports: [...fieldComponents],
})
export class FormModule {}
