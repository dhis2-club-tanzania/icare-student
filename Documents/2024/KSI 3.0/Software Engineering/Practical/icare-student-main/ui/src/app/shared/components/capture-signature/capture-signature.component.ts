import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { CurrentUserService } from "src/app/core/services";
import { SystemUsersService } from "src/app/core/services/system-users.service";

@Component({
  selector: "app-capture-signature",
  templateUrl: "./capture-signature.component.html",
  styleUrls: ["./capture-signature.component.scss"],
})
export class CaptureSignatureComponent implements OnInit {
  alreadySigned: boolean = false;
  isDrawing: boolean = false;
  sigPadElement;
  context;
  signatureImg: string;
  @ViewChild("sigPad") sigPad: ElementRef;
  updatingUser: boolean = false;
  data: any;
  providerDetails$: Observable<any>;
  providerAttributeDetails$: Observable<any>;
  providerAttributes$: Observable<any[]>;
  isProviderAttributeFormValid: boolean = false;
  providerFormValues: any[];
  constructor(
    private dialogRef: MatDialogRef<CaptureSignatureComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private currentUserService: CurrentUserService,
    private userService: SystemUsersService
  ) {
    this.data = data;
  }

  ngOnInit(): void {
    this.getProviderDetails();
    this.providerAttributes$ = this.currentUserService.getProviderAttributes();
  }

  getProviderDetails(): void {
    this.providerDetails$ = this.currentUserService.getProviderByUserDetails(
      this.data?.userUuid
    );
  }

  ngAfterViewInit(): void {
    if (!this.signatureImg) {
      this.sigPadElement = this.sigPad.nativeElement;
      this.context = this.sigPadElement.getContext("2d");
      this.context.strokeStyle = "#3742fa";
    }
  }

  onClose(event) {
    event.stopPropagation();
    this.dialogRef.close();
  }

  @HostListener("document:mouseup", ["$event"])
  onMouseUp(e) {
    this.isDrawing = false;
  }

  onMouseDown(e) {
    this.isDrawing = true;
    const coords = this.relativeCoords(e);
    this.context.moveTo(coords.x, coords.y);
  }

  onMouseMove(e) {
    if (this.isDrawing) {
      const coords = this.relativeCoords(e);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
      this.signatureImg = this.sigPadElement.toDataURL("image/png");
    }
  }

  private relativeCoords(event) {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return { x: x, y: y };
  }

  clearPad() {
    this.context.clearRect(
      0,
      0,
      this.sigPadElement.width,
      this.sigPadElement.height
    );
    this.context.beginPath();
    this.signatureImg = null;
  }

  onSave(
    event: Event,
    providerDetails: any,
    providerFormValues: any,
    isSignature: boolean
  ): void {
    event.stopPropagation();
    this.updatingUser = true;
    if (isSignature) {
      const providerSignatureAttribute = {
        attributeType: "ecc4e84e-823c-4a1e-94dc-c349b9c64cca",
        value: this.signatureImg,
      };

      this.providerAttributeDetails$ =
        this.currentUserService.createProviderAttribute(
          providerDetails?.uuid,
          providerSignatureAttribute
        );

      this.providerAttributeDetails$.subscribe((response) => {
        if (response) {
          // TODO: Add support to check the handled error from service
          this.updatingUser = false;
          this.getProviderDetails();
        }
      });
    } else {
      const provider = {
        identifier: this.data.user?.username,
        person: this.data?.user?.person?.uuid,
        attributes: Object.keys(providerFormValues).map((key) => {
          return {
            attributeType: key,
            value: providerFormValues[key]?.value,
          };
        }),
      };

      this.userService
        .createProvider({ provider: provider })
        .subscribe((response) => {
          if (response) {
            this.updatingUser = false;
            this.getProviderDetails();
          }
        });
    }
  }

  onGetAttributesFormValues(formValues: any): void {
    this.providerFormValues = formValues;
  }

  onGetFormValidity(isValid: boolean): void {
    this.isProviderAttributeFormValid = isValid;
  }
}
