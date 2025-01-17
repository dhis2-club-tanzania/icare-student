import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRelatedResultsComponent } from './shared-related-results.component';

describe('SharedRelatedResultsComponent', () => {
  let component: SharedRelatedResultsComponent;
  let fixture: ComponentFixture<SharedRelatedResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedRelatedResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRelatedResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
