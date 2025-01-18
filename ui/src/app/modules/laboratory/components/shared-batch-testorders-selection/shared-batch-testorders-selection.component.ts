import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";

@Component({
  selector: "app-shared-batch-testorders-selection",
  templateUrl: "./shared-batch-testorders-selection.component.html",
  styleUrls: ["./shared-batch-testorders-selection.component.scss"],
})
export class SharedBatchTestordersSelectionComponent implements OnInit {
  testOrders$: Observable<any>;
  @Input() selectedOrders: any[];
  @Input() testOrderParentConceptUuid: string;
  @Output() selectedItems: EventEmitter<any[]> = new EventEmitter<any[]>();
  constructor(
    private httpClient: OpenmrsHttpClientService,
    private conceptsService: ConceptsService
  ) {}

  ngOnInit(): void {
    this.testOrders$ = !this.testOrderParentConceptUuid
      ? this.httpClient
          .get(
            `icare/concept?paging=false&conceptClass=Test&searchTerm=TEST_ORDERS`
          )
          .pipe(
            map((response: any) => {
              if (response) {
                return (response?.results || [])?.map((result: any) => {
                  return {
                    ...result,
                    id: result?.uuid,
                    key: result?.uuid,
                    label: result?.systemName?.replace("TEST_ORDERS:", ""),
                    name: result?.systemName?.replace("TEST_ORDERS:", ""),
                    value: result?.uuid,
                  };
                });
              }
            })
          )
      : this.conceptsService
          .getConceptDetailsByUuid(
            this.testOrderParentConceptUuid,
            "custom:(uuid,display,setMembers:(uuid,display))"
          )
          .pipe(
            map((response: any) => {
              return response?.setMembers?.map((setMember: any) => {
                return {
                  ...setMember,
                  id: setMember?.uuid,
                  key: setMember?.uuid,
                  label: setMember?.display?.replace("TEST_ORDERS:", ""),
                  name: setMember?.display?.replace("TEST_ORDERS:", ""),
                  value: setMember?.uuid,
                };
              });
            })
          );
  }

  onGetSelectedOrders(orders: any[]): void {
    this.selectedItems.emit(orders);
  }
}
