import { Component, Input, OnInit } from '@angular/core';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-time-settings-list',
  templateUrl: './time-settings-list.component.html',
  styleUrls: ['./time-settings-list.component.scss'],
})
export class TimeSettingsListComponent implements OnInit {
  @Input() test: any;
  @Input() existingConfigs: any;
  addingConfigsMode: boolean = false;
  reloadingConfigurations: boolean = false;

  constructor(private testService: TestService) {}

  ngOnInit(): void {}

  addConfigurations() {
    this.addingConfigsMode = !this.addingConfigsMode;
  }

  onNewConfigurationsAdded() {
    //reload time settings
    this.existingConfigs = []
    this.reloadingConfigurations = true;

    this.testService
      .getTestTimeSettingByTestConcept(this.test?.uuid)
      .subscribe((response) => {
        this.existingConfigs = response;
        this.reloadingConfigurations = false;
        this.addingConfigsMode =false;
      }, error => {

      });
  }
}
