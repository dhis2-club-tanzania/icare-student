import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesCollectedComponent } from './samples-collected.component';

describe('SamplesCollectedComponent', () => {
  let component: SamplesCollectedComponent;
  let fixture: ComponentFixture<SamplesCollectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplesCollectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesCollectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
