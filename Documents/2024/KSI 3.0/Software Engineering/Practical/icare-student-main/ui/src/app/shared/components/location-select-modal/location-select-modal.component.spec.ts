import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationSelectModalComponent } from './location-select-modal.component';
import { provideMockStore } from '@ngrx/store/testing';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('LocationSelectModalComponent', () => {
  let component: LocationSelectModalComponent;
  let fixture: ComponentFixture<LocationSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, SharedModule],
      providers: [
        provideMockStore(storeDataMock),
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ],
      declarations: [LocationSelectModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
