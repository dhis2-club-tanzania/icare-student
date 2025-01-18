import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleCollectionHomeComponent } from './sample-collection-home.component';

describe('SampleCollectionHomeComponent', () => {
  let component: SampleCollectionHomeComponent;
  let fixture: ComponentFixture<SampleCollectionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleCollectionHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleCollectionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
