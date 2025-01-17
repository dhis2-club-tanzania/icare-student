import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCollectedAmountComponent } from './shared-collected-amount.component';

describe('SharedCollectedAmountComponent', () => {
  let component: SharedCollectedAmountComponent;
  let fixture: ComponentFixture<SharedCollectedAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedCollectedAmountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedCollectedAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
