import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { materialModules } from "src/app/shared/material-modules";
import { labSharedComponents } from "../../components";
import { SharedModule } from "src/app/shared/shared.module";
import { sharedModals } from "../../modals";
import { FilterFieldsPipe } from "../../pipes/filter-fields.pipe";
@NgModule({
    imports: [CommonModule, ...materialModules, SharedModule],
    exports: [
        CommonModule,
        ...labSharedComponents,
        ...sharedModals,
        FilterFieldsPipe,
    ],
    declarations: [...labSharedComponents, ...sharedModals, FilterFieldsPipe],
    providers: []
})
export class SharedLabModule {}
