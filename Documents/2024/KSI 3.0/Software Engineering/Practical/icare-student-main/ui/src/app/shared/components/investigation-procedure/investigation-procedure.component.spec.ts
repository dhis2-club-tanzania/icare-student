import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationProcedureComponent } from './investigation-procedure.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('InvestigationProcedureComponent', () => {
  let component: InvestigationProcedureComponent;
  let fixture: ComponentFixture<InvestigationProcedureComponent>;

  let store: MockStore<AppState>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestigationProcedureComponent],
      providers: [provideMockStore(storeDataMock)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationProcedureComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
