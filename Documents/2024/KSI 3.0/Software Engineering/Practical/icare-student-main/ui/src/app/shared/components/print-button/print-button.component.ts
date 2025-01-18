import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/reducers";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-print-button",
  templateUrl: "./print-button.component.html",
  styleUrls: ["./print-button.component.scss"],
})
export class PrintButtonComponent implements OnInit {
  classes: string = "";

  @Input() showText: string;
  @Input() toolTipText: string;
  @Input() iconName: string;
  @Input() classesList: string[];
  @Input() ElementToBePrinted: any;

  @Output() print = new EventEmitter();
  currentUser: any;
  todaysDate: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.classesList.forEach((className) => (this.classes += ` ${className}`));

    this.store.select(getCurrentUserDetails).subscribe({
      next: (currentUser) => {
        this.currentUser = currentUser;
      },

      error: (error) => {
        throw error;
      },
    });
    //Construct printing date string
    let today = new Date();
    let year = today.getFullYear();
    let month =
      today.getMonth().toString().length > 1
        ? today.getMonth() + 1
        : `0${today.getMonth() + 1}`;
    let day =
      today.getDate().toString().length > 1
        ? today.getDate()
        : `0${today.getDate()}`;
    let hour = today.getHours();
    let minutes = today.getMinutes();
    this.todaysDate = `${day}/${month}/${year} ${hour}:${minutes}`;
  }

  onPrint() {
    if (this.ElementToBePrinted) {
      this.ElementToBePrinted["CurrentUser"] = this.currentUser;
      this.ElementToBePrinted["PrintingDate"] = this.todaysDate;
    } else {
      this.ElementToBePrinted = {
        CurrentUser: this.currentUser,
        PrintingDate: this.todaysDate,
      };
    }
    //console.log("the elemets ", this.ElementToBePrinted);
    this.print.emit(this.ElementToBePrinted);
  }
}
