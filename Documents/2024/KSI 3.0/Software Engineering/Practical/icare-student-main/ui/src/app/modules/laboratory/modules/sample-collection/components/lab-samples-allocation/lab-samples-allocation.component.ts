import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { SampleObject } from "../../../../resources/models";
import { getAllLabSamples } from "../../../../store/selectors/samples.selectors";
import { loadConcept } from "src/app/store/actions";
import { TestContainer } from "../../../../resources/models/test-containers.model";
import { getTestContainers } from "src/app/store/selectors";
import {
  ConceptCreateFull,
  UserGetFull,
} from "src/app/shared/resources/openmrs";
import { getSpecimenSources } from "../../../../store/selectors/specimen-sources-and-tests-management.selectors";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-lab-samples-allocation",
  templateUrl: "./lab-samples-allocation.component.html",
  styleUrls: ["./lab-samples-allocation.component.scss"],
})
export class LabSamplesAllocationComponent implements OnInit {
  selectedTab = new FormControl(0);
  expandedRow: number;
  samples$: Observable<SampleObject[]>;
  testContainers$: Observable<TestContainer[]>;
  currentUser$: Observable<UserGetFull>;
  specimenSources$: Observable<ConceptCreateFull>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.specimenSources$ = this.store.select(getSpecimenSources, {
      name: "Specimen sources",
    });
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.samples$ = this.store.select(getAllLabSamples);

    /**
     * TODO: soft code*/
    this.store.dispatch(
      loadConcept({
        name: "Laboratory tests containers",
        fields: "custom:(uuid,name,answers:(uuid,display))",
      })
    );

    this.testContainers$ = this.store.select(getTestContainers, {
      name: "Laboratory tests containers",
    });
  }

  changeTab(val): void {
    this.selectedTab.setValue(val);
  }

  onToggleExpand(rowNumber) {
    if (this.expandedRow === rowNumber) {
      this.expandedRow = undefined;
    } else {
      this.expandedRow = rowNumber;
    }
  }
}
