import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, observable } from "rxjs";
import { tap } from "rxjs/operators";
import * as _ from "lodash";
import { ReportService } from "src/app/core/services/report.service";

@Component({
  selector: "app-concept-edit",
  templateUrl: "./concept-edit.component.html",
  styleUrls: ["./concept-edit.component.scss"],
})
export class ConceptEditComponent implements OnInit {
  conceptData: any;
  concept: any = null;
  fetchingConcept: boolean = false;
  conceptFetched: boolean = false;

  searchingDataElements: boolean = false;
  showDataElementsSearchList: boolean = false;

  searchingConceptSet: boolean = false;
  showConceptSetSearchList: boolean = false;

  dataElements$: Observable<any>;
  conceptsSet$: Observable<any>;

  conceptSetMembers: any[] = [];
  mapping: any;
  settingMap: boolean;

  selectedDataElement: any;
  selectedDataElementName: string = "";
  selectedCategoryOptionCombo: any;

  constructor(
    private dialogRef: MatDialogRef<ConceptEditComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private reportService: ReportService
  ) {
    this.conceptData = data;
  }

  ngOnInit(): void {
    this.fetchingConcept = true;
    this.conceptFetched = false;

    this.reportService
      .getDataConceptByFullySpecifiedName(this.conceptData?.name)
      .subscribe((resp) => {
        this.concept = resp?.results?.length > 0 ? resp?.results[0] : null;
        //console.log("the concept", this.concept)

        this.fetchingConcept = false;
        this.conceptFetched = true;
      });
  }

  onSearchDataElement(e) {
    if (e) {
      e.stopPropagation();
      this.searchingDataElements = true;
      this.showDataElementsSearchList = false;
      this.dataElements$ = this.reportService
        .searchDataElement(e.target.value)
        .pipe(
          tap(() => {
            this.searchingDataElements = false;
            this.showDataElementsSearchList = true;
          })
        );
    }
  }

  onCloseDialog(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }

  addConceptToSetMember(concept) {
    this.conceptSetMembers = [...this.conceptSetMembers, concept];
    this.showConceptSetSearchList = false;
  }

  onSelectDataElement(dataElement) {
    this.selectedCategoryOptionCombo = dataElement;
    this.showDataElementsSearchList = false;
    this.selectedDataElement = dataElement;
    this.selectedDataElementName = this.selectedDataElement?.name;
  }

  onSelectCategoryOptionCombo(categoryOptionCombo) {
    this.settingMap = true;
    this.selectedCategoryOptionCombo = categoryOptionCombo;

    this.addMapping();
  }

  addMapping() {
    let conceptRefTerm = `${this.selectedDataElement?.id}-${this.selectedCategoryOptionCombo?.id}`;
    //console.log('the ref term :: ', conceptRefTerm);

    this.reportService
      .searchConceptReferenceTerm(conceptRefTerm)
      .subscribe((res) => {
        // console.log(res);
        //check if reference term exists
        if (res?.results?.length > 0) {
          // console.log('here', res?.results);
          //used the existing ref term

          this.mapping = {
            conceptReferenceTerm: res?.results[0]["uuid"],
            conceptMapType: "35543629-7d8c-11e1-909d-c80aa9edcf4e",
          };

          this.settingMap = false;
        } else {
          // console.log('there');
          //created a ref term
          let refTermPayload = {
            name: `${this.selectedDataElement?.name}_${this.selectedCategoryOptionCombo?.name}`,
            code: conceptRefTerm,
            description: "description for the concept reference term",
            conceptSource: "2baf47eb-4a17-4eb2-b496-6c792e9ebf6f",
            version: "1.0.0",
          };

          this.reportService
            .createConceptReferenceTerm(refTermPayload)
            .subscribe((refTermResponse: any) => {
              // console.log('refetrm resp :: ', refTermResponse);

              this.mapping = {
                conceptReferenceTerm: refTermResponse?.uuid,
                conceptMapType: "35543629-7d8c-11e1-909d-c80aa9edcf4e",
              };

              this.settingMap = false;
            });
        }
      });
  }

  addConceptToSetMembers(concept) {
    this.conceptSetMembers = [...this.conceptSetMembers, { ...concept }];
  }

  onSearchConcept(e) {
    if (e) {
      e.stopPropagation();
      this.searchingConceptSet = true;
      this.showConceptSetSearchList = false;
      this.conceptsSet$ = this.reportService.searchConcept(e.target.value).pipe(
        tap(() => {
          this.searchingConceptSet = false;
          this.showConceptSetSearchList = true;
        })
      );
    }
  }

  saveConcept() {
    let conceptPayload = {
      names: [
        {
          name: this.conceptData?.name,
          locale: "en",
          localePreferred: true,
          conceptNameType: "FULLY_SPECIFIED",
        },
      ],
      datatype: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
      version: "1.2.2",
      conceptClass: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
      mappings: [{ ...this.mapping }],
      descriptions: [
        {
          description: `Mapping concept ${this.conceptData?.name} for data element`,
          locale: "en",
        },
      ],
      set: true,
      setMembers: _.map(this.conceptSetMembers, (conceptSetMember) => {
        return {
          uuid: conceptSetMember?.uuid,
        };
      }),
    };

    this.reportService.createMappingConcept(conceptPayload).subscribe((res) => {
      //console.log("VVVV ", res)
    });
  }

  updateConcept() {}
}
