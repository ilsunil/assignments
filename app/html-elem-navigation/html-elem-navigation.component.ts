import { Component, OnInit } from '@angular/core';
import { DataSharedService } from '../shared.service';
@Component({
  selector: 'app-html-elem-navigation',
  templateUrl: './html-elem-navigation.component.html',
  styleUrls: ['./html-elem-navigation.component.css']
})
export class HtmlElemNavigationComponent implements OnInit {
  markupErrorsCount;
  attributeErrorsCount;
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
    this.sharedService.attribErrorsCount.subscribe((attribCounts: number) => {
      if(attribCounts != -1)
      {
        document.getElementById('attributeErrorsCount').innerText = attribCounts.toString();
      }
    });
  }
  // invoke function on change of the selection navigation tabs
 showResults(sectionName){
   // Section tabs function for getting next tabs
    this.sharedService.htmlSectionName.next(sectionName);
  }

  myFunction(event) {
    let elems = document.querySelector('.active');
     // Check if the element exists to avoid a null syntax error on the removal
     if(elems !==null){
      elems.classList.remove("active");
     }
   // Add active class on event target
    event.target.classList.add("active");
  }
}
