import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedIPDRoundContainerComponent } from './shared-ipd-round-container.component';

describe('SharedIPDRoundContainerComponent', () => {
  let component: SharedIPDRoundContainerComponent;
  let fixture: ComponentFixture<SharedIPDRoundContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedIPDRoundContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedIPDRoundContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
