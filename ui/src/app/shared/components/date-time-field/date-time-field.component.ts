import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import * as moment from "moment";
import { FormValue } from "../../modules/form/models/form-value.model";

@Component({
  selector: "app-date-time-field",
  templateUrl: "./date-time-field.component.html",
  styleUrls: ["./date-time-field.component.scss"],
})
export class DateTimeFieldComponent implements OnInit {
  @Input() dateTimeField: any;
  @Output() formUpdate = new EventEmitter();

  timeValid: boolean = true;
  selectedTime: string;
  selectedDate: any;
  formValues: FormValue;
  disabled: string;

  constructor() {}

  ngOnInit(): void {
    if (this.dateTimeField?.value){
      const hours =
        new Date(this.dateTimeField?.value).getHours().toString().length > 1
          ? new Date(this.dateTimeField?.value).getHours()
          : `0${new Date(this.dateTimeField?.value).getHours()}`;
      const minutes =
        new Date(this.dateTimeField?.value).getMinutes().toString().length > 1
          ? new Date(this.dateTimeField?.value).getMinutes()
          : `0${new Date(this.dateTimeField?.value).getMinutes()}`;
      this.selectedTime = `${hours}:${minutes}`
    }
  }

  onFormUpdate(formValues: FormValue) {
    this.formValues = formValues;
    const selectedDateValue =
      this.formValues.getValues()[this.dateTimeField?.id]?.value;
    this.selectedDate = selectedDateValue
      ? formValues.getValues()[this.dateTimeField?.id]
      : this.selectedDate;
    if(this.selectedTime && this.selectedDate?.value){
      const today = new Date();
      this.formValues.setValue(this.dateTimeField?.id, this.transformDate(
        moment(this.selectedDate?.value).toDate(),
        this.selectedTime,
        true
      ));
      if (today >= new Date(this.selectedDate.value)) {
        this.timeValid = true;
        this.formUpdate.emit(this.formValues);
      } else {
        this.timeValid = false;
      }
    }
  }

  getSelectedTime(e: any) {
    this.selectedTime = e?.target?.value;
    if (this.selectedTime && this.selectedDate?.value) {
      const today = new Date();
      this.selectedDate.value = this.transformDate(
        moment(this.selectedDate?.value).toDate(),
        this.selectedTime
      );
      this.formValues.setValue(
        this.dateTimeField?.id,
        this.transformDate(
          moment(this.selectedDate?.value).toDate(),
          this.selectedTime,
          true
        )
      );
      if (today >= this.selectedDate.value) {
        this.timeValid = true;
        this.formUpdate.emit(this.formValues);
      } else {
        this.timeValid = false;
      }
    }
  }

  transformDate(date: Date, time: string, returnString?: boolean){
    const year = date?.getFullYear();
    const month = returnString
      ? date?.getMonth().toString().length > 1
        ? date?.getMonth()
        : `0${date?.getMonth()+1}`
      : date?.getMonth();
    const day = date?.getDate();
    const hours = Number(time.split(':')[0]);
    const minutes = Number(time.split(':')[1]);
    if(returnString){
      return `${year}-${month}-${day} ${time}`
    } else {
      return new Date(year, Number(month), day, hours, minutes);
    }
  }
}
