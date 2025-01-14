import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { Field } from "src/app/shared/modules/form/models/field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-shared-batch-entry-fields",
  templateUrl: "./shared-batch-entry-fields.component.html",
  styleUrls: ["./shared-batch-entry-fields.component.scss"],
})
export class SharedBatchEntryFieldsComponent implements OnInit {
  @Input() dropDown: boolean;
  @Input() options: any[];
  @Input() hideDescription: boolean;
  @Input() nameFieldName: string;
  fields: Field<any>[];
  @Output() formData: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    // console.log("OPTIONS:", this.options);
    this.fields = [
      !this.dropDown
        ? new Textbox({
            id: "name",
            key: "name",
            label: this.nameFieldName,
            required: true,
          })
        : new Dropdown({
            id: "name",
            key: "name",
            label: this.nameFieldName,
            options: this.options?.map((option: any) => {
              return {
                key: option?.id ? option?.id : option?.uuid,
                value: option?.id ? option?.id : option?.uuid,
                name: option?.name ? option?.name : option?.display,
                label: option?.name ? option?.name : option?.display,
              };
            }),
          }),
      !this.hideDescription
        ? new TextArea({
            id: "description",
            key: "description",
            label: "Description",
            required: true,
          })
        : null,
    ]?.filter((field: any) => field);
  }

  onFormUpdate(formValue: FormValue): void {
    this.formData.emit(formValue.getValues());
  }
}
