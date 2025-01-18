import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { VisitsService } from "src/app/shared/resources/visits/services";

@Component({
  selector: "app-visit-claim",
  templateUrl: "./visit-claim.component.html",
  styleUrls: ["./visit-claim.component.scss"],
})
export class VisitClaimComponent implements OnInit, AfterViewInit {
  // TODO: Soft code signature visit attribute
  clientSignatureVisitAttribute: string =
    "8baac28c-0129-4ecc-9a45-b287a8ca7674";
  visitUuid: string;
  visitClaim$: Observable<any>;
  clientSignature: string;
  allVisitDetails: any;
  visitUpdateResponse$: Observable<any>;
  updatingVisit: boolean = false;
  alreadySigned: boolean = false;
  signatureImg: string;

  @ViewChild("sigPad") sigPad: ElementRef;
  isDrawing = false;
  sigPadElement;
  context;
  constructor(
    private visitService: VisitsService,
    private dialogRef: MatDialogRef<VisitClaimComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    const signatureAttribute = (data?.attributes.filter(
      (attribute) =>
        attribute?.visitAttributeDetails?.attributeType?.uuid ===
        this.clientSignatureVisitAttribute
    ) || [])[0];

    this.signatureImg = signatureAttribute
      ? signatureAttribute?.visitAttributeDetails?.value
      : null;
    this.alreadySigned = signatureAttribute ? true : false;
    this.allVisitDetails = data;
    this.visitUuid = data?.uuid;
  }

  ngOnInit(): void {
    this.visitClaim$ = this.visitService.getVisitClaim(this.visitUuid);
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
  }

  savePad(event: Event, allVisitDetails) {
    event.stopPropagation();
    this.signatureImg = this.sigPadElement.toDataURL("image/png");
    this.updatingVisit = true;
    const clientSignatureVisitAttribute = {
      attributeType: this.clientSignatureVisitAttribute,
      value: this.signatureImg,
    };
    const visitDetails = {
      uuid: allVisitDetails?.uuid,
      location: allVisitDetails?.location?.uuid,
      attributes: [clientSignatureVisitAttribute],
      visitType: allVisitDetails?.visitType?.uuid,
    };
    this.visitUpdateResponse$ = this.visitService.updateVisit(
      allVisitDetails?.uuid,
      visitDetails
    );

    this.visitUpdateResponse$.subscribe((response) => {
      if (response) {
        this.updatingVisit = false;
      }
    });
  }
}
