import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDisposeMethodsComponent } from './sample-dispose-methods.component';

describe('SampleDisposeMethodsComponent', () => {
  let component: SampleDisposeMethodsComponent;
  let fixture: ComponentFixture<SampleDisposeMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleDisposeMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDisposeMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
