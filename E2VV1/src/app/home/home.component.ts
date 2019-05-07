import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  strData = '';

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

  navigatelink() {
    this.sharedService.HtmlToValidate =
      (<HTMLTextAreaElement>document.getElementById('subject')).value;
    this.router.navigate(['/dashboard']);
  }

}
