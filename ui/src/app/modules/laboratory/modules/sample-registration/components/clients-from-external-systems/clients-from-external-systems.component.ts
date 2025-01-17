import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { DHIS2BasedSystems } from "src/app/core/constants/external-dhis2-based-systems.constants";
import { OtherClientLevelSystemsService } from "src/app/modules/laboratory/resources/services/other-client-level-systems.service";

@Component({
  selector: "app-clients-from-external-systems",
  templateUrl: "./clients-from-external-systems.component.html",
  styleUrls: ["./clients-from-external-systems.component.scss"],
})
export class ClientsFromExternalSystemsComponent implements OnInit {
  @Input() labTestRequestProgramStageId: string;
  systems: any[] = DHIS2BasedSystems;
  selectedSystem: any;
  selectedSearchCriteria: any;
  searchingText: string;
  clientsList$: Observable<any>;
  isSearching: boolean = false;
  showClientsList: boolean = false;
  @Output() selectedClientRequest: EventEmitter<any> = new EventEmitter<any>();
  @Output() system: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private otherClientLevelSystemsService: OtherClientLevelSystemsService
  ) {}

  ngOnInit(): void {
    this.selectedSystem = this.systems[0];
    this.system.emit(this.selectedSystem);
  }

  getSelectedSystem(system: any): void {
    this.selectedSystem = system;
  }

  getSearchingText(event: KeyboardEvent): void {
    this.searchingText = (event.target as HTMLInputElement)?.value;
  }

  searchClientsFromExternalSystems(event: Event): void {
    event.stopPropagation();
    this.isSearching = true;
    this.clientsList$ =
      this.otherClientLevelSystemsService.getClientsFromOtherSystems({
        identifier: this.searchingText,
        identifierReference: this.selectedSearchCriteria?.referenceKey,
        labTestRequestProgramStageId: this.labTestRequestProgramStageId,
      });
    this.showClientsList = true;
  }

  getSelectedSearchCriteria(criteria: any): void {
    this.selectedSearchCriteria = criteria;
  }

  toggleList(event: Event): void {
    event.stopPropagation();
    this.showClientsList = !this.showClientsList;
    this.isSearching = false;
  }

  onSelectClient(event: Event, client: any): void {
    event.stopPropagation();
    this.isSearching = false;
    this.selectedClientRequest.emit({
      ...client,
      selectedSystem: this.selectedSystem,
    });
    this.showClientsList = false;
  }
}
