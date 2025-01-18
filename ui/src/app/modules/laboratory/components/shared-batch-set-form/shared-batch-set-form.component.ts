import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SamplesService } from "src/app/shared/services/samples.service";

@Component({
  selector: "app-shared-batch-set-form",
  templateUrl: "./shared-batch-set-form.component.html",
  styleUrls: ["./shared-batch-set-form.component.scss"],
})
export class SharedBatchSetFormComponent implements OnInit {
  @Input() useExistingBatchSet: boolean;
  @Input() hideDescription: boolean;
  batchsets$: Observable<any>;
  @Output() formData: EventEmitter<any> = new EventEmitter<any>();
  constructor(private samplesService: SamplesService) {}

  ngOnInit(): void {
    if (this.useExistingBatchSet) {
      this.batchsets$ = this.samplesService.getBatchsets().pipe(
        map((response: any) => {
          if (!response?.error) {
            return response;
          }
        })
      );
    }
  }

  onGetFormData(formData: any, batchsets?: any): void {
    const selectedBatchset =
      batchsets && batchsets?.length > 0 && this.useExistingBatchSet
        ? (batchsets?.filter(
            (batchset: any) => batchset?.uuid === formData?.name?.value
          ) || [])[0]
        : null;
    if (selectedBatchset) {
      localStorage.setItem("batchsetUuid", selectedBatchset?.uuid);
    } else {
      localStorage.removeItem("batchsetUuid");
    }
    this.formData.emit({
      ...formData,
      useExistingBatchSet: this.useExistingBatchSet,
      selectedBatchset: selectedBatchset ? selectedBatchset : null,
    });
  }
}
