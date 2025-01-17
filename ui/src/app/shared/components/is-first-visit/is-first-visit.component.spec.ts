import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsFirstVisitComponent } from './is-first-visit.component';

describe('IsFirstVisitComponent', () => {
  let component: IsFirstVisitComponent;
  let fixture: ComponentFixture<IsFirstVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsFirstVisitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsFirstVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
