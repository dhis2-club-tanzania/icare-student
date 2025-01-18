import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { from, fromEvent, Observable, of, Subject, Subscription } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  take,
  tap,
} from "rxjs/operators";
import { SamplesService } from "src/app/shared/services/samples.service";

@Component({
  selector: "app-samples-list",
  templateUrl: "./samples-list.component.html",
  styleUrls: ["./samples-list.component.scss"],
})
export class SamplesListComponent implements OnInit {
  @Input() departments: any[];
  @Input() specimenSources: any[];
  @Input() codedSampleRejectionReasons: any[];
  @ViewChild("search") elementRef: ElementRef;
  samples$: Observable<any>;
  page: number;
  pageSize: number;
  errors: any[] = [];
  pageCounts: any[] = [10, 20, 25, 50, 100, 200];
  searchText: string;
  subject = new Subject<string>();
  constructor(private samplesService: SamplesService) {
    this.subject
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe(() => {
        this.getList();
      });
  }

  ngOnInit(): void {
    this.page = 1;
    this.pageSize = 10;
    this.getList();
  }

  searchSamples(): void {
    // this.subject.next()
  }
  getList(): void {
    this.samples$ = this.samplesService
      .getSamplesByPaginationDetails(
        { page: this.page, pageSize: this.pageSize },
        null,
        this.searchText,
        this.departments,
        this.specimenSources,
        this.codedSampleRejectionReasons
      )
      .pipe(
        tap((response: any) => {
          if (response?.error || response.stackTrace) {
            this.errors =
              response?.error && !response?.stackTrace
                ? [...this.errors, response?.error]
                : response?.stackTrace
                ? [
                    ...this.errors,
                    {
                      error: {
                        message: response?.message,
                      },
                    },
                  ]
                : [
                    ...this.errors,
                    {
                      error: {
                        message: "Unknown error occurred!",
                      },
                    },
                  ];
          }
        })
      );
  }

  onGetSamples(event: Event, action: string, pager: any): void {
    event.stopPropagation();
    this.page = action === "prev" ? this.page - 1 : this.page + 1;
    this.getList();
  }

  onPageChange(event) {
    this.page = event.pageIndex + 1;
    this.pageSize = Number(event?.pageSize);
    this.getList();
  }
}
