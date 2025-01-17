import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingDataHomeComponent } from './nursing-data-home.component';

describe('NursingDataHomeComponent', () => {
  let component: NursingDataHomeComponent;
  let fixture: ComponentFixture<NursingDataHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NursingDataHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingDataHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
