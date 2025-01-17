import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartVisitModelComponent } from './start-visit-model.component';

describe('StartVisitModelComponent', () => {
  let component: StartVisitModelComponent;
  let fixture: ComponentFixture<StartVisitModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartVisitModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartVisitModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
