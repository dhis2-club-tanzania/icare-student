import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-test-time',
  templateUrl: './test-time.component.html',
  styleUrls: ['./test-time.component.scss'],
})
export class TestTimeComponent implements OnInit {
  @Input() test: any;
  @Input() existingConfigs: any;
  @Input() newConfigIndex: number;
  @Output('onNewConfigurationsAdded')
  onNewConfigurationsAdded: EventEmitter<any> = new EventEmitter();

  configsJson: any = {
    concept: null,
    version: null,
    standardTAT: { value: null, unit: null },
    urgentTAT: { value: null, unit: null },
    additionalReqTimeLimit: { value: null, unit: null },
  };

  existingConfigsJson: any;
  savingConfigs: boolean = false;
  errorSavingConfigs: boolean = false;
  units: Array<string> = ['seconds', 'minutes', 'hours', 'days'];
  multiplyingFactor: any = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
  };
  existingConfigsDisabledEditing: boolean;

  constructor(
    private testServices: TestService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.configsJson.concept = this.test?.uuid;
    this.configsJson.version =
      this.newConfigIndex && this.newConfigIndex > 0
        ? `v_${this.newConfigIndex + 1}`
        : `v_1`;

    this.existingConfigsJson = this.existingConfigs
      ? this.processToJson(this.existingConfigs[0])
      : null;

    this.existingConfigsDisabledEditing =
      this.existingConfigs && this.existingConfigs?.length > 0 ? true : false;
  }

  enableEditing() {
    this.existingConfigsDisabledEditing = !this.existingConfigsDisabledEditing;
  }

  processToJson(rawConfigs) {
    const json = {
      concept: rawConfigs?.concept?.uuid,
      version: rawConfigs?.version,
      uuid: rawConfigs?.uuid,
      standardTAT: {
        value: this.getValue(rawConfigs?.standardTAT),
        unit: this.getUnit(rawConfigs?.standardTAT),
      },
      urgentTAT: {
        value: this.getValue(rawConfigs?.urgentTAT),
        unit: this.getUnit(rawConfigs?.urgentTAT),
      },
      additionalReqTimeLimit: {
        value: this.getValue(rawConfigs?.additionalReqTimeLimit),
        unit: this.getUnit(rawConfigs?.additionalReqTimeLimit),
      },
    };

    return json;
  }

  getValue(value) {
    return value < 60
      ? value
      : value < 3600
      ? value / 60
      : value < 86400
      ? value / 3600
      : value / 86400;
  }

  getUnit(value) {
    return value < 60
      ? 'seconds'
      : value < 3600
      ? 'minutes'
      : value < 86400
      ? 'hours'
      : 'days';
  }

  canSave() {

    if((this.configsJson?.standardTAT?.value && !this.configsJson?.standardTAT?.unit) || (!this.configsJson?.standardTAT?.value && this.configsJson.standardTAT?.unit)){
      return false
    }

    if((this.configsJson?.urgentTAT?.value && !this.configsJson?.urgentTAT?.unit) || (!this.configsJson?.urgentTAT?.value && this.configsJson.urgentTAT?.unit)){
      return false
    }

    if((this.configsJson?.additionalReqTimeLimit?.value && !this.configsJson?.additionalReqTimeLimit?.unit) || (!this.configsJson?.additionalReqTimeLimit?.value && this.configsJson.additionalReqTimeLimit?.unit)){
      return false
    }
    return (
      this.configsJson?.concept &&
      this.configsJson?.version &&
      ((this.configsJson?.standardTAT?.value &&
        this.configsJson?.standardTAT?.unit) ||
        (this.configsJson?.urgentTAT?.value &&
          this.configsJson?.urgentTAT?.unit) ||
        (this.configsJson?.additionalReqTimeLimit?.value &&
          this.configsJson?.additionalReqTimeLimit?.unit))
    );
  }

  processPayloadFromConfigs(configs) {
    let urgentTAT =
      configs?.urgentTAT?.value *
      this.multiplyingFactor[configs?.urgentTAT?.unit];
    let standardTAT =
      configs?.standardTAT?.value *
      this.multiplyingFactor[configs?.standardTAT?.unit];
    let addReqTimeLim =
      configs?.additionalReqTimeLimit?.value *
      this.multiplyingFactor[configs?.additionalReqTimeLimit?.unit];

    return {
      ...configs,
      standardTAT: standardTAT,
      urgentTAT: urgentTAT,
      additionalReqTimeLimit: addReqTimeLim,
    };
  }

  saveConfigurations() {
    this.savingConfigs = true;

    const payloadToSend = this.processPayloadFromConfigs(this.configsJson);
    this.testServices.saveTestTimeSettings(payloadToSend).subscribe(
      (response) => {
        this.existingConfigs = response;

        this.existingConfigsJson = this.processToJson(this.existingConfigs);

        this._snackBar.open('Time Settings Saved', 'OK', {
          duration: 3000,
        });

        this.savingConfigs = false;

        this.onNewConfigurationsAdded.emit();
      },
      (error) => {
        this.savingConfigs = false;

        this._snackBar.open('Error saving Time Settings', 'OK', {
          duration: 3000,
        });
      }
    );
  }

  updateConfigurations() {
    this.savingConfigs = true;

    const payload = this.processPayloadFromConfigs(this.existingConfigsJson);

    this.testServices.updateTestTimeSettings(payload).subscribe(
      (response) => {
        this.existingConfigs = response;

        this.existingConfigsJson = this.processToJson(this.existingConfigs);

        this._snackBar.open('Time settings updated', 'OK', {
          duration: 3000,
        });

        this.savingConfigs = false;
        this.enableEditing();
      },
      (error) => {
        this.savingConfigs = false;
        this._snackBar.open('Error updating Time Settings', 'OK', {
          duration: 3000,
        });
      }
    );
  }

  setUnit(e: Event, unit: string, key: string) {
    e.stopPropagation();
  }
}
