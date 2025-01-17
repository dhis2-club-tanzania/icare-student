import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSelect, MatSelectChange } from "@angular/material/select";

import { ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

interface Bank {
  id: string;
  name: string;
}

@Component({
  selector: "app-multiple-results-entry",
  templateUrl: "./multiple-results-entry.component.html",
  styleUrls: ["./multiple-results-entry.component.scss"],
})
export class MultipleResultsEntryComponent implements OnInit {
  version = null;
  @Input() options: any[];
  @Input() value: any;
  @Output() selectedList: EventEmitter<any[]> = new EventEmitter<any[]>();

  multipleSelectionFormControl: FormControl = new FormControl();
  list: any[];

  /** control for the selected item */
  public listCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public listFilterCtrl: FormControl = new FormControl();

  /** control for the selected item for multi-selection */
  public listMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public listMultiFilterCtrl: FormControl = new FormControl();

  /** list of items filtered by search keyword */
  public filteredList: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

  /** list of items filtered by search keyword for multi-selection */
  public filteredMultiList: ReplaySubject<any> = new ReplaySubject<any>(1);

  @ViewChild("singleSelect") singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  ngOnInit() {
    // this.selectedList.emit(this.value);
    this.setList(this.options);
  }

  setList(list: any[]) {
    // console.log(list);
    this.list = list;
    const defaultValues =
      this.list?.filter(
        (item) =>
          (this.value?.filter((val) => val === item?.value) || [])?.length > 0
      ) || [];
    // set default selection
    this.listMultiCtrl.setValue(defaultValues);
    this.selectedList.emit(this.listMultiCtrl.value);

    // load the initial list
    this.filteredList.next(this.list.slice());
    this.filteredMultiList.next(this.list.slice());

    // listen for search field value changes
    this.listFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterList();
      });
    this.listMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterListMulti();
      });
  }

  ngAfterViewInit() {
    // this.setInitialValue();
  }

  getSelectedValues(event: MatSelectChange): void {
    this.selectedList.emit(this.listMultiCtrl.value);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredList are loaded initially
   */
  private setInitialValue() {
    this.filteredList
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: any, b: any) => a?.key === b?.key;
      });
  }

  private filterList() {
    if (!this.list) {
      return;
    }
    // get the search keyword
    let search = this.listFilterCtrl.value;
    if (!search) {
      this.filteredList.next(this.list.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the list
    this.filteredList.next(
      this.list.filter((item) => item?.name.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterListMulti() {
    if (!this.list) {
      return;
    }
    // get the search keyword
    let search = this.listMultiFilterCtrl.value;
    if (!search) {
      this.filteredMultiList.next(this.list.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredMultiList.next(
      this.list.filter((item) => item?.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
