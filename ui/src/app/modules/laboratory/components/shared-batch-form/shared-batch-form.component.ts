import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SamplesService } from "src/app/shared/services/samples.service";

@Component({
  selector: "app-shared-batch-form",
  templateUrl: "./shared-batch-form.component.html",
  styleUrls: ["./shared-batch-form.component.scss"],
})
export class SharedBatchFormComponent implements OnInit {
  @Input() useExistingBatch: boolean;
  @Input() hideDescription: boolean;
  batches$: Observable<any>;
  @Output() formData: EventEmitter<any> = new EventEmitter<any>();
  constructor(private samplesService: SamplesService) {}

  ngOnInit(): void {
    if (this.useExistingBatch) {
      this.batches$ = this.samplesService.getBatches().pipe(
        map((response: any) => {
          if (!response?.error) {
            return response;
          }
        })
      );
    }
  }

  onGetFormData(formData: any, batches?: any): void {
    const selectedBatch =
      batches && batches?.length > 0 && this.useExistingBatch
        ? (batches?.filter(
            (batch: any) => batch?.uuid === formData?.name?.value
          ) || [])[0]
        : null;
    if (selectedBatch) {
      localStorage.setItem("batchUuid", selectedBatch?.uuid);
    } else {
      localStorage.removeItem("batchUuid");
    }
    this.formData.emit({
      ...formData,
      useExistingBatch: this.useExistingBatch,
      selectedBatch: selectedBatch ? selectedBatch : null,
    });
  }
}
