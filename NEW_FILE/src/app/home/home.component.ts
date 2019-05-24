import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from '../shared.service';
import { HtmlToTextService } from '../services/html-to-text.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fileName;
  showTextarea: boolean = false;
  isClassVisible: boolean;
  isdisabled: boolean = true;
  public btnName = 'VALIDATE';
  isclicked: boolean = false;
  sendInfo;
  hideelement: boolean = false;
  isClicked: boolean = false;
  AlertDropArea: boolean = false;
  AlertDropAreaText;

  constructor(private router: Router,
    private sharedService: DataSharedService, private htmlToText: HtmlToTextService) {
  }

  // ngOnInit() { }
  ngOnInit(): void {
    window.addEventListener('dragover', e => {
      e && e.preventDefault();
      e.target == document.getElementsByClassName('dropzone')[0];
    }, false);
    window.addEventListener('drop', e => {
      e && e.preventDefault();
      let areaToDrop = document.getElementsByClassName('dropzone')[0];
      console.log(e.target);
      if (e.target != areaToDrop) {
        // alert("please upload it into the area mentioned");
        this.openModal();
        this.AlertDropArea = true;
        this.AlertDropAreaText = 'Please Drop the file in the area mentioned';
        if (this.AlertDropArea) {
          document.getElementsByClassName('modal-content')[0].classList.add('AlertText');
        }
      }
    }, false);
    // window.addEventListener('onclick', e => {
    //   let modal1 = document.getElementById('myModal')
    //   e && e.preventDefault();
    //   if (e.target != modal1) {
    //     modal1.style.display = 'none';
    //   }
    // }, false);
  }

  // Here is the trimspace methos after click the button
  // trimSpaces() {
  //   let strData = (document.getElementById('subject') as HTMLTextAreaElement).value;
  //   strData = strData.replace(/(^\s*)|(\s*$)/gi, '').replace(/[ ]{2,}/gi, ' ').replace(/\n /, '\n');
  //   (document.getElementById('subject') as HTMLTextAreaElement).value = strData;
  // }

  // clear() {
  //   window.location.reload();
  // }

  // to convert the html into text
  htmlToPlaintext() {
    this.isClicked = true;
    const htmlValue2 = (document.getElementById('subject') as HTMLTextAreaElement).value;
    // console.log(this.htmlToText.htmlToPlaintext(htmlValue2));
    this.sendInfo = this.htmlToText.htmlToPlaintext(htmlValue2);

    // condition to check whether the html is uploaded or not(to send the same info to modal component)
    if (this.sendInfo) {
      this.showTextarea = true;
    }
  }

  // to open modal
  openModal() {
    document.getElementById('myModal').style.display = 'block';
  }

  navigatelink(event) {
    // this.showdeviceDropDown = ! this.showdeviceDropDown;
    let mysub: Element = document.getElementById('slide_left');
    mysub.setAttribute("style", "display:inline-block; width: 50%; float: left; overflow-y: scroll;");
    let textmysub: Element = document.getElementById('text_area');
    let mainwrapper: Element = document.getElementById('mywrapper');
    mainwrapper.setAttribute("style", "transform: translateX(-100%); -webkit-transform: translateX(-100%);");
    mainwrapper.classList.toggle('slide-in');
    this.isClassVisible = !this.isClassVisible;
    textmysub.setAttribute("style", "display:inline-block; width: 50%; float: right;");
    this.hideelement = true;
    let hideButton = document.getElementsByClassName('hidebutton');
    hideButton[0].setAttribute("style", "display: none;");
    let hideContent = document.getElementsByClassName('hideUpload');
    hideContent[0].setAttribute("style", "display: none;");
    let hideText = document.getElementsByClassName('pull-right');
    hideText[0].setAttribute("style", "display: none;");
    this.sharedService.HtmlToValidate =
      (<HTMLTextAreaElement>document.getElementById('subject')).value;
    this.router.navigate(['/home']);
  }

}
