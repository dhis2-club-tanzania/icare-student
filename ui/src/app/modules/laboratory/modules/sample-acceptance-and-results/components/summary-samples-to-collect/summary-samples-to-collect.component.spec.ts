import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySamplesToCollectComponent } from './summary-samples-to-collect.component';

describe('SummarySamplesToCollectComponent', () => {
  let component: SummarySamplesToCollectComponent;
  let fixture: ComponentFixture<SummarySamplesToCollectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySamplesToCollectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySamplesToCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
