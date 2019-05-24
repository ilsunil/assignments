import { Component, OnInit } from '@angular/core';
import { DataSharedService } from '../shared.service';

@Component({
  selector: 'app-html-validator-footer',
  templateUrl: './html-validator-footer.component.html',
  styleUrls: ['./html-validator-footer.component.css']
})
export class HtmlValidatorFooterComponent implements OnInit {
  isdisabled: boolean = true;
  public btnName = 'PROCEED';
  constructor() { }

  ngOnInit() {
  }

}
