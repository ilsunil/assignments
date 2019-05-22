import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  HostListener,
  Directive,
  Output,
  EventEmitter,
  ViewChildren
} from '@angular/core';
import { DataSharedService } from '../shared.service';

declare var $: any; //intentional use of jQuery-not recommended though

@Component({
  selector: 'app-html-validator',
  templateUrl: './html-validator.component.html',
  styleUrls: ['./html-validator.component.css']
})
@Directive({
  selector: '[scrollTracker]'
})
export class HtmlValidatorComponent implements OnInit {
  @Input() hideelement:boolean = false;
  @HostListener('scroll', ['$event'])
  @ViewChild('inputMessage') inputMessageRef: ElementRef;
  @ViewChild('subject') block: ElementRef;
  @ViewChildren('codeLines') codeLines: ElementRef[];
  @Output() public dataInfoEvent = new EventEmitter();
  @Output() public filaNameEvent = new EventEmitter();
  // Dynamic pulling data from selected file
  FileName;
  textareaLength: number = 1000;
  rows: Array<any>;
  viewMode = 'tab1';
  isdisabled: boolean = true;
  isValue;
  lineNum = 50;
  isData: boolean = true;
  showdeviceDropDown: boolean =true;
  placeholderText: string = '<div class="dropzone">' +
    '<div class="wrap">' +
    '<div class="lhs">' +
    '<i class="fa fa-upload" aria-hidden="true"></i> <p>Drag and Drop or Browse Files</p>' +
    '</div>' +
    '<div class="rhs">' +
    'UPLOAD' +
    '</div>' +
    '</div>' +
    '</div>';

  constructor(private sharedService: DataSharedService) { }

  ngOnInit() {

    }
  showNumber(num) {
    return new Array(num);
  }

  // ondragover(e) {
  //   e = e || event;
  //   e.preventDefault();
  // }
  // ondrop(e) {
  //   e = e || event;
  //   e.preventDefault();
  // }

  public onFilesAdded(files: File[]) {
    // declaring an ID
    this.rows = [];
    let elem: Element = document.getElementById("exampleInputFile");
    // Fetching the Binding File name into the HTML

    // Conditional statement if files are more than one
    if (files.length > 1 || !FileList) {
      alert('Multiple files are not allowed');
    }
    else {
      // Checking files and uploading on condition using each basis
      return files.forEach(file => {
        // Constructing file format name
        const reader = new FileReader();
        // declaring file format name
        let myFiles = files[0].name;
      //  this.selectedFiles = myFiles;
        this.sharedService.FileName = myFiles;

        // Files reader on load
        reader.onload = (e: ProgressEvent) => {
          // this content string could be used directly as an image source
          const content = (e.target as FileReader).result;
          // or be uploaded to a webserver via HTTP request.
          elem.setAttribute("style", "display: block;");
          // Appending data to textarea
         // this.block.nativeElement.innerHTML = content;
          // Fetching element based on the ID of element and displaying it // Adding style to append div overlay
          let Menutoggle: Element = document.getElementById("menu-toggle"); // or something
          Menutoggle.setAttribute("style", "z-index:2;");
          // let paraText = Menutoggle.querySelectorAll('p');

          // Fetching element based on the ID of element and Appending the line number to the value
          // let text = (document.getElementById("subject") as HTMLTextAreaElement).value;
          // // this.sharedService.HtmlToValidate = text;
          // if (text != null) {
          //   this.isdisabled = false;
          //   this.dataInfoEvent.emit(this.isdisabled);
          //   this.filaNameEvent.emit(this.selectedFiles);
          // }
          // if (text != null) {
          //   this.isData = false;
          // }

          // let lines = text.split(/\r|\r\n|\n/);
          // let count = lines.length;
          // this.rows.push(count);
          this.sharedService.HtmlToValidate = content;
         this.sharedService.htmlValueSplitted = (content as string)
         .split('\n').map(( item, idx) => {
           return {
            id: idx,
            text: item,
            isErr: false
           };
         });
          if(this.sharedService.htmlValueSplitted.length){
            this.isdisabled = false;
            this.dataInfoEvent.emit(this.isdisabled);
            this.filaNameEvent.emit(this.FileName);
          }

        };
        // use this for basic text files like .txt, html or .csv
        reader.readAsText(file, 'UTF-8');

        // use this for images
        // reader.readAsDataURL(file);
      });
    }
  }

  // // When scroll down the screen
  // onScroll(event) {
  //   // Element selector based on class name
  //   let input: HTMLElement = <HTMLElement>document.querySelector('.lined');
  //   let result: HTMLElement = <HTMLElement>document.querySelector('.lines');
  //   // Offest position the Div to check the scroll along with the line number f text area
  //   let factor = input.scrollTop / (input.scrollHeight - input.offsetHeight);
  //   let scrollPosition = factor * (result.scrollHeight - result.offsetHeight);
  //   result.scrollTop = scrollPosition;
  // }

  showHtml() {
    let sH = (document.getElementById('preview') as HTMLTextAreaElement).classList.add('active');
    let sC = (document.getElementById('code') as HTMLTextAreaElement).classList.remove('active');
    const InputFile1 = (document.getElementById('codeArea') as HTMLTextAreaElement);
    InputFile1.setAttribute('style', 'display:none');
    const InputFile2: Element = document.getElementById('pvArea');
    InputFile2.setAttribute('style', 'display:block');
   // let txArea1 = (document.getElementById('subject') as HTMLTextAreaElement).value;
    // console.log(txArea1);
    let viewHtml = (document.getElementById('pvArea') as HTMLTextAreaElement);
    viewHtml.innerHTML = this.sharedService.HtmlToValidate;

    viewHtml.style.border = "1px solid #dddddd";
    viewHtml.style.margin = "0px auto 20px";
    viewHtml.style.padding = "20px";
    viewHtml.style.height = "77vh";
    viewHtml.style.overflowY = "scroll";

    // let viewHtml = document.getElementById('htmlPreview');
    // console.log(this.htmlValue);
    // viewHtml.innerHTML = this.htmlValue;
  }
  showCode() {
    let sH = (document.getElementById('preview') as HTMLTextAreaElement).classList.remove('active');
    let sC = (document.getElementById('code') as HTMLTextAreaElement).classList.add('active');
    const InputFile1 = (document.getElementById('codeArea') as HTMLTextAreaElement);
    InputFile1.setAttribute('style', 'display:block');
    const InputFile2: Element = document.getElementById('pvArea');
    InputFile2.setAttribute('style', 'display:none');
    // let txArea1 = (document.getElementById('subject') as HTMLTextAreaElement).value;
  }
trackByFn(idx, item){
  return item.id;
}

}
