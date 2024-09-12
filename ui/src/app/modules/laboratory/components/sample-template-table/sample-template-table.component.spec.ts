import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTemplateTableComponent } from './sample-template-table.component';

describe('SampleTemplateTableComponent', () => {
  let component: SampleTemplateTableComponent;
  let fixture: ComponentFixture<SampleTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleTemplateTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
