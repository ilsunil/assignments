import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReviewName, ReviewHeader, FixedElements } from 'src/app/common.utils';
import { DataSharedService } from 'src/app/shared.service';
import { nextContext } from '@angular/core/src/render3';
import { debug } from 'util';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css']
})
export class ReviewModalComponent implements OnInit {

  htmlContent;
  currPage = 1;
  totalCount = 0;
  reviewHeader;
  lineNumber = 0;
  currCode;
  fixedCode;
  fixedCount = 0;
  isMoveNextDisabled;
  isMovePreviousDisabled;
  moveNextStyleColor;
  movePreviousStyleColor;
  allImageTags;
  isFixBtnDisabled = false;
  currImageElement: HTMLImageElement;
  fixedElems: FixedElements[] = [];
  anchorStyle={
    enable:'#',
    disable:''
  }
  anchorColor={
    enable:'#1A5276',
    disable:'#C6CED1'
  }
  buttonNames={
    fix:'Fix',
    skip:'SKIP',
    fixAll: 'Fix All'
  }
  
  nonAsciiToAsciiMapping = [
    {nonAscii:'©', ascii:'&#169;'},{nonAscii:'®', ascii:'&#174;'},{nonAscii:'À', ascii:'&#192;'},
    {nonAscii:'Á', ascii:'&#193;'},{nonAscii:'Â', ascii:'&#194;'},{nonAscii:'Ã', ascii:'&#195;'},
    {nonAscii:'Ä', ascii:'&#196;'},{nonAscii:'Å', ascii:'&#197;'},{nonAscii:'Æ', ascii:'&#198;'},
    {nonAscii:'Ç', ascii:'&#199;'},{nonAscii:'È', ascii:'&#200;'},{nonAscii:'É', ascii:'&#201;'},
    {nonAscii:'Ê', ascii:'&#202;'},{nonAscii:'Ë', ascii:'&#203;'},{nonAscii:'Ì', ascii:'&#204;'},
    {nonAscii:'Í', ascii:'&#205;'},{nonAscii:'Î', ascii:'&#206;'},{nonAscii:'Ï', ascii:'&#207;'},
    {nonAscii:'Ð', ascii:'&#208;'},{nonAscii:'Ñ', ascii:'&#209;'},{nonAscii:'Õ', ascii:'&#213;'},
    {nonAscii:'Ö', ascii:'&#214;'},{nonAscii:'Ø', ascii:'&#216;'},{nonAscii:'Ù', ascii:'&#217;'},
    {nonAscii:'Ú', ascii:'&#218;'},{nonAscii:'Û', ascii:'&#219;'},{nonAscii:'Ü', ascii:'&#220;'},
    {nonAscii:'Ý', ascii:'&#221;'},{nonAscii:'÷', ascii:'&#247;'},{nonAscii:'Ÿ', ascii:'&#376;'},
    {nonAscii:'¡', ascii:'&#161;'},{nonAscii:'ï', ascii:'&#239;'},{nonAscii:'¬', ascii:'&#172;'},
    {nonAscii:'ﬂ', ascii:'&#64258;'},{nonAscii:'ﬁ', ascii:'&#64257;'},{nonAscii:'ï', ascii:'&#239;'},
    {nonAscii:'¢', ascii:'&#162;'},{nonAscii:'£', ascii:'&#163;'},{nonAscii:'¥', ascii:'&#165;'},
    {nonAscii:'¦', ascii:'&#166;'},{nonAscii:'§', ascii:'&#167;'},{nonAscii:'ª', ascii:'&#170;'},
    {nonAscii:'°', ascii:'&#176;'},{nonAscii:'±', ascii:'&#177;'},{nonAscii:'´', ascii:'&#180;'},
    {nonAscii:'µ', ascii:'&#181;'},{nonAscii:'•', ascii:'&#8226;'},{nonAscii:'€', ascii:'&#8364;'},
    {nonAscii:'‘', ascii:'&#8216;'},{nonAscii:'ƒ', ascii:'&#402;'},{nonAscii:'…', ascii:'&#8230;'},
    {nonAscii:'†', ascii:'&#8224;'},{nonAscii:'‡', ascii:'&#8225;'},{nonAscii:'Š', ascii:'&#352;'},
    {nonAscii:'Œ', ascii:'&#338;'},{nonAscii:'Ž', ascii:'&#381;'},{nonAscii:'–', ascii:'&#8211;'},
    {nonAscii:'—', ascii:'&#8212;'},{nonAscii:'ž', ascii:'&#382;'},{nonAscii:'Þ', ascii:'&#222;'},
    {nonAscii:'ß', ascii:'&#223;'},{nonAscii:'à', ascii:'&#224;'},{nonAscii:'á', ascii:'&#225;'},
    {nonAscii:'â', ascii:'&#226;'},{nonAscii:'ã', ascii:'&#227;'},{nonAscii:'ä', ascii:'&#228;'},
    {nonAscii:'å', ascii:'&#229;'},{nonAscii:'ç', ascii:'&#231;'},{nonAscii:'è', ascii:'&#232;'},
    {nonAscii:'é', ascii:'&#233;'},{nonAscii:'ê', ascii:'&#234;'},{nonAscii:'ë', ascii:'&#235;'},
    {nonAscii:'ì', ascii:'&#236;'},{nonAscii:'í', ascii:'&#237;'},{nonAscii:'î', ascii:'&#238;'},
    {nonAscii:'ï', ascii:'&#239;'},{nonAscii:'ð', ascii:'&#240;'},{nonAscii:'ñ', ascii:'&#241;'},
    {nonAscii:'ò', ascii:'&#242;'},{nonAscii:'ó', ascii:'&#243;'},{nonAscii:'ô', ascii:'&#244;'},
    {nonAscii:'õ', ascii:'&#245;'},{nonAscii:'ö', ascii:'&#246;'},{nonAscii:'¹', ascii:'&#185;'},
    {nonAscii:'þ', ascii:'&#254;'},{nonAscii:'¿', ascii:'&#191;'},{nonAscii:'™', ascii:'&#8482;'},
    {nonAscii:'œ', ascii:'&#339;'},{nonAscii:'ÿ', ascii:'&#255;'},{nonAscii:'ù', ascii:'&#249;'},
    {nonAscii:'ú', ascii:'&#250;'},{nonAscii:'û', ascii:'&#251;'},{nonAscii:'ý', ascii:'&#253;'},
    {nonAscii:'›', ascii:'&#8250;'},{nonAscii:'š', ascii:'&#353;'},{nonAscii:'æ', ascii:'&#230;'},
    {nonAscii:'’', ascii:'&#8217;'},{nonAscii:'¨', ascii:'&#168;'},{nonAscii:'ù', ascii:'&#249;'},
    {nonAscii:'ú', ascii:'&#250;'},{nonAscii:'û', ascii:'&#251;'},{nonAscii:'·', ascii:'&#183;'},
    {nonAscii:'“', ascii:'&#8220;'},{nonAscii:'”', ascii:'&#8221;'},{nonAscii:'', ascii:'&#129;'},
    {nonAscii:'‚', ascii:'&#8218;'}
  ];

  @Input() reviewName;
  @Output() fixedCountChange = new EventEmitter();

  constructor(private sharedService: DataSharedService) { }

  ngOnInit() {
    this.htmlContent = this.sharedService.HtmlToValidate;
    this.allImageTags = this.sharedService.getImgTags;
  }

  ngOnChanges()
  {
    if(this.reviewName == ReviewName.altToTitle){
      this.reviewHeader = ReviewHeader.altToTitle;
      this.totalCount = this.sharedService.getAltTitleTotalCount; 
      this.setImgAttribsInUi();
    }
  }

  moveNextAndSkipFix(){
    event.preventDefault();
    if(this.isMoveNextDisabled == this.anchorStyle.enable)
    {
      this.currPage++;
      this.setImgAttribsInUi();
    }

    if(this.checkElemIsFixed())
      this.isFixBtnDisabled = true;
    else
      this.isFixBtnDisabled = false;
  }

  movePrevious(){
    event.preventDefault();
    if(this.isMovePreviousDisabled == this.anchorStyle.enable)
    {
      this.currPage--;
      this.setImgAttribsInUi();
    }

    if(this.checkElemIsFixed())
      this.isFixBtnDisabled = true;
    else
      this.isFixBtnDisabled = false;
  }

  setImgAttribsInUi()
  {    
      if(this.currPage == 1)
      {
        this.isMovePreviousDisabled = this.anchorStyle.disable;
        this.movePreviousStyleColor = this.anchorColor.disable;
      }

      if(this.currPage < this.totalCount)
      {
        this.isMoveNextDisabled = this.anchorStyle.enable;
        this.moveNextStyleColor = this.anchorColor.enable;        
      }

      if(this.currPage > 1)
      {
        this.isMovePreviousDisabled = this.anchorStyle.enable;
        this.movePreviousStyleColor = this.anchorColor.enable;
      }

      if(this.currPage == this.totalCount)
      {
        this.isMoveNextDisabled = this.anchorStyle.disable;
        this.moveNextStyleColor = this.anchorColor.disable;
      }

      this.currImageElement = this.getImgElement(this.currPage, this.allImageTags);
      this.currCode = this.currImageElement.alt; 
      this.fixedCode = this.currImageElement.alt; 
  }  

  getImgElement(pageNumber, imgTags)
  {
    return imgTags[this.sharedService.readIndexMapping.indexOf(pageNumber)];
  }
  
  fixAltToTitle()
  {
    if(!this.checkElemIsFixed())
    {
      this.fixedCount++;
      this.currImageElement.title = this.currImageElement.alt;
      (document.getElementById('subject') as HTMLTextAreaElement).value = 
                this.sharedService.getDocType + '\n' +
                this.currImageElement.ownerDocument.documentElement.outerHTML;
      this.trackElemIsFixed(this.currPage);      
    }
    this.isFixBtnDisabled = true;
    this.fixedCountChange.emit(this.fixedCount);
  }

  checkElemIsFixed()
  {
    for(let i = 0; i < this.fixedElems.length;i++)
    {
      if(this.fixedElems[i].index == this.currPage)
        return true;
    }
    return false;
  }

  fixAll()
  {
    let fixCount = 0;
    event.preventDefault();
    this.isMovePreviousDisabled = this.anchorStyle.disable;
    this.movePreviousStyleColor = this.anchorColor.disable;

    this.isMoveNextDisabled = this.anchorStyle.disable;
    this.moveNextStyleColor = this.anchorColor.disable;

    Array.from(this.allImageTags).forEach((elem: HTMLImageElement, i) => {
      if(
          (elem.hasAttribute('alt') && elem.alt != '' && !elem.hasAttribute('title')) ||
          (elem.hasAttribute('alt') && elem.alt != '' && elem.hasAttribute('title') && 
              elem.title == '')
        )
      { 
        fixCount++;       
        elem.title = elem.alt;
      }
    });

    (document.getElementById('subject') as HTMLTextAreaElement).value = 
              this.sharedService.getDocType + '\n' +
              this.currImageElement.ownerDocument.documentElement.outerHTML;
    this.fixedCount = fixCount;
    this.fixedCountChange.emit(this.fixedCount);
  }
  
  trackElemIsFixed(index)
  {
    let fixElem: FixedElements = {index : index, fixed : true};
    this.fixedElems.push(fixElem);
  }

  undoAltToTitle(imgTags, index)
  {
    (imgTags[index] as HTMLImageElement).removeAttribute('title');
  }

  closeModal() {
    document.getElementById('reviewModal').style.display = 'none';
  }

}
