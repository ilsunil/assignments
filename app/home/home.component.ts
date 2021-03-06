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
  isClassVisible:boolean;
  isdisabled: boolean = true;
  public btnName = 'VALIDATE';
  isclicked: boolean = false;
  sendInfo;
  hideelement: boolean = false;

  constructor(private router: Router,
    private sharedService: DataSharedService, private htmlToText: HtmlToTextService) { }

  ngOnInit() { }

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

  navigatelink(event){
    // this.showdeviceDropDown = ! this.showdeviceDropDown;
    // Setting 50% left on the error validation section
      document.getElementById('slide_left').setAttribute("style", "display:inline-block; width: 50%; float: left; overflow-y: scroll;");
      // Setting 50% right on the error textarea section
      document.getElementById('text_area').setAttribute("style", "display:inline-block; width: 50%; float: right;");;
      // Sliding the main wrapper once the navigation button is clicked 
      let mainwrapper: Element = document.getElementById('mywrapper');
      mainwrapper.setAttribute("style", "transform: translateX(-100%); -webkit-transform: translateX(-100%);");
      mainwrapper.classList.toggle('slide-in');
      // hidding content section
      this.isClassVisible = !this.isClassVisible;
     document.getElementsByClassName('code-area')[0].setAttribute("style", "height: 70vh !important;");
       // hidding all elements which is not required in the validator page
      this.hideelement = true;
      //document.getElementsByClassName('flname_act')[0].setAttribute("style", "display:none;");
      let hideButton = document.getElementsByClassName('hidebutton');
      hideButton[0].setAttribute("style", "display: none;");
      let hideContent = document.getElementsByClassName('hideUpload');
      hideContent[0].setAttribute("style", "display: none;");
      let hideText = document.getElementsByClassName('pull-right');
      hideText[0].setAttribute("style", "display: none;");
      // Getting the html text value and append it to next slide
    //  this.sharedService.HtmlToValidate =
    //    (<HTMLTextAreaElement>document.getElementById('subject')).value;
     this.router.navigate(['/home']);
   }

}
