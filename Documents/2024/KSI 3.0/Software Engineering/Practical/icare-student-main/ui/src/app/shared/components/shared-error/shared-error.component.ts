import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { AppState } from "src/app/store/reducers";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";
import { getGroupedObservationByConcept } from "src/app/store/selectors/observation.selectors";
import { StandardError } from "../../models/error-type.models";

@Component({
  selector: "app-shared-error",
  templateUrl: "./shared-error.component.html",
  styleUrls: ["./shared-error.component.scss"],
})
export class SharedErrorComponent implements OnInit {
  @Input() errors: error[];
  @Input() dismissible: boolean = true;

  toggleIndex?: string;
  /**
   * This is the component specific for displaying erros.
   * Customize it accordingly by never delete what's already written as it may disrupt some other parts of the software
   * 
   * ***************** Declare errors array from which you would add the like of the below object ********************
      [
        {
          error: {
            message: "Your error message"
            detail?: "More details of the error if any"
            code?: "Error code if any"
          }
        }
      ]
     *****************************************************************************************************************
   */

  constructor() {}

  ngOnInit() {}

  typeof(error) {
    return typeof error;
  }

  onClickMore(e: Event, errorIndex?: string, globalErrorIndex?: string) {
    e.stopPropagation();
    if (!this.toggleIndex) {
      this.toggleIndex =
        errorIndex && globalErrorIndex
          ? `${errorIndex}${globalErrorIndex}`
          : errorIndex && !globalErrorIndex
          ? errorIndex
          : "";
    } else {
      this.toggleIndex = undefined;
    }
  }

  onCloseError(event: Event, errorIndex: any, globalErrorIndex?: any) {
    event.stopPropagation();
    // With error index and global error index set
    if (
      (errorIndex || errorIndex === 0) &&
      (globalErrorIndex || globalErrorIndex === 0)
    ) {
      let index = 0;
      let filteredErrors = this.errors.filter((error) => {
        let globalIndex = 0;
        let globalErrorsFiltered;
        if (errorIndex === index) {
          globalErrorsFiltered = error.error.globalErrors.filter(
            (globalError) => {
              if (globalIndex !== globalErrorIndex) {
                globalIndex = globalIndex + 1;
                return globalError;
              }
              globalIndex = globalIndex + 1;
              return;
            }
          );
        }
        error.error.globalErrors = globalErrorsFiltered?.filter(
          (error) => error
        );
        index = index + 1;
        return error;
      });
      this.errors = filteredErrors.filter((error) => error);
    }
    // For error index with no global error index
    if (
      (errorIndex || errorIndex === 0) &&
      !globalErrorIndex &&
      globalErrorIndex !== 0
    ) {
      let index = 0;
      let filteredErrors = this.errors.filter((error) => {
        if (errorIndex !== index) {
          return error;
        }
        index = index + 1;
        return;
      });
      this.errors = filteredErrors.filter((error) => error);
    }
  }
}

interface error {
  error: StandardError;
  type?: "danger" | "warning" | "info" | "success";
}
