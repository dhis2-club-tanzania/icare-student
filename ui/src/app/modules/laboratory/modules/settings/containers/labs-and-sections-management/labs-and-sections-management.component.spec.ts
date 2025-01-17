import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabsAndSectionsManagementComponent } from './labs-and-sections-management.component';

describe('LabsAndSectionsManagementComponent', () => {
  let component: LabsAndSectionsManagementComponent;
  let fixture: ComponentFixture<LabsAndSectionsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabsAndSectionsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabsAndSectionsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
