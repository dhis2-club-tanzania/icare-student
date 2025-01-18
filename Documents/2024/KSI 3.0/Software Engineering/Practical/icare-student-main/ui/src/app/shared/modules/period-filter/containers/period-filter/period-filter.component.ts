import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { getFormattedPeriodsByPeriodType } from "src/app/shared/helpers/format-dates-types.helper";
import { orderBy } from "lodash";
import { Dropdown } from "../../../form/models/dropdown.model";
import { FormValue } from "../../../form/models/form-value.model";

@Component({
  selector: "ngx-period-filter",
  templateUrl: "./period-filter.component.html",
  styleUrls: ["./period-filter.component.scss"],
})
export class PeriodFilterComponent implements OnInit {
  @Input() periodType: any;
  @Input() periodTypes: any[];
  @Input() maxHeight: string;
  @Input() selectedPeriodItems: any;
  currentYearlyPe: number;
  periodTypeId: string;
  periodsList: any[];
  currentYear: number;
  selectedPeriods: any[] = [];
  @Output() selectedItems: EventEmitter<any[]> = new EventEmitter<any[]>();
  periodTypesFormField: any;
  topHeaderHeight: number = 52;
  constructor() {}

  ngOnInit(): void {
    this.periodTypesFormField = new Dropdown({
      id: "periodType",
      key: "periodType",
      label: "Period type",
      options: this.periodType?.categories?.map((type) => {
        return {
          id: type?.id,
          key: type?.id,
          label: type?.name,
          value: type?.id,
        };
      }),
    });
    this.currentYear = new Date().getFullYear();
    this.currentYearlyPe = this.currentYear;
    this.periodTypeId = this.periodType?.default?.id;
    this.selectedPeriods = !this.selectedPeriodItems
      ? []
      : this.selectedPeriodItems;
    this.generatePeriodList();
  }

  onFormUpdate(formValue: FormValue): void {
    console.log(formValue.getValues());
  }

  generatePeriodList(): void {
    this.periodsList = getFormattedPeriodsByPeriodType(
      this.currentYearlyPe,
      this.periodTypeId
    );
  }

  setYearlyPeriod(event: Event, actionType: string): void {
    this.periodsList = [];
    event.stopPropagation();
    this.currentYearlyPe =
      actionType === "next"
        ? this.currentYearlyPe + 1
        : this.currentYearlyPe - 1;
    this.generatePeriodList();
  }

  onGetSelectedPeriods(selectedPe: any): void {
    this.selectedPeriods = [...this.selectedPeriods, selectedPe];
    this.periodsList =
      this.periodsList?.filter(
        (pe) =>
          (
            this.selectedPeriods?.filter(
              (selectedPe) => selectedPe?.id == pe?.id
            ) || []
          )?.length == 0
      ) || [];
    this.selectedItems.emit(this.selectedPeriods);
  }

  unSelectItem(event: Event, unSelectedPe: any): void {
    event.stopPropagation();
    this.selectedPeriods =
      this.selectedPeriods?.filter((pe) => pe?.id !== unSelectedPe?.id) || [];
    this.periodsList = orderBy(
      [...this.periodsList, unSelectedPe],
      ["value"],
      ["asc"]
    );
    this.selectedItems.emit(this.selectedPeriods);
  }
}
