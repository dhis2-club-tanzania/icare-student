import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Pivot from 'quick-pivot';
import { PivotLayoutModelComponent } from '../../components/pivot-layout-model/pivot-layout-model.component';
import { find } from 'lodash';

@Component({
  selector: 'app-quick-pivot',
  templateUrl: './quick-pivot.component.html',
  styleUrls: ['./quick-pivot.component.scss'],
})
export class QuickPivotComponent implements OnInit {
  @Input() dataToPivot: any;
  readyToRenderData: boolean = false;
  pivotedData: any;
  arrayOfItems: any[] = [];
  allKeysFromData: string[];
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.arrayOfItems = [];
    this.allKeysFromData = Object.keys(this.dataToPivot[0]);
    this.arrayOfItems = [...this.arrayOfItems, this.allKeysFromData];
    this.dataToPivot.forEach((row) => {
      let rowArr = [];
      this.allKeysFromData.forEach((key) => {
        rowArr.push(row[key]);
      });
      this.arrayOfItems.push(rowArr);
    });
    const rowsToPivot = ['Payment Category'];
    const colsToPivot = ['Visit Type', 'Gender'];
    const aggregationDimension = 'Name';
    const aggregator = 'count';

    this.pivotedData = new Pivot(
      this.arrayOfItems,
      rowsToPivot,
      colsToPivot,
      aggregationDimension,
      aggregator
    );
    this.readyToRenderData = true;
  }

  changeLayout(event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(PivotLayoutModelComponent, {
        width: '60%',
        data: this.allKeysFromData,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response?.shouldUpdate) {
          this.readyToRenderData = false;
          const rowsToPivot = response?.rows;
          const colsToPivot = response?.columns;
          const aggregationDimension = 'Name';
          const aggregator = 'count';
          this.allKeysFromData = Object.keys(this.dataToPivot[0]);

          // Create new object for pivoting

          const formattedDataToPivot = this.dataToPivot.map((dataRow) => {
            let newDataRow = {};
            this.allKeysFromData.forEach((key) => {
              if (
                (
                  response?.excludedKeys.filter(
                    (excluded) => excluded === key
                  ) || []
                )?.length === 0
              ) {
                newDataRow[key] = dataRow[key];
              }
            });
            return newDataRow;
          });

          this.arrayOfItems = [];
          const currentKeys = Object.keys(formattedDataToPivot[0]);
          this.arrayOfItems[0] = currentKeys;
          formattedDataToPivot.forEach((row) => {
            let rowArr = [];
            currentKeys.forEach((key) => {
              rowArr.push(row[key]);
            });
            this.arrayOfItems.push(rowArr);
          });
          this.pivotedData = new Pivot(
            this.arrayOfItems,
            rowsToPivot,
            colsToPivot,
            aggregationDimension,
            aggregator
          );
          setTimeout(() => {
            this.readyToRenderData = true;
          }, 100);
        }
      });
  }
}
