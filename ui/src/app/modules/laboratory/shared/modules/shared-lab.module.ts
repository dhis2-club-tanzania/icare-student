import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { materialModules } from "src/app/shared/material-modules";
import { labSharedComponents } from "../../components";
import { SharedModule } from "src/app/shared/shared.module";
import { sharedModals } from "../../modals";
import { FilterFieldsPipe } from "../../pipes/filter-fields.pipe";
import { FilterAuthorizationStatusesPipe } from "../../pipes/filter-authorization-statuses.pipe";
import { FilterAllocationsByNamePipe } from "../../pipes/filter-allocations-by-name.pipe";
@NgModule({
  imports: [CommonModule, ...materialModules, SharedModule],
  exports: [
    CommonModule,
    ...labSharedComponents,
    ...sharedModals,
    FilterFieldsPipe,
    FilterAuthorizationStatusesPipe,
    FilterAllocationsByNamePipe,
  ],
  entryComponents: [...sharedModals],
  declarations: [
    ...labSharedComponents,
    ...sharedModals,
    FilterFieldsPipe,
    FilterAuthorizationStatusesPipe,
    FilterAllocationsByNamePipe,
  ],
  providers: [],
})
export class SharedLabModule {}
