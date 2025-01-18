import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { from, of } from "rxjs";
import { GoogleAnalyticsService } from "src/app/google-analytics.service";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { Api } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-manage-unit-of-measure-modal",
  templateUrl: "./manage-unit-of-measure-modal.component.html",
  styleUrls: ["./manage-unit-of-measure-modal.component.scss"],
})
export class ManageUnitOfMeasureModalComponent implements OnInit {
  formFields: any[];
  isFormValid: boolean = false;
  formData: any = {};
  saving: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ManageUnitOfMeasureModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private conceptService: ConceptsService,
    private api: Api,
    private _snackBar: MatSnackBar,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.formFields = [
      new Textbox({
        id: "name",
        key: "name",
        label: "Name",
        type: "text",
        required: true,
      }),
      new Textbox({
        id: "description",
        key: "description",
        label: "Description",
        type: "text",
        required: true,
      }),
      new Textbox({
        id: "unitValue",
        key: "unitValue",
        label: "Unit value",
        required: true,
        type: "number",
        min: 0,
      }),
    ];
  }

  onFormUpdate(formValue: FormValue): void {
    this.isFormValid = formValue.isValid;
    this.formData = formValue.getValues();
  }

  onSave(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    const conceptMapType = "35543629-7d8c-11e1-909d-c80aa9edcf4e";
    // 1. Create conceptReferenceTerm
    // 2. Create concept
    const referenceTerm = {
      name: this.formData?.unitValue?.value,
      code: this.formData?.unitValue?.value,
      description: this.formData?.unitValue?.value,
      conceptSource: this.data?.conceptSource?.uuid,
      version: "1.0.0",
    };
    from(
      this.api.conceptreferenceterm.getAllConceptReferenceTerms({
        codeOrName: this.formData?.unitValue?.value,
        source: this.data?.conceptSource?.uuid,
      })
    ).subscribe((response) => {
      if (response) {
        (response?.results?.length > 0
          ? of(response?.results[0])
          : from(
              this.api.conceptreferenceterm.createConceptReferenceTerm(
                referenceTerm
              )
            )
        ).subscribe((referenceTermResponse) => {
          if (referenceTermResponse) {
            let mappings = [
              {
                conceptReferenceTerm: referenceTermResponse?.uuid,
                conceptMapType,
              },
            ];
            let names = [
              {
                name: this.formData["name"]?.value,
                locale: "en",
                localePreferred: true,
                conceptNameType: "FULLY_SPECIFIED",
              },
            ];
            let concept = {
              names: names,
              descriptions: [
                {
                  description: this.formData["description"]?.value,
                  locale: "en",
                },
              ],
              datatype: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              set: false,
              conceptClass: "Units of Measure",
              mappings: mappings,
            };
            this.conceptService.createConcept(concept).subscribe((response) => {
              if (response) {
                // TODO: Add support to handle if concept exists
                this._snackBar.open(
                  `Successfully added unit of measure`,
                  "CLOSE",
                  {
                    horizontalPosition: "center",
                    verticalPosition: "bottom",
                    duration: 3000,
                    panelClass: ["snack-color-success"],
                  }
                );

                setTimeout(() => {
                  this.saving = false;
                  this.dialogRef.close(true);
                }, 2000);
                this.trackActionForAnalytics(`Units of Measure: Save`);
              }
            });
          }
        });
      }
    });
  }

  trackActionForAnalytics(eventname: any) {
    // Send data to Google Analytics
   this.googleAnalyticsService.sendAnalytics('Pharmacy',eventname,'Pharmacy')
  }
}
