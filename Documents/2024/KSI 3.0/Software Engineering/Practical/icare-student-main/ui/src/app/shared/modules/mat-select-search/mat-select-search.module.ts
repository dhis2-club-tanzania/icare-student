import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { materialModules } from "../../material-modules";
import { MatSelectSearchComponent } from "./mat-select-search/mat-select-search.component";

@NgModule({
  imports: [CommonModule, ...materialModules],
  declarations: [MatSelectSearchComponent],
  exports: [...materialModules, MatSelectSearchComponent],
})
export class MatSelectSearchModule {}
