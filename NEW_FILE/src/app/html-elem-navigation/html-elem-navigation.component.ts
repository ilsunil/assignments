import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataSharedService } from '../shared.service';

@Component({
  selector: 'app-html-elem-navigation',
  templateUrl: './html-elem-navigation.component.html',
  styleUrls: ['./html-elem-navigation.component.css']
})
export class HtmlElemNavigationComponent implements OnInit {
  markupErrorsCount;
  attributeErrorsCount;
  isInfo: boolean = false;

  @Output() public isInfoevent = new EventEmitter();
  constructor(private sharedService: DataSharedService) { }
  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.sharedService.markupErrorCount.subscribe((errorcount: number) => {
      if (errorcount != -1) {
        document.getElementById('markupErrorsCount').innerText = errorcount.toString();
      }
    });
    this.sharedService.attribErrorsCount.subscribe((attribCounts: number) => {
      if (attribCounts != -1) {
        document.getElementById('attributeErrorsCount').innerText = attribCounts.toString();
      }
    });
  }
  // invoke function on change of the selection navigation tabs
  showResults(sectionName) {
    // Section tabs function for getting next tabs
    this.sharedService.htmlSectionName.next(sectionName);
    if (sectionName == 'info') {
      this.isInfo = true;
      this.isInfoevent.emit(this.isInfo);
      document.getElementById('slide_left').setAttribute('style', 'width: 100%');
      document.getElementsByClassName('bhoechie-tab-menu')[0].setAttribute('style', "max-width: 4.15%");
    } else {
      this.isInfo = false;
      this.isInfoevent.emit(this.isInfo);
      document.getElementById('slide_left').setAttribute('style', 'width: 50%');
      document.getElementsByClassName('bhoechie-tab-menu')[0].setAttribute('style', "max-width: 8.333333%");
    }
    // document.getElementById('slide_left').classList.remove('full_width');
  }

  myFunction(event) {
    let elems = document.querySelector('.active');
    // Check if the element exists to avoid a null syntax error on the removal
    if (elems !== null) {
      elems.classList.remove("active");
    }
    // Add active class on event target
    event.target.classList.add("active");
  }
}
