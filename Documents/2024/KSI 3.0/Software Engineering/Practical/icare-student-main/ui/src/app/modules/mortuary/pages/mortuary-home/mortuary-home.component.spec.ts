import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortuaryHomeComponent } from './mortuary-home.component';

describe('MortuaryHomeComponent', () => {
  let component: MortuaryHomeComponent;
  let fixture: ComponentFixture<MortuaryHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortuaryHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortuaryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
