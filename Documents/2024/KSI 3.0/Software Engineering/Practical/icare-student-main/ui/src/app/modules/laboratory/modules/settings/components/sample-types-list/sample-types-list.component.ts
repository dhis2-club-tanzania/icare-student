import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TestService } from 'src/app/shared/services/test.service';
import { updateSetMember } from 'src/app/store/actions';
import { getSetMembersGrouped, getSpecimenSourceByName } from 'src/app/store/selectors';

@Component({
  selector: 'app-sample-types-list',
  templateUrl: './sample-types-list.component.html',
  styleUrls: ['./sample-types-list.component.scss'],
})
export class SampleTypesListComponent implements OnInit {
  @Input() sampleTypes: any;
  @Input() groupedSampleTypes: any[];
  @Input() labConfigs: any;
  @Input() privileges: any;
  currentSampleGroup: any;
  groupedSampleTypes$: Observable<any>;
  searchingText: string = '';
  mappedSampleTypes: any;
  filteredSampleTypes: any[];
  changedTestsObject: any = {};
  testAvailabilityPayload: any = {
    yes: {
      conceptReferenceTerm: 'acc80039-5ad7-4b02-84e4-ee9f6f0818fc',
      conceptMapType: '781bdc8f-7d8c-11e1-909d-c80aa9edcf4e',
    },
    no: {
      conceptReferenceTerm: 'a65bfc40-149c-4f96-b5ff-aa2caa148cec',
      conceptMapType: '781bdc8f-7d8c-11e1-909d-c80aa9edcf4e',
    },
  };

  currentSampleGroup$: Observable<any>;

  constructor(private testService: TestService, private store: Store) {}

  ngOnInit(): void {
    if (
      this.privileges &&
      !this.privileges['Sample Collection'] &&
      !this.privileges['Sample Tracking'] &&
      !this.privileges['Laboratory Reports'] &&
      !this.privileges['Sample Acceptance and Results'] &&
      !this.privileges['Tests Settings']
    ) {
      window.location.replace('../../../bahmni/home/index.html#/dashboard');
    }
    this.testAvailabilityPayload = this.labConfigs['testAvailability'];
    this.groupedSampleTypes$ = this.store.select(getSetMembersGrouped);
    this.groupedSampleTypes$.pipe(take(1)).subscribe((sampleGroups) => {
      if (sampleGroups) {
        this.currentSampleGroup = sampleGroups[0];
        this.currentSampleGroup$ = this.store.select(getSpecimenSourceByName, {
          name: this.currentSampleGroup?.name,
        });
      }
    });
  }

  onSetCurrentSampleGroup(e, sampleType) {
    e.stopPropagation();
    this.currentSampleGroup = sampleType;
    this.currentSampleGroup$ = this.store.select(getSpecimenSourceByName, {
      name: this.currentSampleGroup?.name,
    });
  }

  addtoSelectedTestsObject(test) {
    this.changedTestsObject[test['uuid']] = {
      loading: true,
      changed: false,
    };

    if (test && test['mappings']) {
      let testAvailability = _.filter(test['mappings'], (mapping) => {
        return mapping['display'].includes('Lab Test Availability:');
      });

      if (testAvailability.length > 0) {
        //check the state and update
        if (
          testAvailability[0].conceptReferenceTerm.code == 'yes' ||
          (testAvailability[0].conceptReferenceTerm.display &&
            testAvailability[0].conceptReferenceTerm.display.includes('yes'))
        ) {
          this.testService
            .updateTestAvailability(
              this.testAvailabilityPayload.no,
              test['uuid'],
              testAvailability[0]['uuid']
            )
            .subscribe((results) => {
              this.store.dispatch(
                updateSetMember({
                  setMember: {
                    ...test,
                    state: 'stalled',
                    mappings: [results],
                  },
                })
              );
              this.changedTestsObject[test['uuid']] = {
                loading: false,
                changed: true,
              };
            });
        } else if (
          testAvailability[0].conceptReferenceTerm.code == 'no' ||
          (testAvailability[0].conceptReferenceTerm.display &&
            testAvailability[0].conceptReferenceTerm.display.includes('no'))
        ) {
          this.testService
            .updateTestAvailability(
              this.testAvailabilityPayload.yes,
              test['uuid'],
              testAvailability[0]['uuid']
            )
            .subscribe((results) => {
              this.store.dispatch(
                updateSetMember({
                  setMember: {
                    ...test,
                    state: 'active',
                    mappings: [results],
                  },
                })
              );
              this.changedTestsObject[test['uuid']] = {
                loading: false,
                changed: true,
              };
            });
        }
      } else {
        this.testService
          .updateTestAvailability(
            this.testAvailabilityPayload.no,
            test['uuid'],
            null
          )
          .subscribe((results) => {
            this.store.dispatch(
              updateSetMember({
                setMember: {
                  ...test,
                  state: 'stalled',
                  mappings: [results],
                },
              })
            );

            this.groupedSampleTypes$ = this.store.select(getSetMembersGrouped);
            this.changedTestsObject[test['uuid']] = {
              loading: false,
              changed: true,
            };
          });
      }
    }
  }

  searchSampleTypes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.mappedSampleTypes = _.filter(this.filteredSampleTypes, (sample) => {
      return sample.display.toLowerCase().includes(filterValue.toLowerCase());
    });
  }
}
