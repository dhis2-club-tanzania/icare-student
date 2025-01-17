import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import * as _ from 'lodash';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
  fileData: any;
  @Input() patientUuid: string;
  @Input() conceptUuid: string;
  @Input() encounterUuid: string;
  @Output() fileInfo = new EventEmitter<any>();
  obsData: any;
  attachmentObs: any;
  deleteIsSet: boolean = false;
  deleting: boolean = false;
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getObsDetails(this.encounterUuid).subscribe((response) => {
      _.map(response?.obs, (obs) => {
        if (obs?.concept?.uuid == this.conceptUuid) {
          this.obsData = obs?.value;
          this.attachmentObs = obs;
        }
      });
    });
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  fileSelection(event) {
    const element: HTMLElement = document.getElementById('file-selector');
    var f = event.target.files[0]; // FileList object

    this.getBase64(f).then((data: string) => {
      this.fileData = {
        patientUuid: this.patientUuid,
        fileType: 'pdf',
        content: data.replace('data:application/pdf;base64', ''),
        format: 'pdf',
      };
      // console.log('data.............', this.fileData);
      this.dataService
        .uploadFileToBahmni(this.fileData)
        .subscribe((response) => {
          if (response) {
            this.fileInfo.emit(response?.url);
            this.dataService
              .getObsDetails(this.encounterUuid)
              .subscribe((response) => {
                _.map(response?.obs, (obs) => {
                  if (obs?.concept?.uuid == this.conceptUuid) {
                    this.obsData = obs?.value;
                    this.attachmentObs = obs;
                  }
                });
              });
          }
        });
    });

    event.srcElement.value = null;
  }

  onDeleteAttachment(e, status) {
    this.deleteIsSet = status == false ? true : true;
    e.stopPropagation();
    if (status) {
      this.deleting = true;
      this.dataService.deleteObs(this.attachmentObs?.uuid);
      setTimeout(() => {
        this.deleting = false;
        this.obsData = null;
      }, 500);
    }
  }

  onCancel(e) {
    e.stopPropagation();
    this.deleteIsSet = false;
  }

  handleFileSelect(evt) {
    let base64FileString = '';
    var f = evt.target.files[0]; // FileList object
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return function (e) {
        var binaryData = e.target.result;
        //Converting Binary Data to base 64
        base64FileString = window.btoa(binaryData);
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
    return base64FileString;
  }
}
