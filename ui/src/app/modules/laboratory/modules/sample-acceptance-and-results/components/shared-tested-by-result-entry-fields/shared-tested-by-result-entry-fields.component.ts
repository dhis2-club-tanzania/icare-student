import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DateField } from "src/app/shared/modules/form/models/date-field.model";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { SampleAllocation } from "src/app/shared/resources/sample-allocations/models/allocation.model";
import { formatDateToYYMMDD } from "src/app/shared/services/visits.service";

@Component({
  selector: "app-shared-tested-by-result-entry-fields",
  templateUrl: "./shared-tested-by-result-entry-fields.component.html",
  styleUrls: ["./shared-tested-by-result-entry-fields.component.scss"],
})
export class SharedTestedByResultEntryFieldsComponent implements OnInit {
  @Input() order!: any;
  testedByFormFields!: any;
  @Output() selectedTestedByFormFields: EventEmitter<any> =
    new EventEmitter<any>();
  testedBy!: any;
  testedDate!: any;

  constructor() {}

  ngOnInit(): void {
    this.order?.allocations?.forEach((allocation) => {
      const formattedAllocation: any = new SampleAllocation(
        allocation
      ).toJson();
      if (formattedAllocation?.finalResult?.testedBy) {
        this.testedBy = !this.testedBy
          ? formattedAllocation?.finalResult?.testedBy
          : this.testedBy;
        this.testedDate = !this.testedDate
          ? formatDateToYYMMDD(
              new Date(formattedAllocation?.finalResult?.testedDate)
            )
          : this.testedDate;

        this.createTestedByDetailsField();
      } else if (formattedAllocation?.finalResult?.groups) {
        const results: any[] =
          formattedAllocation?.finalResult?.groups[
            formattedAllocation?.finalResult?.groups?.length - 1
          ]?.results;
        const currentResult = results[results?.length - 1];
        this.testedBy = !this.testedBy
          ? currentResult?.testedBy
          : this.testedBy;
        this.testedDate = !this.testedDate
          ? formatDateToYYMMDD(new Date(currentResult?.testedDate))
          : this.testedDate;
        this.createTestedByDetailsField();
      } else {
        this.createTestedByDetailsField();
      }
    });
  }

  createTestedByDetailsField(): void {
    this.testedByFormFields = [
      new Dropdown({
        id: "testedBy",
        key: "testedBy",
        label: "Tested By",
        options: [],
        value: this.testedBy?.uuid,
        searchControlType: "user",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      new DateField({
        id: "date",
        key: "date",
        value: this.testedDate,
        label: "Date tested",
      }),
    ];
  }

  onFormUpdate(formValue: FormValue): void {
    this.selectedTestedByFormFields.emit({
      date: formValue.getValues()?.date?.value
        ? formatDateToYYMMDD(new Date(formValue.getValues()?.date?.value))
        : null,
      testedBy: formValue.getValues()?.testedBy?.value
        ? formValue.getValues()?.testedBy?.value
        : null,
    });
  }
}
