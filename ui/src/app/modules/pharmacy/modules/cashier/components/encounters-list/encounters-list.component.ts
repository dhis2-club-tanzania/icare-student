import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PharmacyService } from "src/app/modules/pharmacy/services/pharmacy.service";
import { keyBy } from "lodash";

@Component({
  selector: "app-encounters-list",
  templateUrl: "./encounters-list.component.html",
  styleUrls: ["./encounters-list.component.scss"],
})
export class EncountersListComponent implements OnInit {
  @Input() customForm: any;
  @Input() encounterTypeUuid: string;
  startIndex: number = 0;
  limit: number = 10;
  encounters$: Observable<any>;
  encounters: any[];
  headersKeys: any[];
  headers: any[] = [
    {
      id: "no",
      name: "No.",
    },
  ];
  constructor(private pharmacyService: PharmacyService) {}

  ngOnInit(): void {
    this.headers = [
      ...this.headers,
      ...(this.customForm ? this.customForm?.formFields : []),
    ];
    this.headersKeys = this.headers?.map((header: any) => header?.id);
    this.loadEncounters();
  }

  loadEncounters(): void {
    let params = {};
    params["startIndex"] = this.startIndex;
    params["limit"] = this.limit;
    params["encounterTypeUuid"] = this.encounterTypeUuid;
    // this.encounters$ = this.pharmacyService
    //   .getEncounters({
    //     q: "external",
    //     v: "custom:(uuid,display,obs)",
    //   })
    this.encounters$ = this.pharmacyService
      .getEncountersByPagination(params)
      .pipe(
        map((response: any) => {
          return {
            ...response,
            results: response?.results?.map((result: any, index: number) => {
              let data = {};
              data["no"] = index + 1 + this.startIndex;
              // Object.keys();
              this.customForm
                ? this.customForm?.formFields.forEach((field: any) => {
                    const observations = result.obs?.map((observation: any) => {
                      return {
                        ...observation,
                        key: observation?.concept?.uuid,
                      };
                    });
                    data[field?.id] =
                      keyBy(observations, "key")[field?.id] &&
                      keyBy(observations, "key")[field?.id]?.value
                        ? keyBy(observations, "key")[field?.id]?.value
                        : "-";
                  })
                : null;
              return data;
            }),
          };
        })
      );
    this.encounters$.subscribe((encountersData: any) => {
      if (encountersData) {
        this.encounters = encountersData?.results;
      }
    });
  }

  onGetList(event: Event, actionType: string): void {
    event.stopPropagation();
    this.startIndex =
      actionType === "next"
        ? this.startIndex + 1 + this.limit
        : this.startIndex - this.limit - 1;
    this.loadEncounters();
  }
}
