import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";
import { keyBy } from "lodash";
import { formatDateToYYMMDD } from "../../helpers/format-date.helper";
import { DateField } from "../../modules/form/models/date-field.model";
import { Dropdown } from "../../modules/form/models/dropdown.model";
import { Api } from "../../resources/openmrs";


@Component({
  selector: 'app-appointments-list-filters',
  templateUrl: './appointments-list-filters.component.html',
  styleUrls: ['./appointments-list-filters.component.scss']
})
export class AppointmentsListFiltersComponent implements OnInit {
  @Input() filterCategories: any[];
  @Input() hideLocationFilter: boolean;
  filterCategoriesOptions$: Observable<any>;
  filterParameters: any[] = [];
  filterList: any[] = [];
  locationFilterField: any[]
  dateFilterField: any[]

  @Output() onFilterChanged = new EventEmitter<any>();

  constructor(private conceptService: ConceptsService, private api: Api) { }

  ngOnInit(): void {
    this.locationFilterField = [
      new Dropdown({
        id: "location",
        key: "location",
        options: [

        ],
        label: "Filter by location",
        required: true,
        searchControlType: "location",
        shouldHaveLiveSearchForDropDownFields: true,
      }),

    ]

    this.dateFilterField = [
      new DateField({
        id: "date",
        key: "date",
        label: "Filter by Date",
        value: "",
      })
    ]
  }

  handleLocationFilter(event) {
    console.log(event)
    this.onFilterChanged.emit(event.form.value)
  }

  handleDateFilter(event) {
    this.onFilterChanged.emit(event.form.value)
  }
}
