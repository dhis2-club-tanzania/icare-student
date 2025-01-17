import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSamplesListComponent } from './shared-samples-list.component';

describe('SharedSamplesListComponent', () => {
  let component: SharedSamplesListComponent;
  let fixture: ComponentFixture<SharedSamplesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSamplesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSamplesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
