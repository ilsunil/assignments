import { Component, OnInit, HostListener, Input } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() public convertHtml: string;  // Input from home compenent to have the html value
  @Input() public fileName: string; // Filename from the home compenent
  @Input() public htmlPresent: string; // To check whether the html is present or not(condtion to have text area or not)
  @Input() public isClicked: boolean;
  @Input() public AlertDropArea: boolean;
  @Input() public AlertDropAreaText: string;

  constructor() { }

  ngOnInit() {
  }

  // to close the modal
  closeModal() {
    document.getElementById('myModal').style.display = 'none';
  }

  // save the converted HTML file
  SaveTextFile() {
    const oTextarea = this.convertHtml.replace(/\n/g, '\r\n');
    const blob = new Blob([oTextarea], { type: 'text/plain;charset=utf-8' });
    this.fileName = this.fileName.replace('.html', '');
    saveAs(blob, this.fileName + '.txt');
    // document.getElementById('myModal').style.display = 'none';
  }

}
