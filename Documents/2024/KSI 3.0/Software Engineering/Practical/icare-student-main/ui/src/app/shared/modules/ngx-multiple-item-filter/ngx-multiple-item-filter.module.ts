import { NgModule } from "@angular/core";
import { Api } from "../../resources/openmrs";
import { MultipleItemsFilterComponent } from "./containers/multiple-items-filter/multiple-items-filter.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { materialModules } from "../../material-modules";
import { components } from "./components";
import { FilterFilterItemsPipe } from './pipes/filter-filter-items.pipe';
// TODO: Module import issue thats why stopped, expected to be generic metadata selection component

@NgModule({
  declarations: [MultipleItemsFilterComponent, ...components, FilterFilterItemsPipe],
  imports: [CommonModule, ReactiveFormsModule, ...materialModules],
  exports: [MultipleItemsFilterComponent],
  providers: [Api],
})
export class NgxMultipleItemsFilterModule {}
