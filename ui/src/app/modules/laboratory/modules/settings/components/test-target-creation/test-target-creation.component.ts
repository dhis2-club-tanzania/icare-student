import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { TestTimeConfigService } from "src/app/modules/laboratory/resources/services/test-time-config.service";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { Textbox } from "src/app/shared/modules/form/models/text-box.model";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ConceptGetFull } from "src/app/shared/resources/openmrs";
import * as _ from "lodash";
import { UntypedFormControl } from "@angular/forms";

@Component({
  selector: "app-test-target-creation",
  templateUrl: "./test-target-creation.component.html",
  styleUrls: ["./test-target-creation.component.scss"],
})
export class TestTargetCreationComponent implements OnInit, OnDestroy {
  urgentTATConfigFields: any[];
  routineTATConfigFields: any[];
  referralTATConfigFields: any[];
  labTestField: any;
  formData: any = {};
  isFormValid: boolean = false;
  labTestUuid: string;
  labTestSelected: boolean = false;
  selectedLabTestDetails$: Observable<ConceptGetFull[]>;
  conceptBeingEdited: ConceptGetFull;
  alertType: string = "";
  savingMessage: string;
  saving: boolean = false;
  conceptUuid: string;
  urgentTATinMilliseconds: number;
  routineTATinMilliseconds: number;
  referralTATinMilliseconds: number;
  urgentConfigType: string;
  routineConfigType: string;
  referralConfigType: string;
  testTargetToedit: any;
  isEditMode: boolean = false;
  testTimeConfigToEditUuid: string;

  selectedOption: { [key: string]: string } = {};
  selectedFormOptions: any = {};
  radioOptions = [
    { label: " Hrs & Mins ", value: "HRS_MIN" },
    { label: " Days & Hrs ", value: "DAY_HRS" },
    { label: " Mnths & Days ", value: "MTH_DAY" },
  ];

  turnaroundOptions = [
    { label: "Urgent turnarounds", value: "UTAT", mapping: "urgentConfigType" },
    {
      label: "Routine turnarounds",
      value: "RTAT",
      mapping: "routineConfigType",
    },
    {
      label: "Referral turnarounds",
      value: "REFTAT",
      mapping: "referralConfigType",
    },
  ];

  dynamicControls: UntypedFormControl[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private conceptService: ConceptsService,
    private testTimeConfigService: TestTimeConfigService
  ) {
    this.turnaroundOptions.forEach((value) => {
      this.dynamicControls.push(new UntypedFormControl(value));
    });
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      if (subscription) {
        subscription.unsubscribe();
      }
    }
  }

  ngOnInit(): void {
    this.createUrgentTATConfigFields();
    this.createRoutineTATConfigFields();
    this.createReferralTATConfigFields();
    this.createLabTestField();

    const testTimeConfigurationSubscription: Subscription =
      this.testTimeConfigService.testTimeToEdit.subscribe((data) => {
        this.testTargetToedit = data;
        this.isEditMode = true;
        this.createLabTestField(null, data);
        this.prepareTATEditFormValues(data);
        this.onEditTimeToPopulateForm(data);
        this.testTimeConfigToEditUuid = data?.uuid;
      });

    this.subscriptions.push(testTimeConfigurationSubscription);
  }

  prepareTATEditFormValues(data: any) {
    this.dynamicControls.forEach((control, index) => {
      // Simulated API response, replace this with your actual data from API
      const currentValue = this.dynamicControls[index].value.mapping || "";
      this.dynamicControls[index].setValue(
        data && data[currentValue] ? data[currentValue] : ""
      );
    });
  }

  createLabTestField(data?: any, editedData?: any): void {
    this.labTestField = new Dropdown({
      id: "labtest",
      key: "labtest",
      label: "Lab Test",
      searchTerm: "TEST_ORDERS",
      required: true,
      options: [],
      value: editedData ? editedData?.concept?.uuid : data?.uuid,
      conceptClass: "Test",
      searchControlType: "concept",
      shouldHaveLiveSearchForDropDownFields: true,
    });
  }

  onRadioButtonChange(optionValue: string, selectedValue: string) {
    this.selectedOption[optionValue] = selectedValue;
    if (optionValue === "UTAT") {
      this.selectedFormOptions = { optionValue, selectedValue };
      this.isEditMode
        ? this.createUrgentTATConfigFields(null, [null, null, selectedValue])
        : this.createUrgentTATConfigFields(selectedValue, null);
    }
    if (optionValue === "RTAT") {
      this.selectedFormOptions = { optionValue, selectedValue };
      this.isEditMode
        ? this.createRoutineTATConfigFields(null, [null, null, selectedValue])
        : this.createRoutineTATConfigFields(selectedValue, null);
    }
    if (optionValue === "REFTAT") {
      this.selectedFormOptions = { optionValue, selectedValue };
      this.isEditMode
        ? this.createReferralTATConfigFields(null, [null, null, selectedValue])
        : this.createReferralTATConfigFields(selectedValue, null);
    }
  }

  createUrgentTATConfigFields(data?: any, editedData?: any) {
    this.urgentConfigType = data;
    this.urgentTATConfigFields = [
      new Textbox({
        id: "UTAT",
        key: "UTAT",
        label: this.isEditMode
          ? editedData[2] === "HRS_MIN"
            ? "HOURS"
            : editedData[2] === "DAY_HRS"
            ? "DAYS"
            : editedData[2] === "MTH_DAY"
            ? "MONTHS"
            : ""
          : data === "HRS_MIN"
          ? "HOURS"
          : data === "DAY_HRS"
          ? "DAYS"
          : data === "MTH_DAY"
          ? "MONTHS"
          : "",
        value: this.isEditMode ? editedData[0] : "",
        required: true,
      }),
      new Textbox({
        id: "UTAT2",
        key: "UTAT2",
        label: this.isEditMode
          ? editedData[2] === "HRS_MIN"
            ? "MINUTES"
            : editedData[2] === "DAY_HRS"
            ? "HOURS"
            : editedData[2] === "MTH_DAY"
            ? "DAYS"
            : ""
          : data === "HRS_MIN"
          ? "MINUTES"
          : data === "DAY_HRS"
          ? "HOURS"
          : data === "MTH_DAY"
          ? "DAYS"
          : "",
        value: this.isEditMode ? editedData[1] : "",
        required: true,
      }),
    ];
  }

  createRoutineTATConfigFields(data?: any, editedData?: any) {
    this.routineConfigType = data;
    this.routineTATConfigFields = [
      new Textbox({
        id: "RTAT",
        key: "RTAT",
        label: this.isEditMode
          ? editedData[2] === "HRS_MIN"
            ? "HOURS"
            : editedData[2] === "DAY_HRS"
            ? "DAYS"
            : editedData[2] === "MTH_DAY"
            ? "MONTHS"
            : ""
          : data === "HRS_MIN"
          ? "HOURS"
          : data === "DAY_HRS"
          ? "DAYS"
          : data === "MTH_DAY"
          ? "MONTHS"
          : "",
        value: this.isEditMode ? editedData[0] : "",
        required: true,
      }),
      new Textbox({
        id: "RTAT2",
        key: "RTAT2",
        label: this.isEditMode
          ? editedData[2] === "HRS_MIN"
            ? "MINUTES"
            : editedData[2] === "DAY_HRS"
            ? "HOURS"
            : editedData[2] === "MTH_DAY"
            ? "DAYS"
            : ""
          : data === "HRS_MIN"
          ? "MINUTES"
          : data === "DAY_HRS"
          ? "HOURS"
          : data === "MTH_DAY"
          ? "DAYS"
          : "",
        value: this.isEditMode ? editedData[1] : "",
        required: true,
      }),
    ];
  }

  createReferralTATConfigFields(data?: any, editedData?: any) {
    // console.log("ttt: ",editedData);
    this.referralConfigType = data;
    this.referralTATConfigFields = [
      new Textbox({
        id: "REFTAT",
        key: "REFTAT",
        label: this.isEditMode
          ? editedData[2] === "HRS_MIN"
            ? "HOURS"
            : editedData[2] === "DAY_HRS"
            ? "DAYS"
            : editedData[2] === "MTH_DAY"
            ? "MONTHS"
            : ""
          : data === "HRS_MIN"
          ? "HOURS"
          : data === "DAY_HRS"
          ? "DAYS"
          : data === "MTH_DAY"
          ? "MONTHS"
          : "",
        value: editedData ? editedData[0] : "",
        required: true,
      }),
      new Textbox({
        id: "REFTAT2",
        key: "REFTAT2",
        label: this.isEditMode
          ? editedData[2] === "HRS_MIN"
            ? "MINUTES"
            : editedData[2] === "DAY_HRS"
            ? "HOURS"
            : editedData[2] === "MTH_DAY"
            ? "DAYS"
            : ""
          : data === "HRS_MIN"
          ? "MINUTES"
          : data === "DAY_HRS"
          ? "HOURS"
          : data === "MTH_DAY"
          ? "DAYS"
          : "",
        value: this.isEditMode ? editedData[1] : "",
        required: true,
      }),
    ];
  }

  onEditTimeToPopulateForm(editedData) {
    const standardTATseconds = Math.floor(editedData?.standardTAT / 1000);
    const standardTATminutes = Math.floor(standardTATseconds / 60);
    const standardTAThours = Math.floor(standardTATminutes / 60);
    const standardTATdays = Math.floor(standardTAThours / 24);
    const standardTATmonths = Math.floor(standardTATdays / 30);

    const urgentTATseconds = Math.floor(editedData?.urgentTAT / 1000);
    const urgentTATminutes = Math.floor(urgentTATseconds / 60);
    const urgentTAThours = Math.floor(urgentTATminutes / 60);
    const urgentTATdays = Math.floor(urgentTAThours / 24);
    const urgentTATmonths = Math.floor(urgentTATdays / 30);

    const referralTATseconds = Math.floor(editedData?.referralTAT / 1000);
    const referralTATminutes = Math.floor(referralTATseconds / 60);
    const referralTAThours = Math.floor(referralTATminutes / 60);
    const referralTATdays = Math.floor(referralTAThours / 24);
    const referralTATmonths = Math.floor(referralTATdays / 30);

    switch (editedData?.routineConfigType) {
      case "HRS_MIN":
        this.createRoutineTATConfigFields(null, [
          standardTAThours,
          standardTATminutes % 60,
          editedData?.routineConfigType,
        ]);
        this.routineConfigType = "HRS_MIN";
        break;
      case "DAY_HRS":
        this.createRoutineTATConfigFields(null, [
          standardTATdays,
          standardTAThours % 24,
          editedData?.routineConfigType,
        ]);
        this.routineConfigType = "DAY_HRS";
        break;
      case "MTH_DAY":
        this.createRoutineTATConfigFields(null, [
          standardTATmonths,
          standardTATdays % 30,
          editedData?.routineConfigType,
        ]);
        this.routineConfigType = "MTH_DAY";
        break;
      default:
        return "";
    }

    switch (editedData?.urgentConfigType) {
      case "HRS_MIN":
        this.createUrgentTATConfigFields(null, [
          urgentTAThours,
          urgentTATminutes % 60,
          editedData?.urgentConfigType,
        ]);
        this.urgentConfigType = "HRS_MIN";
        break;
      case "DAY_HRS":
        this.createUrgentTATConfigFields(null, [
          urgentTATdays,
          urgentTAThours % 24,
          editedData?.urgentConfigType,
        ]);
        this.urgentConfigType = "DAY_HRS";
        break;
      case "MTH_DAY":
        this.createUrgentTATConfigFields(null, [
          urgentTATmonths,
          urgentTATdays % 30,
          editedData?.urgentConfigType,
        ]);
        this.urgentConfigType = "MTH_DAY";
        break;
      default:
        return "";
    }

    switch (editedData?.referralConfigType) {
      case "HRS_MIN":
        this.createReferralTATConfigFields(null, [
          referralTAThours,
          referralTATminutes % 60,
          editedData?.referralConfigType,
        ]);
        this.referralConfigType = "HRS_MIN";
        break;
      case "DAY_HRS":
        this.createReferralTATConfigFields(null, [
          referralTATdays,
          referralTAThours % 24,
          editedData?.referralConfigType,
        ]);
        this.referralConfigType = "DAY_HRS";
        break;
      case "MTH_DAY":
        this.createReferralTATConfigFields(null, [
          referralTATmonths,
          referralTATdays % 30,
          editedData?.referralConfigType,
        ]);
        this.referralConfigType = "MTH_DAY";
        break;
      default:
        return "";
    }
  }

  onChangeToMilliseconds(formData: any) {
    if (formData["UTAT"]?.value >= 0 && formData["UTAT2"]?.value >= 0) {
      if (formData["UTAT"].id === "UTAT") {
        if (formData["UTAT"].label === "HOURS") {
          this.urgentTATinMilliseconds =
            +this.formData["UTAT"]?.value * 3600000;
          this.urgentConfigType = "HRS_MIN";
        }

        if (formData["UTAT"].label === "DAYS") {
          this.urgentTATinMilliseconds =
            +this.formData["UTAT"]?.value * 86400000;
          this.urgentConfigType = "DAY_HRS";
        }

        if (formData["UTAT"].label === "MONTHS") {
          const millisecondsPerMonth = 30 * 24 * 60 * 60 * 1000;
          this.urgentTATinMilliseconds =
            +this.formData["UTAT"]?.value * millisecondsPerMonth;
          this.urgentConfigType = "MTH_DAY";
        }
      }

      if (formData["UTAT2"].id === "UTAT2") {
        if (formData["UTAT2"].label === "MINUTES") {
          this.urgentTATinMilliseconds +=
            +this.formData["UTAT2"]?.value * 60000;
        }

        if (formData["UTAT2"].label === "HOURS") {
          this.urgentTATinMilliseconds +=
            +this.formData["UTAT2"]?.value * 3600000;
        }

        if (formData["UTAT2"].label === "DAYS") {
          this.urgentTATinMilliseconds +=
            +this.formData["UTAT2"]?.value * 86400000;
        }
      }
    }

    if (formData["RTAT"]?.value >= 0 && formData["RTAT2"]?.value >= 0) {
      if (formData["RTAT"].id === "RTAT") {
        if (formData["RTAT"].label === "HOURS") {
          this.routineTATinMilliseconds =
            +this.formData["RTAT"]?.value * 3600000;
          this.routineConfigType = "HRS_MIN";
        }

        if (formData["RTAT"].label === "DAYS") {
          this.routineTATinMilliseconds =
            +this.formData["RTAT"]?.value * 86400000;
          this.routineConfigType = "DAY_HRS";
        }

        if (formData["RTAT"].label === "MONTHS") {
          const millisecondsPerMonth = 30 * 24 * 60 * 60 * 1000;
          this.routineTATinMilliseconds =
            +this.formData["RTAT"]?.value * millisecondsPerMonth;
          this.routineConfigType = "MTH_DAY";
        }
      }

      if (formData["RTAT2"].id === "RTAT2") {
        if (formData["RTAT2"].label === "MINUTES") {
          this.routineTATinMilliseconds +=
            +this.formData["RTAT2"]?.value * 60000;
        }

        if (formData["RTAT2"].label === "HOURS") {
          this.routineTATinMilliseconds +=
            +this.formData["RTAT2"]?.value * 3600000;
        }

        if (formData["RTAT2"].label === "DAYS") {
          this.routineTATinMilliseconds +=
            +this.formData["RTAT2"]?.value * 86400000;
        }
      }
    }

    if (formData["REFTAT"]?.value >= 0 && formData["REFTAT2"]?.value >= 0) {
      if (formData["REFTAT"].id === "REFTAT") {
        if (formData["REFTAT"].label === "HOURS") {
          this.referralTATinMilliseconds =
            +this.formData["REFTAT"]?.value * 3600000;
          this.referralConfigType = "HRS_MIN";
        }

        if (formData["REFTAT"].label === "DAYS") {
          this.referralTATinMilliseconds =
            +this.formData["REFTAT"]?.value * 86400000;
          this.referralConfigType = "DAY_HRS";
        }

        if (formData["REFTAT"].label === "MONTHS") {
          const millisecondsPerMonth = 30 * 24 * 60 * 60 * 1000;
          this.referralTATinMilliseconds =
            +this.formData["REFTAT"]?.value * millisecondsPerMonth;
          this.referralConfigType = "MTH_DAY";
        }
      }

      if (formData["REFTAT2"].id === "REFTAT2") {
        if (formData["REFTAT2"].label === "MINUTES") {
          this.referralTATinMilliseconds +=
            +this.formData["REFTAT2"]?.value * 60000;
        }

        if (formData["REFTAT2"].label === "HOURS") {
          this.referralTATinMilliseconds +=
            +this.formData["REFTAT2"]?.value * 3600000;
        }

        if (formData["REFTAT2"].label === "DAYS") {
          this.referralTATinMilliseconds +=
            +this.formData["REFTAT2"]?.value * 86400000;
        }
      }
    }
  }

  onFormUpdate(formValues: FormValue): void {
    this.formData = { ...this.formData, ...formValues.getValues() };
    this.isFormValid = formValues.isValid;
  }

  onFormUpdateLabTest(formValues: FormValue): void {
    this.formData = { ...this.formData, ...formValues.getValues() };
    const labTestUuid = this.formData["labtest"]?.value;
    this.labTestUuid = labTestUuid;
    if (labTestUuid) {
      this.labTestSelected = true;
      this.formData["labtest"]?.value;
      this.selectedLabTestDetails$ =
        this.conceptService.getConceptDetailsByUuid(labTestUuid, "full");

      this.selectedLabTestDetails$.subscribe((response: any) => {
        if (response && !this.conceptBeingEdited) {
        }
      });
    }
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.createUrgentTATConfigFields();
    this.createRoutineTATConfigFields();
    this.createReferralTATConfigFields();
  }

  onSave(event: Event, selectedLabTestDetails?: any): void {
    event.stopPropagation();
    this.onChangeToMilliseconds(this.formData);
    this.saving = true;
    if (!this.isEditMode) {
      let testConfigData = {
        concept: selectedLabTestDetails?.uuid,
        urgentTAT: this.urgentTATinMilliseconds,
        standardTAT: this.routineTATinMilliseconds,
        referralTAT: this.referralTATinMilliseconds,
        urgentConfigType: this.urgentConfigType,
        routineConfigType: this.routineConfigType,
        referralConfigType: this.referralConfigType,
      };

      this.testTimeConfigService
        .createTestTimeConfig(testConfigData)
        .subscribe((response) => {
          if (response) {
            this.saving = false;
            this.conceptUuid = null;
            this.savingMessage = "Successfully saved ";
            this.alertType = "success";
          }
        });
    }

    if (this.isEditMode) {
      let editedTestConfigData = {
        concept: this.formData?.labtest?.value,
        urgentTAT: this.urgentTATinMilliseconds,
        standardTAT: this.routineTATinMilliseconds,
        referralTAT: this.referralTATinMilliseconds,
        urgentConfigType: this.urgentConfigType,
        routineConfigType: this.routineConfigType,
        referralConfigType: this.referralConfigType,
        uuid: this.testTimeConfigToEditUuid,
      };

      this.testTimeConfigService
        .editTestTimeConfig(editedTestConfigData)
        .subscribe((response) => {
          if (response) {
            this.saving = false;
            this.savingMessage = "Successfully updated";
            this.alertType = "success";
          }
        });
    }

    //this.testTimeConfigService.savedOrEditedData.emit(event);
    this.createUrgentTATConfigFields();
    this.createRoutineTATConfigFields();
    this.createReferralTATConfigFields();
    this.createLabTestField();
  }
}
