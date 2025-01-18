import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { components } from "./components";
import { materialModules } from "../../material-modules";
import { StandardReportComponent } from "./containers/standard-report/standard-report.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { EditorModule } from "@tinymce/tinymce-angular";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { FormModule } from "../form/form.module";
import { NgxMultipleItemsFilterModule } from "../ngx-multiple-item-filter/ngx-multiple-item-filter.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...materialModules,
    AngularEditorModule,
    EditorModule,
    CKEditorModule,
    FormModule,
    NgxMultipleItemsFilterModule,
  ],
  declarations: [StandardReportComponent, ...components],
  providers: [],
  exports: [StandardReportComponent],
})
export class NgxStandardReportsModule {}
