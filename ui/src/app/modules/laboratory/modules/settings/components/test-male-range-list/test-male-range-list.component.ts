import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { TestService } from 'src/app/shared/services/test.service';

@Component({
  selector: 'app-test-male-range-list',
  templateUrl: './test-male-range-list.component.html',
  styleUrls: ['./test-male-range-list.component.scss'],
})
export class TestMaleRangeListComponent implements OnInit {
  @Input() test: any;
  @Input() existingConfigs: any;
  addingConfigsMode: boolean = false;
  reloadingConfigurations: boolean = false;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.existingConfigs =
      this.existingConfigs && this.existingConfigs?.length > 0
        ? _.filter(this.existingConfigs, (configuration) => {
            return configuration?.gender == 'ME' ? true : false;
          })
        : null;
  }

  addConfigurations() {
    this.addingConfigsMode = !this.addingConfigsMode;
  }

  onNewConfigurationsAdded() {
    //reload time settings
    this.existingConfigs = [];
    this.reloadingConfigurations = true;

    this.testService.getTestValueRangesByTestConcept(this.test?.uuid).subscribe(
      (response) => {
        //filter response and deal with male configs only
        this.existingConfigs = _.filter(response, (configuration) => {
          return configuration?.gender == 'ME' ? true : false;
        });
        this.reloadingConfigurations = false;
        this.addingConfigsMode = false;
      },
      (error) => {}
    );
  }
}
