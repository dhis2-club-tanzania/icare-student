import { ThrowStmt } from "@angular/compiler";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { from, Observable, of, zip } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { flatten } from "lodash";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { Api } from "src/app/shared/resources/openmrs";
import { ItemPriceService } from "../../services/item-price.service";

@Component({
  selector: "app-manage-item-price",
  templateUrl: "./manage-item-price.component.html",
  styleUrls: ["./manage-item-price.component.scss"],
})
export class ManageItemPriceComponent implements OnInit {
  form: any;
  formValue: FormValue;
  loadingForm: boolean;
  showNewForm: boolean;
  availableItems$: Observable<any>;
  availableItems: any;
  searching: boolean;
  showItems: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ManageItemPriceComponent>,
    private itemPriceService: ItemPriceService,
    private api: Api
  ) {}

  ngOnInit() {
    this.loadingForm = false;
    this.itemPriceService.getConceptClasses().subscribe((conceptClasses) => {
      this.loadingForm = false;
      this.form = [
        new Textbox({
          key: "name",
          label: "Name",
        }),
        new Dropdown({
          key: "class",
          label: "Class",
          options: (conceptClasses || []).map((conceptClass) => {
            return {
              key: conceptClass?.uuid,
              label: conceptClass.display,
              value: conceptClass?.uuid,
            };
          }),
        }),
      ];
    });
  }

  onCancel(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }

  onSave(e) {
    e.stopPropagation();
    const formValues = this.formValue.getValues();
    const conceptClass = formValues?.class?.value;
    this.dialogRef.close({
      priceItemInput: {
        name: formValues?.name?.value,
        class: formValues?.class?.value,
        isConcept: conceptClass !== "Drug",
        isDrug: conceptClass === "Drug",
      },
    });
  }

  onFormUpdate(formValue: FormValue) {
    this.formValue = formValue;
  }

  onToggleNewForm(e) {
    e.stopPropagation();
    this.showNewForm = !this.showNewForm;
  }

  onSearchItems(e) {
    e.stopPropagation();
    this.searching = true;
    this.showItems = false;
    this.getItems(e.target.value)
      .pipe(
        tap(() => {
          this.searching = false;
          this.showItems = true;
        })
      )
      .subscribe((res) => {
        this.availableItems = res;
      });
  }

  onSelectItem(e, item) {
    this.dialogRef.close({
      concept: item.type === "CONCEPT" ? item : null,
      drug: item.type === "DRUG" ? item : null,
    });
  }

  getItems(searchTerm: string): Observable<any> {
    return of(searchTerm).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(() => {
        return zip(
          from(this.api.concept.getAllConcepts({ name: searchTerm })),
          from(this.api.drug.getAllDrugs({ q: searchTerm }))
        ).pipe(
          map((res: any[]) => {
            return flatten(
              (res || []).map((resultItem, index) =>
                (resultItem?.results || []).map((item) => {
                  return { ...item, type: index === 0 ? "CONCEPT" : "DRUG" };
                })
              )
            );
          })
        );
      })
    );
  }
}
