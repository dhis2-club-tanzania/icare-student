import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { ConceptsService } from "../../resources/concepts/services/concepts.service";
import { keyBy } from "lodash";

@Component({
  selector: "app-patient-list-filters",
  templateUrl: "./patient-list-filters.component.html",
  styleUrls: ["./patient-list-filters.component.scss"],
})
export class PatientListFiltersComponent implements OnInit {
  @Input() filterCategories: any[];
  filterCategoriesOptions$: Observable<any>;
  filterParameters: any[] = [];
  filterList: any[] = [];

  @Output() onFilterChanged = new EventEmitter<any>();

  constructor(private conceptService: ConceptsService) {}

  ngOnInit(): void {
    this.filterCategoriesOptions$ = zip(
      ...this.filterCategories?.map((category) =>
        this.conceptService.getConceptDetailsByUuid(
          category?.value,
          "custom:(uuid,display,setMembers:(uuid,display))"
        )
      )
    ).pipe(
      map((response) => {
        return keyBy(response, "uuid");
      })
    );
  }

  getValue(event: any) {
    // Filter out existing filters to use only the current selected filters
    if (this.filterList?.length > 0) {
      this.filterList.map((filter) => {
        if (filter?.visitAttributeType === event?.value?.visitAttributeType) {
          const index = this.filterList?.indexOf(filter, 0);
          if (index > -1) {
            return this.filterList?.splice(index, 1);
          }
        }
      });
      this.filterList?.push(event.value);
    } else {
      this.filterList?.push(event.value);
    }

    // construct a filters strings list
    this.filterList?.map((filter) => {
      // check if a value is selected and not the all option
      if (filter?.value && filter?.filterIndex === event?.value?.filterIndex) {
        if (
          filter?.value?.display === "PENDING" ||
          filter?.value?.display === "PAID"
        ) {
          var searchPattern = new RegExp("^&paymentStatus=");

          this.filterParameters = this.filterOutStringFromStringList(
            this.filterParameters,
            searchPattern
          );

          this.filterParameters = [
            ...this.filterParameters,
            `&paymentStatus=${filter?.value?.display}`,
          ];
        }
      }

      if (
        filter?.value &&
        filter?.value?.display !== "PENDING" &&
        filter?.value?.display !== "PAID"
      ) {
        var searchPattern = new RegExp("^&attributeValueReference=");

        this.filterParameters = this.filterOutStringFromStringList(
          this.filterParameters,
          searchPattern
        );

        this.filterParameters = [
          ...this.filterParameters,
          `&attributeValueReference=${filter?.value?.uuid}`,
        ];
      }

      // remove one filter statement from the list All selected
      if (!filter?.value && filter?.filterIndex === 0) {
        // use function filterOutStringFromStringList to remove filter parameter from the list of parameters
        var searchPattern = new RegExp("^&paymentStatus=");
        this.filterParameters = this.filterOutStringFromStringList(
          this.filterParameters,
          searchPattern
        );
      }

      if (!filter?.value && filter?.filterIndex === 1) {
        // use function filterOutStringFromStringList to remove filter parameter from the list of parameters
        var searchPattern = new RegExp("^&attributeValueReference=");
        this.filterParameters = this.filterOutStringFromStringList(
          this.filterParameters,
          searchPattern
        );
      }
    });

    // Construct the filter statement string to be emmited
    let parametersString = "";
    this.filterParameters.map(
      (parameter) => (parametersString = `${parametersString}${parameter}`)
    );

    this.onFilterChanged.emit(parametersString);
  }

  //Filter out string statement from String List based on regex pattern
  filterOutStringFromStringList(stringList: string[], regex: RegExp): any {
    stringList.map((item) => {
      if (regex.test(item)) {
        const index = stringList.indexOf(item, 0);
        if (index > -1) {
          return stringList.splice(index, 1);
        }
      }
    });
    return stringList;
  }
}
