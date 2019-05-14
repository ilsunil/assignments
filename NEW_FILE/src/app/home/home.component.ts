import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from '../shared.service';
import {trigger, state, style, transition, animate} from '@angular/animations';
import { BlockingProxy } from 'blocking-proxy';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ],
})
export class HomeComponent implements OnInit {
  strData = '';
  showdeviceDropDown: boolean = true; // hidden by default
  menuState:string = 'out';
  @Input() show: boolean = true; 

  constructor(private router: Router,
    private sharedService: DataSharedService) { }

  ngOnInit() {
  }
    // Here is the trimspace methos after click the button
  trimSpaces() {
    let strData = (document.getElementById('subject') as HTMLTextAreaElement).value;
    strData = strData.replace(/(^\s*)|(\s*$)/gi, '').replace(/[ ]{2,}/gi, ' ').replace(/\n /, '\n');
    (document.getElementById('subject') as HTMLTextAreaElement).value = strData;
  }

  clear() {
    (document.getElementById('exampleInputFile') as HTMLTextAreaElement).style.display = 'block';
    const InputFile: Element = document.getElementById('exampleInputFile');
    InputFile.setAttribute('style', 'display:block;');
    const InputFile2: Element = document.getElementById('menu-toggle');
    InputFile2.setAttribute('style', 'z-index:2;');
  }

  navigatelink(){
   // this.showdeviceDropDown = ! this.showdeviceDropDown;
     let mysub: Element = document.getElementById('modal_id');
     mysub.setAttribute("style", "display:inline-block; width: 50%; float: left; overflow-y: scroll;");
     let textmysub: Element = document.getElementById('text_area');
     textmysub.setAttribute("style", "display:inline-block; width: 50%; float: right;");
    this.showdeviceDropDown = false;

    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    this.sharedService.HtmlToValidate =
      (<HTMLTextAreaElement>document.getElementById('subject')).value;
    this.router.navigate(['/home']);
  }

}
