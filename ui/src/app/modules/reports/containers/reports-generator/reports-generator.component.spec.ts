import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { ReportParamsService } from "src/app/core/services/report-params.service";
import { ReportService } from "src/app/core/services/report.service";
import { storeDataMock } from "src/test-mocks/store-data.mock";
import { ReportsGeneratorComponent } from "./reports-generator.component";

describe("ReportsGeneratorComponent", () => {
  let component: ReportsGeneratorComponent;
  let fixture: ComponentFixture<ReportsGeneratorComponent>;

  class ReportParamsMock {
    getReportGroups() {
      return of([]);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsGeneratorComponent],
      providers: [
        { provide: ReportParamsService, useClass: ReportParamsMock },
        { provide: ReportService, useValue: null },
        provideMockStore(storeDataMock),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
