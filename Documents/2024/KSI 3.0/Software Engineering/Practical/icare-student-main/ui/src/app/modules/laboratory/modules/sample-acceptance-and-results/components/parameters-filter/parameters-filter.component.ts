import { Component, OnInit, Input } from '@angular/core';
import { formatDateToYYMMDD } from 'src/app/services/visits.service';

@Component({
  selector: 'app-parameters-filter',
  templateUrl: './parameters-filter.component.html',
  styleUrls: ['./parameters-filter.component.scss']
})
export class ParametersFilterComponent implements OnInit {
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;
  startDate: any;
  endDate: any;
  @Input() parameters: any;
  constructor() {
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    const currentYear = new Date().getFullYear();
    this.minStartDate = new Date(currentYear - 20, 0, 1);
    this.maxStartDate = new Date(currentYear, currentMonth, currentDate);
    this.minEndDate = new Date(currentYear - 20, 0, 1);
    this.maxEndDate = new Date(currentYear, currentMonth, currentDate);
  }

  ngOnInit(): void {
    if (this.parameters) {
      this.startDate = this.parameters.startDate;
      this.endDate = this.parameters.endDate;
      this.minEndDate = new Date(
        Number(this.startDate.split('-')[0]),
        Number(this.startDate.split('-')[1]) - 1,
        Number(this.startDate.split('-')[2]) + 1
      );
    }
  }

  getDate(dateValue, type) {
    if (type == 'start_date') {
      this.startDate = formatDateToYYMMDD(dateValue);
      this.minEndDate = new Date(
        Number(this.startDate.split('-')[0]),
        Number(this.startDate.split('-')[1]) - 1,
        Number(this.startDate.split('-')[2]) + 1
      );
    } else {
      this.endDate = formatDateToYYMMDD(dateValue);
    }
  }
}
