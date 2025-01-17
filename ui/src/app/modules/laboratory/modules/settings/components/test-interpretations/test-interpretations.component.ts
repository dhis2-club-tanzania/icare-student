import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { TextArea } from "src/app/shared/modules/form/models/text-area.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";

@Component({
  selector: "app-test-interpretations",
  templateUrl: "./test-interpretations.component.html",
  styleUrls: ["./test-interpretations.component.scss"],
})
export class TestInterpretationsComponent implements OnInit {
  @Input() descriptions!: any[];
  interpretations: any[] = [];
  interpretationsFormFields: any = [];
  isFormValid: boolean = false;
  currentInterpretation!: any;
  @Output() definedInterpretations: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    // console.log(this.descriptions);
    this.interpretations = (
      this.descriptions?.filter(
        (description: any) =>
          description?.description?.indexOf("INTERPRETATION") > -1
      ) || []
    )?.map((description: any, index: number) => {
      let desc: any = {};
      desc["id"] = index + 1;
      desc["label"] = {
        value: description?.description?.split(":")[1],
      };
      desc["interpretation"] = {
        value: description?.description?.split("::")[1],
      };
      return desc;
    });
    this.definedInterpretations.emit(this.interpretations);
    this.createInterpretationsFields();
  }

  createInterpretationsFields(data?: any): void {
    this.interpretationsFormFields = [
      new Textbox({
        id: "label",
        key: "label",
        label: "Label",
        value: data?.label?.value,
        required: true,
      }),
      new TextArea({
        id: "interpretation",
        key: "interpretation",
        label: "Interpretations",
        value: data?.interpretation?.value,
        required: true,
      }),
    ];
  }

  onFormUpdate(formValue: FormValue): void {
    this.isFormValid = formValue.isValid;
    this.currentInterpretation = formValue.getValues();
  }

  onAddInterpretation(event: Event, currentInterpretation: any): void {
    event.stopPropagation();
    this.interpretations = [
      ...this.interpretations,
      { ...currentInterpretation, id: this.interpretations?.length + 1 },
    ];
    this.createInterpretationsFields();
    this.definedInterpretations.emit(this.interpretations);
  }

  onDelete(event: Event, currentInterpretationId: any): void {
    event.stopPropagation();
    this.interpretations =
      this.interpretations?.filter(
        (interpretation: any) => interpretation?.id !== currentInterpretationId
      ) || [];
    this.definedInterpretations.emit(this.interpretations);
  }

  onEdit(event: Event, currentInterpretation: any): void {
    event.stopPropagation();
    this.interpretations =
      this.interpretations?.filter(
        (interpretation: any) =>
          interpretation?.id !== currentInterpretation?.id
      ) || [];
    this.definedInterpretations.emit(this.interpretations);
    this.createInterpretationsFields(currentInterpretation);
  }
}
