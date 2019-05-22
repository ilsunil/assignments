import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HtmlToTextService } from '../services/html-to-text.service';
import { DataSharedService } from '../shared.service';
import { BlockingProxy } from 'blocking-proxy';
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  strData = '';
  @Input() show: boolean = true;
  isClassVisible:boolean;
  fileName;
  showTextarea: boolean = false;
  @Input() public nameOfTheButton: string;
  @Input() public disable: boolean;
  @Input() public isHidden: boolean;

  constructor(private router: Router,
    private sharedService: DataSharedService) { }

  ngOnInit() {

  }
}
