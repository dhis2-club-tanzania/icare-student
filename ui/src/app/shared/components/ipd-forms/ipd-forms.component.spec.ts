/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormService } from 'src/app/shared/modules/form/services';
import { IpdFormsComponent } from './ipd-forms.component';

describe("IpdFormsComponent", () => {
  let component: IpdFormsComponent;
  let fixture: ComponentFixture<IpdFormsComponent>;

  class FormServiceMock {
    getForm(): Promise<any> {
      return of(null).toPromise();
    }
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [IpdFormsComponent],
        providers: [{ provide: FormService, useClass: FormServiceMock }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IpdFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
