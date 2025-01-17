import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-test-selector',
  templateUrl: './test-selector.component.html',
  styleUrls: ['./test-selector.component.scss'],
})
export class TestSelectorComponent implements OnInit {
  @Input() labDepartments: Array<any>;

  @Output('onSetLabTest') onSetLabTest: EventEmitter<any> = new EventEmitter();
  @Output('resetConfigsSide') resetConfigsSide: EventEmitter<any> = new EventEmitter();

  departmentTests: Array<any> = [];

  constructor() {}

  ngOnInit(): void {}

  setDepartment(e: Event, department: any) {
    e.stopPropagation();

    this.departmentTests = department?.setMembers;

    this.resetConfigsSide.emit()
  }

  selectTest(e: Event, test) {
    e.stopPropagation();

    this.onSetLabTest.emit(test)


  }
}
