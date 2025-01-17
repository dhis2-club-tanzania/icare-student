import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-test-female-range',
  templateUrl: './test-female-range.component.html',
  styleUrls: ['./test-female-range.component.scss'],
})
export class TestFemaleRangeComponent implements OnInit {
  @Input() test: any;
  @Input() existingConfigs: any;
  @Input() newConfigIndex: number;
  @Output('onNewConfigurationsAdded')
  onNewConfigurationsAdded: EventEmitter<any> = new EventEmitter();

  configsJson: any = {
    concept: null,
    gender: 'FE',
    absoluteHigh: null,
    criticalHigh: null,
    normalHigh: null,
    absoluteLow: null,
    criticalLow: null,
    normalLow: null,
  };

  existingConfigsDisabledEditing: boolean;
  existingFemaleRangeConfigs: any;
  savingConfigs: boolean = false;

  constructor(
    private testService: TestService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.configsJson.concept = this.test?.uuid;

    //console.log("existing configs :: ",this.existingConfigs

    this.existingFemaleRangeConfigs = _.filter(
      this.existingConfigs,
      (configs) => {
        return configs?.gender == 'FE' ? true : false;
      }
    );

    this.existingConfigsDisabledEditing =
      this.existingConfigs && this.existingConfigs?.length > 0 ? true : false;
  }

  enableEditing() {
    this.existingConfigsDisabledEditing = !this.existingConfigsDisabledEditing;
  }

  
  canSave() {
    if (!(this.configsJson?.concept && this.configsJson?.gender)) {

      return false;
    }

    if (
      !this.configsJson?.absoluteHigh &&
      !this.configsJson?.absoluteLow &&
      !this.configsJson?.absoluteHigh &&
      !this.configsJson?.absoluteLow &&
      !this.configsJson?.normalHigh &&
      !this.configsJson?.normalLow
    ) {
      return false;
    }

    if (
      !(this.configsJson?.absoluteHigh && this.configsJson?.absoluteLow) &&
      (this.configsJson?.absoluteHigh || this.configsJson?.absoluteLow)
    ) {

      return false;
    }

    if (
      !(this.configsJson?.criticalHigh && this.configsJson?.criticalLow) &&
      (this.configsJson?.criticalHigh || this.configsJson?.criticalLow)
    ) {
      return false;
    }

    if (
      !(this.configsJson?.normalHigh && this.configsJson?.normalLow) &&
      (this.configsJson?.normalHigh || this.configsJson?.normalLow)
    ) {
      return false;
    }

    return true;

  }

  saveConfigurations() {
    this.savingConfigs = true;

    this.configsJson.version =
      this.newConfigIndex && this.newConfigIndex > 0
        ? `v_${this.newConfigIndex + 1}`
        : `v_1`;

    this.testService.saveTestFemaleRangeConfigs(this.configsJson).subscribe(
      (response) => {
        this.existingFemaleRangeConfigs = [response];

        this._snackBar.open('female range values saved', 'OK', {
          duration: 3000,
        });

        this.savingConfigs = false;

        this.onNewConfigurationsAdded.emit();
      },
      (error) => {
        this.savingConfigs = false;

        this._snackBar.open('Error saving female range values', 'OK', {
          duration: 3000,
        });
      }
    );
  }

  updateConfigurations() {
    this.savingConfigs = true;

    let payload = {
      ...this.existingFemaleRangeConfigs[0],
      concept: this.existingFemaleRangeConfigs[0]?.concept?.uuid,
    };

    this.testService.updateTestValuesRange(payload).subscribe(
      (response) => {
        this.existingFemaleRangeConfigs = [response];

        this._snackBar.open('Female range values edited', 'OK', {
          duration: 3000,
        });

        this.savingConfigs = false;
        this.enableEditing();
      },
      (error) => {
        this.savingConfigs = false;

        this._snackBar.open('Error saving female range values', 'OK', {
          duration: 3000,
        });
      }
    );
  }
}
