import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ConceptEditComponent } from '../concept-edit/concept-edit.component';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss'],
})
export class ReportTableComponent implements OnInit {
  @Input() data: any;
  processedData: any;
  conceptIndexes: any = {};

  constructor(private dialog: MatDialog ) {}

  ngOnInit() {
    //console.log('the data :: ', this.data);

    this.processedData = this.processReportData(this.data);
  }

  processReportData(reportData) {
    let reportDataProcessed = {
      ...reportData,
      metadata: this.processMetadata(reportData?.metadata),
      rows: _.map(reportData?.rows, (row) => {
        _.each(Object.keys(this.conceptIndexes), dataKey => {

          if(row[this.conceptIndexes[dataKey]] && row[this.conceptIndexes[dataKey]] != ""){
            row[dataKey] = {
              value: row[dataKey],
              concept: {
                name: row[this.conceptIndexes[dataKey]],
              },
            };

          }

          
        });

        return row;
      }),
    };


    return reportDataProcessed;
  }

  processMetadata(metaData) {
    let processedMetaData = {
      metaData,
      columns: _.filter(metaData?.columns, (column) => {
        if (column?.name && column?.name.startsWith('DXConcept')) {
          let conceptIndex = metaData?.columns.indexOf(column);

          let dataIndex = conceptIndex + 1;

          let Obj = {};

          Obj[metaData?.columns[dataIndex]?.label] = column.label;

          this.conceptIndexes = { ...this.conceptIndexes, ...Obj };
        }

        return column?.name && !column?.name.startsWith('DXConcept');
      }),
    };
    return processedMetaData;
  }

  openConcept(e,concept){
    e.stopPropagation();
    this.dialog.open(ConceptEditComponent, {
      width: '60%',
      height: '450px',
      disableClose: false,
      data: concept,
      panelClass: 'custom-dialog-container',
    });

  }
}
