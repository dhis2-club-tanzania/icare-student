import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-test-male-range',
  templateUrl: './test-male-range.component.html',
  styleUrls: ['./test-male-range.component.scss'],
})
export class TestMaleRangeComponent implements OnInit {
  @Input() test: any;
  @Input() existingConfigs: any;
  @Input() newConfigIndex: number;
  @Output('onNewConfigurationsAdded')
  onNewConfigurationsAdded: EventEmitter<any> = new EventEmitter();

  configsJson: any = {
    concept: null,
    gender: 'ME',
    absoluteHigh: null,
    criticalHigh: null,
    normalHigh: null,
    absoluteLow: null,
    criticalLow: null,
    normalLow: null,
  };

  existingMaleRangeConfigs: any;
  savingConfigs: boolean = false;

  existingConfigsDisabledEditing: boolean;

  constructor(
    private testService: TestService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.configsJson.concept = this.test?.uuid;

    this.existingMaleRangeConfigs = _.filter(
      this.existingConfigs,
      (configs) => {
        return configs?.gender == 'ME' ? true : false;
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

    this.testService.saveTestMaleRangeConfigs(this.configsJson).subscribe(
      (response) => {
        this.existingMaleRangeConfigs = [response];

        this._snackBar.open('Male range values saved', 'OK', {
          duration: 3000,
        });

        this.savingConfigs = false;

        this.onNewConfigurationsAdded.emit();
      },
      (error) => {
        this.savingConfigs = false;

        this._snackBar.open('Error saving male range values', 'OK', {
          duration: 3000,
        });
      }
    );
  }

  updateConfigurations() {
    this.savingConfigs = true;

    let payload = {
      ...this.existingMaleRangeConfigs[0],
      concept: this.existingMaleRangeConfigs[0]?.concept?.uuid,
    };

    this.testService.updateTestValuesRange(payload).subscribe(
      (response) => {
        this.existingMaleRangeConfigs = [response];

        this._snackBar.open('Male range values edited', 'OK', {
          duration: 3000,
        });

        this.savingConfigs = false;
        this.enableEditing();
      },
      (error) => {
        this.savingConfigs = false;

        this._snackBar.open('Error saving male range values', 'OK', {
          duration: 3000,
        });
      }
    );
  }
}
