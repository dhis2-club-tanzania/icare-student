import { Component, Input, OnInit } from "@angular/core";
import { Observable, zip } from "rxjs";
import { ConceptSourcesService } from "src/app/core/services/concept-sources.service";
import { ReferenceTermsService } from "src/app/core/services/reference-terms.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { Api } from "src/app/shared/resources/openmrs";
import { flatten, omit } from "lodash";

@Component({
  selector: "app-test-order-parameters-relationship",
  templateUrl: "./test-order-parameters-relationship.component.html",
  styleUrls: ["./test-order-parameters-relationship.component.scss"],
})
export class TestOrderParametersRelationshipComponent implements OnInit {
  @Input() testRelationshipMappingSourceUuid: string;
  testOrderField: any;
  selectedTestOrder$: Observable<any>;
  testRelationshipConceptSource$: Observable<any>;
  conceptReferenceTerms$: Observable<any[]>;
  testOrderUuid: string;
  selectedReferenceTermUuid: string;
  saving: boolean = false;
  constructor(
    private conceptService: ConceptsService,
    private conceptSourceService: ConceptSourcesService,
    private api: Api,
    private conceptReferenceTermsService: ReferenceTermsService
  ) {}

  ngOnInit(): void {
    this.createTestOrderField();
    this.conceptReferenceTerms$ =
      this.conceptReferenceTermsService.getReferenceTermsBySource(
        this.testRelationshipMappingSourceUuid
      );
  }

  createTestOrderField(): void {
    this.testOrderField = new Dropdown({
      id: "testorder",
      key: "testorder",
      label: "Select Test Order",
      options: [],
      searchTerm: "TEST_ORDERS",
      conceptClass: "Test",
      shouldHaveLiveSearchForDropDownFields: true,
      searchControlType: "concept",
    });
  }

  onGetTestOrder(formValue: FormValue): void {
    this.testOrderUuid = formValue.getValues()?.testorder?.value;
    if (this.testOrderUuid) {
      this.selectedTestOrder$ = this.conceptService.getConceptDetailsByUuid(
        this.testOrderUuid,
        "custom:(uuid,display,setMembers:(uuid,display,mappings))"
      );
    }
  }

  onGetSelectedReferenceTerm(referenceTerm: any): void {
    // console.log(referenceTerm);
    this.selectedReferenceTermUuid = referenceTerm;
  }

  onSave(
    event: Event,
    selectedTestOrder: any,
    conceptReferenceTerms: any[]
  ): void {
    event.stopPropagation();
    const conceptMapType = "35543629-7d8c-11e1-909d-c80aa9edcf4e";
    this.saving = true;
    let mappings =
      selectedTestOrder?.mappings?.length > 0
        ? selectedTestOrder?.mappings?.map((item) => {
            return {
              conceptReferenceTerm: item?.uuid,
              conceptMapType,
            };
          })
        : [];
    mappings = [
      ...mappings,
      {
        conceptReferenceTerm: this.selectedReferenceTermUuid,
        conceptMapType,
      },
    ];

    const mergedTestOrdersAndMappings = flatten(
      selectedTestOrder?.setMembers?.map((setMember) => {
        return mappings?.map((mapping) => {
          return {
            ...mapping,
            concept: setMember?.uuid,
          };
        });
      })
    );
    zip(
      ...mergedTestOrdersAndMappings?.map((mapping: any) =>
        this.api.concept.createConceptMap(
          mapping?.concept,
          omit(mapping, "concept")
        )
      )
    ).subscribe((response: any) => {
      if (response && !response?.error) {
        this.saving = false;
        this.testOrderUuid = null;
        this.createTestOrderField();
      } else {
        this.saving = false;
      }
    });
  }
}
