import { Directive, ElementRef } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";

const allValue = 999999;
const allValueLabel = "All"; // or inject i18n service in directive constructor

@Directive({
  selector: "[appAddAllToPaginator]",
})
export class AddAllToPaginator {
  public constructor(
    private readonly host: MatPaginator,
    private readonly elRef: ElementRef
  ) {
    const proxiedUpdateDisplayedPageSizeOptions =
      // @ts-ignore
      host._updateDisplayedPageSizeOptions.bind(host);
    // @ts-ignore
    host._updateDisplayedPageSizeOptions = () => {
      proxiedUpdateDisplayedPageSizeOptions();
      // @ts-ignore
      const displayedPageSizeOptions = host._displayedPageSizeOptions;

      // @ts-ignore
      if (!displayedPageSizeOptions) {
        return;
      }

      const newDisplayedPageSizeOptions = [
        ...displayedPageSizeOptions.filter((x) => x !== allValue),
        allValueLabel,
      ];

      // @ts-ignore
      host._displayedPageSizeOptions = newDisplayedPageSizeOptions;
      // @ts-ignore
      host._changeDetectorRef.markForCheck();
    };

    const proxiedChangePageSize = host._changePageSize.bind(host);
    host._changePageSize = (v) => {
      // @ts-ignore
      if (v === allValueLabel) {
        v = allValue;
      }

      proxiedChangePageSize(v);

      elRef.nativeElement.querySelector(".mat-select-value").innerText =
        v === allValue ? allValueLabel : v;
    };
  }
}
