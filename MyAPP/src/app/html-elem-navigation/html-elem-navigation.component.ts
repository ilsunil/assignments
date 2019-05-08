import { Component, OnInit } from '@angular/core';
import { DataSharedService } from '../shared.service';

@Component({
  selector: 'app-html-elem-navigation',
  templateUrl: './html-elem-navigation.component.html',
  styleUrls: ['./html-elem-navigation.component.css']
})
export class HtmlElemNavigationComponent implements OnInit {
  markupErrorsCount;
  constructor(private sharedService: DataSharedService) { }

  ngOnInit() {    
  }

  ngAfterViewChecked(){
    this.sharedService.markupErrorCount.subscribe((errorcount: number) => {
      if(errorcount != -1)
      {
        document.getElementById('markupErrorsCount').innerText = errorcount.toString();
      }
    });
    this.sharedService.attributeErrorsCount.subscribe((errorcount: number) => {
      if(errorcount != -1)
      {
        document.getElementById('attributeErrorsCount').innerText = errorcount.toString();
      }
    });
  }

  showResults(sectionName)
  {
    this.sharedService.htmlSectionName.next(sectionName);    
  }

}
