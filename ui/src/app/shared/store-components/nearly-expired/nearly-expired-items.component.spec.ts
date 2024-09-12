import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearlyExpiredItemsComponent } from './nearly-expired-items.component';

describe('NearlyExpiredItemsComponent', () => {
  let component: NearlyExpiredItemsComponent;
  let fixture: ComponentFixture<NearlyExpiredItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NearlyExpiredItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NearlyExpiredItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
