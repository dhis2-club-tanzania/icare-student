import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable, of } from "rxjs";
import { ConceptMappingsService } from "src/app/core/services/concept-mappings.service";
import { ReferenceTermsService } from "src/app/core/services/reference-terms.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { ConceptsourceGet } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-codes-selection",
  templateUrl: "./codes-selection.component.html",
  styleUrls: ["./codes-selection.component.scss"],
})
export class CodesSelectionComponent implements OnInit {
  @Input() conceptSources: ConceptsourceGet[];
  @Input() mappings: any[];
  @Input() selectedCodes: any[];
  codesMappingsSourceField: any;
  formData: any = {};
  codedOptions$: Observable<any[]> = of([]);

  selectedCodingSource: string;
  @Output() selectedCodesItems: EventEmitter<any[]> = new EventEmitter<any[]>();

  errors: any[] = [];
  constructor(
    private conceptReferenceService: ReferenceTermsService,
    private conceptMappingService: ConceptMappingsService
  ) {}

  ngOnInit(): void {
    this.createCodesMappingSourceField(this.mappings);
  }

  createCodesMappingSourceField(data?: any): void {
    this.codesMappingsSourceField = new Dropdown({
      id: "source",
      key: "source",
      label: "Coding source",
      value:
        data && data?.length > 0
          ? data[0]?.conceptReferenceTerm?.conceptSource?.uuid
          : null,
      options: this.conceptSources.map((source) => {
        return {
          key: source?.uuid,
          label: source?.display,
          value: source?.uuid,
          name: source?.display,
        };
      }),
    });
  }

  onGetSelectedMembers(items: any[]): void {
    this.selectedCodes = items;
    this.selectedCodesItems.emit(this.selectedCodes);
  }

  onFormUpdateForSource(formValue: FormValue): void {
    const values = formValue.getValues();
    this.formData = { ...this.formData, ...values };
    this.codedOptions$ = of([]);
    this.selectedCodingSource = values["source"]?.value;
    if (values["source"]?.value)
      this.conceptReferenceService
        .getReferenceTermsBySource(this.selectedCodingSource)
        .subscribe((response) => {
          this.codedOptions$ = of(
            response.map((referenceTerm) => {
              return {
                ...referenceTerm,
                value: referenceTerm?.uuid,
                label: referenceTerm?.display,
                key: referenceTerm?.uuid,
                name: referenceTerm?.display,
                uuid: referenceTerm?.uuid,
              };
            })
          );
        });
  }

  onDeleteMapping(event: Event, item: any): void {
    event.stopPropagation();
    this.conceptMappingService
      .deleteConceptMapping(item?.conceptUuid, item?.uuid)
      .subscribe((response) => {
        if (response && !response?.error) {
          this.conceptReferenceService
            .getReferenceTermsBySource(this.selectedCodingSource)
            .subscribe((response) => {
              this.codedOptions$ = of(
                response.map((referenceTerm) => {
                  return {
                    ...referenceTerm,
                    value: referenceTerm?.uuid,
                    label: referenceTerm?.display,
                    key: referenceTerm?.uuid,
                    name: referenceTerm?.display,
                    uuid: referenceTerm?.uuid,
                  };
                })
              );
            });
        } else {
          this.errors = [...this.errors, response];
        }
      });
  }
}
