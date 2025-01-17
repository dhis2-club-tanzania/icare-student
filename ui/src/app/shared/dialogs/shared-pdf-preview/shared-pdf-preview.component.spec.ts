import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPdfPreviewComponent } from './shared-pdf-preview.component';

describe('SharedPdfPreviewComponent', () => {
  let component: SharedPdfPreviewComponent;
  let fixture: ComponentFixture<SharedPdfPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedPdfPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPdfPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
