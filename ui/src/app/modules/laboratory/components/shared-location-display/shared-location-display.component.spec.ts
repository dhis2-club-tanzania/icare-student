import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLocationDisplayComponent } from './shared-location-display.component';

describe('SharedLocationDisplayComponent', () => {
  let component: SharedLocationDisplayComponent;
  let fixture: ComponentFixture<SharedLocationDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLocationDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLocationDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
