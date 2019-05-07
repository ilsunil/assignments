import { Component, OnInit, ViewChild, ElementRef, Input, HostListener, Directive, Output} from '@angular/core';
import { DataSharedService } from '../shared.service';
declare var $: any; //intentional use of jQuery-not recommended though

@Component({
  selector: 'app-html-validator',
  templateUrl: './html-validator.component.html',
  styleUrls: ['./html-validator.component.css']
})
export class HtmlValidatorComponent implements OnInit {

constructor(private sharedService: DataSharedService) { }
  ngOnInit() {
  }
@HostListener('scroll', ['$event'])
@ViewChild('inputMessage') inputMessageRef: ElementRef;
@ViewChild("subject") block: ElementRef;
  // Dynamic pulling data from selected file
  selectedFiles = '';
  textareaLength: number = 1000;
  rows:Array<any> = [];
 
  public onFilesAdded(files: File[])  {
    // declaring an ID
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
        this.selectedFiles = myFiles;
        this.sharedService.FileName = myFiles; // sharing filename for validation
        // Files reader on load
        reader.onload = (e: ProgressEvent) => {
          // this content string could be used directly as an image source
          const content = (e.target as FileReader).result;
          // or be uploaded to a webserver via HTTP request.
          elem.setAttribute("style", "display: none;");
          // Appending data to textarea
          this.block.nativeElement.innerHTML = content;
          // Fetching element based on the ID of element and displaying it // Adding style to append div overlay
          let Menutoggle: Element = document.getElementById("menu-toggle"); // or something         
          Menutoggle.setAttribute("style", "z-index:-1;");
          // Fetching element based on the ID of element and Appending the line number to the value
          let text = (document.getElementById("subject") as HTMLTextAreaElement).value;   
          let lines = text.split(/\r|\r\n|\n/);
          let count = lines.length;
          this.rows.push(count);
        };
        // use this for basic text files like .txt, html or .csv
        reader.readAsText(file, 'UTF-8');
        // use this for images
        // reader.readAsDataURL(file);
      });
    }
  }
  // When scroll down the screen  
  onScroll(event) {
    // Element selector based on class name 
    let input: HTMLElement = <HTMLElement>document.querySelector('.lined');
    let result: HTMLElement = <HTMLElement>document.querySelector('.lines');
    // Offest position the Div to check the scroll along with the line number f text area
    let factor = input.scrollTop / (input.scrollHeight - input.offsetHeight);
    let scrollPosition = factor * (result.scrollHeight - result.offsetHeight);
    result.scrollTop = scrollPosition;
  }
}
