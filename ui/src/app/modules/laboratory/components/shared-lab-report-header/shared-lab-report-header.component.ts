import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppState } from "src/app/store/reducers";
import { getParentLocation } from "src/app/store/selectors";

@Component({
  selector: "app-shared-lab-report-header",
  templateUrl: "./shared-lab-report-header.component.html",
  styleUrls: ["./shared-lab-report-header.component.scss"],
})
export class SharedLabReportHeaderComponent implements OnInit {
  locationDetails$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.locationDetails$ = this.store.select(getParentLocation).pipe(
      map((response) => {
        // TODO: Softcode attribute type uuid
        return {
          ...response,
          logo:
            response?.attributes?.length > 0
              ? (response?.attributes?.filter(
                  (attribute) =>
                    attribute?.attributeType?.uuid ===
                      "e935ea8e-5959-458b-a10b-c06446849dc3" ||
                    attribute?.attributeType?.uuid ===
                      "09e78d52-d02f-44aa-b055-6bc01c41fa64"
                ) || [])[0]?.value
              : null,
        };
      })
    );
  }
}
