import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { materialModules } from "../../material-modules";
import { FormModule } from "../form/form.module";
import { components } from "./components";
import { PeriodFilterComponent } from "./containers/period-filter/period-filter.component";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...materialModules, FormModule],
  declarations: [PeriodFilterComponent, ...components],
  providers: [],
  exports: [PeriodFilterComponent],
})
export class NgxPeriodFilterModule {}
