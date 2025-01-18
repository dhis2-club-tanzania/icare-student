import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedSamplesComponent } from './completed-samples.component';

describe('CompletedSamplesComponent', () => {
  let component: CompletedSamplesComponent;
  let fixture: ComponentFixture<CompletedSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedSamplesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
