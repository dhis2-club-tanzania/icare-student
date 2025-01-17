import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LbOptionSelectorComponent } from './lb-option-selector.component';

describe('LbOptionSelectorComponent', () => {
  let component: LbOptionSelectorComponent;
  let fixture: ComponentFixture<LbOptionSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LbOptionSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LbOptionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
