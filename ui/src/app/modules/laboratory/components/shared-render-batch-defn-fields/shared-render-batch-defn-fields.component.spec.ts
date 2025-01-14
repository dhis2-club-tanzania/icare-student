import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRenderBatchDefnFieldsComponent } from './shared-render-batch-defn-fields.component';

describe('SharedRenderBatchDefnFieldsComponent', () => {
  let component: SharedRenderBatchDefnFieldsComponent;
  let fixture: ComponentFixture<SharedRenderBatchDefnFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedRenderBatchDefnFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRenderBatchDefnFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
