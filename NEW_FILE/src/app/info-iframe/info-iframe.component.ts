import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-info-iframe',
  templateUrl: './info-iframe.component.html',
  styleUrls: ['./info-iframe.component.css']
})
export class InfoIframeComponent implements OnInit {
  htmlSection;

  @Input() public imagesURL: Array<any>;
  @Input() public selectedUrl: Array<any>;
  @Input() public selectedHref: Array<any>;
  @Input() public isDefault: boolean;
  @Input() public tabSelected: number;

  constructor(public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.tabSelected = 1;
  }

}
