import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-profiles-and-access-control",
  templateUrl: "./profiles-and-access-control.component.html",
  styleUrls: ["./profiles-and-access-control.component.scss"],
})
export class ProfilesAndAccessControlComponent implements OnInit {
  @Input() currentUser: any;
  constructor() {}

  ngOnInit(): void {}
}
