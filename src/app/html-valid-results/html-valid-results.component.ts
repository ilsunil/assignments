import { Component, OnInit, Input, AfterViewChecked, Output, EventEmitter, ViewChild, ElementRef, Renderer } from '@angular/core';
import { DataSharedService } from '../shared.service';
import { SectionNames } from '../common.utils';
import { HtmlValidatorComponent } from '../html-validator/html-validator.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { eventNames } from 'cluster';

@Component({
  selector: 'app-html-valid-results',
  templateUrl: './html-valid-results.component.html',
  styleUrls: ['./html-valid-results.component.css'],
  animations: [
    trigger('slideDown', [
      state('initial', style({
        overflow: 'hidden',
        height: '15em'
      })),
      state('final', style({
        overflow: 'hidden',
        height: '*'
      })),
      transition('initial=>final', animate('600ms')),
      transition('final=>initial', animate('400ms'))
    ]),
    trigger('iconTrigger', [
      state('initial', style({ transform: 'rotate(0deg)' })),
      state('final', style({ transform: 'rotate(-180deg)' })),
      transition('initial => final', animate('200ms ease-in')),
      transition('final => initial', animate('200ms ease-out'))
  ])
  ]
})
export class HtmlValidResultsComponent implements OnInit, AfterViewChecked {
  title = 'Select/Deselect all errors';
  textAreaValue = this.sharedService.HtmlToValidate;
  htmlValue = this.sharedService.HtmlToValidate;
  parser = new DOMParser().parseFromString(this.htmlValue, 'text/html');
  isInitialized = false;
  htmlSection;
  fileName;
  attrSearchObj;
  attrSearchObjErrors;
  attrSearchObjErrorsDisp = [];
  selectAllBtn = true;
  contentSearchObj;
  HTMLSearchObj;
  HTMLSearchImagesObj;
  currentState = 'initial';
  initial = false;


  statusClassNames = {
    available: 'fa fa-check-square',
    unavailable: 'fa fa-window-close markupError'
  };
  htmlClassNames = {
    available: 'value',
    unavailable: 'errortd'
  };
  divStatusClassNames = {
    green: 'bg-success w-25 text-white rounded mt-3 mb-3 pt-2 pb-2',
    red: 'bg-danger w-25 text-white rounded mt-3 mb-3 pt-2 pb-2'
  };

  constructor(
    private sharedService: DataSharedService,
    private HtmlValidatorComponent: HtmlValidatorComponent, private elementRef: ElementRef, private render: Renderer ) {}

  ngOnInit() {

// Invoke error value in another file
  // this.attrSearchObjErrors.emit(this.validateAttribute);

    // Invoke the subscribe method to load the HTML sections
    this.sharedService.htmlSectionName.subscribe((secName: string) => {
      const lineNums = this.attrSearchObjErrorsDisp.map(item => item.line -1);
      this.setErrColorsToLines(
        null,
        lineNums,
        secName === SectionNames.attributes
      );
      switch (secName) {
        case SectionNames.attributes:
          this.htmlSection = SectionNames.attributes;
          break;
        case SectionNames.tables:
          this.htmlSection = SectionNames.tables;
          break;
        case SectionNames.images:
          this.htmlSection = SectionNames.images;
          break;
        case SectionNames.content:
          this.htmlSection = SectionNames.content;
          break;
        case SectionNames.info:
          this.htmlSection = SectionNames.info;
          break;
          case SectionNames.fix:
          this.htmlSection = SectionNames.fix;
          break;
        default:
          this.htmlSection = SectionNames.markup;
          break;
      }
    });
  }

  ngAfterViewChecked() {
    // Invoke this method when DOM is ready
    if (!this.isInitialized && this.sharedService.HtmlToValidate) {
      this.fileName = this.sharedService.FileName;

      this.validateHtmlmarkup();
      this.validateAttribute();
      this.validateContent();
      this.validateHTMLTAGS();
      this.validateHTMLIMAGES();
      this.isInitialized = true;
     }
  }

  //Method to validate the HTML markup section
  validateHtmlmarkup() {
    let htmlValue = this.sharedService.HtmlToValidate;
    if (!htmlValue) {
      return;
    }
    let errorCount = 0;
    var parser = new DOMParser().parseFromString(htmlValue, 'text/html');
    htmlValue = htmlValue.toUpperCase();
    let markupSection = document.getElementById('htmlMarkup');
    if (markupSection != null) {
      let spanTags = markupSection.querySelectorAll('span');
      let divTags = markupSection.querySelectorAll('div');

      //Match HTML tag
      let htmlExists: boolean = this.validateTags(
        htmlValue,
        '<HTML>',
        '</HTML>'
      );
      if (!htmlExists) errorCount++;
      htmlExists
        ? (spanTags[0].children[0].className = this.statusClassNames.available)
        : (spanTags[0].children[0].className = this.statusClassNames.unavailable);

      //Match Head tag
      let headExists: boolean = this.validateTags(
        htmlValue,
        '<HEAD>',
        '</HEAD>'
      );
      if (!headExists) errorCount++;
      headExists
        ? (spanTags[1].children[0].className = this.statusClassNames.available)
        : (spanTags[1].children[0].className = this.statusClassNames.unavailable);

      //Match Title tag
      let titleExists: boolean = this.validateTags(
        htmlValue,
        '<TITLE>',
        '</TITLE>'
      );
      if (!titleExists) errorCount++;
      titleExists
        ? (spanTags[2].children[0].className = this.statusClassNames.available)
        : (spanTags[2].children[0].className = this.statusClassNames.unavailable);

      //Check Content-type
      let contType = this.getContentType(parser);
      //this.validateTags(htmlValue, "CONTENT-TYPE") ?
      let ctMissingIndex = contType.indexOf('MISSING');
      if (ctMissingIndex >= 0) errorCount++;
      ctMissingIndex < 0
        ? (spanTags[3].children[0].className = this.statusClassNames.available)
        : (spanTags[3].children[0].className = this.statusClassNames.unavailable);

      //Match Body tag
      let bodyExists: boolean = this.validateTags(
        htmlValue,
        '<BODY>',
        '</BODY>'
      );
      if (!bodyExists) errorCount++;
      bodyExists
        ? (spanTags[4].children[0].className = this.statusClassNames.available)
        : (spanTags[4].children[0].className = this.statusClassNames.unavailable);

      //Check Language attribute
      let language = this.checkLangAttribute(parser);
      if (language == 'MISSING') errorCount++;
      language != 'MISSING'
        ? (spanTags[5].children[0].className = this.statusClassNames.available)
        : (spanTags[5].children[0].className = this.statusClassNames.unavailable);

      //Check Hidden pre header text occurence
      let phttext = this.getPreheaderText(parser);
      //this.validatePreheader(htmlValue) ?
      let phtIndex = phttext.indexOf('MISSING');
      if (phtIndex >= 0) errorCount++;
      phtIndex < 0
        ? (spanTags[6].children[0].className = this.statusClassNames.available)
        : (spanTags[6].children[0].className = this.statusClassNames.unavailable);

      divTags[1].innerText = 'CONTENT TYPE: ' + contType;
      divTags[1].innerText.indexOf('MISSING') < 0
        ? (divTags[1].className = this.divStatusClassNames.green)
        : (divTags[1].className = this.divStatusClassNames.red);

      divTags[2].innerText = 'TITLE: ' + this.getTitle(parser);
      divTags[2].innerText.indexOf('MISSING') < 0
        ? (divTags[2].className = this.divStatusClassNames.green)
        : (divTags[2].className = this.divStatusClassNames.red);

      if (language != '') {
        divTags[3].innerText = 'LANGUAGE: ' + language;
        divTags[3].innerText.indexOf('MISSING') < 0
          ? (divTags[3].className = this.divStatusClassNames.green)
          : (divTags[3].className = this.divStatusClassNames.red);
      }

      divTags[4].innerText = 'HIDDEN PRE HEADER: ' + phttext;
      divTags[4].innerText.indexOf('MISSING') < 0
        ? (divTags[4].className = this.divStatusClassNames.green)
        : (divTags[4].className = this.divStatusClassNames.red);

      this.sharedService.markupErrorCount.next(errorCount);
    }
  }
  // Validation for attibute selection section
  validateAttribute() {
    // INVOKE constructor myhtmlvalue to check whether file is loaded or not
    const myhtmlValue = this.sharedService.HtmlToValidate;
    if (!myhtmlValue) {
      return;
    }
    let errorcount = 0;
    this.attrSearchObjErrors = [];
    this.attrSearchObjErrorsDisp = [];
    // INVOKE FUNCTION appendLineNos ERRORS TO IDENTIFY THE NUMBER OF LINES ONCE CHEKCED

    const appendLineNos = (arr, htmlValueArr) => {
      for (let i = 0; i < htmlValueArr.length; i++) {
        arr.map(item => {
          const searchItem =
            typeof item.search === 'string'
              ? new RegExp(item.search, 'ig')
              : item.search;
          const isMatches = htmlValueArr[i].match(searchItem);
          if (isMatches) {
            isMatches.map(match => {
              item.lineNos.push(i + 1);
              item.lineStr = htmlValueArr[i].substring(0, 30);
            });
          }
        });
      }
          // MAPPING ARRAY BY GETTING DYNAMICA DATA AND BIND WITH THE HTML

      arr.map(item => {
        item.lineNos.map(line => {
          this.attrSearchObjErrorsDisp.push({
            line,
            lineStr: item.lineStr,
            text: item.text,
            isSelected: true
          });
        });
      });
    };
        // CONSTRUCT FUNCTION TO CHECK ERRORS USING START AND END TAG

    const checkEndTags = (startTagSearch, endTagSearch) => {
      const startTag = this.attrSearchObj.find(
        item => item.search === startTagSearch
      );
      const endTag = this.attrSearchObj.find(
        item => item.search === endTagSearch
      );
      if (startTag && endTag) {
        if (startTag.count > endTag.count) {
          startTag.classes = startTag.classes || [];
          startTag.classes.push('errortd');
          errorcount = errorcount + (startTag.count - endTag.count);
        } else if (startTag.count < endTag.count) {
          endTag.classes = endTag.classes || [];
          endTag.classes.push('errortd');
          errorcount = errorcount + (endTag.count - startTag.count);
        }
      }
    };
        // PAIRING KEYVALUE TO CHECK THE LIST OF ERRORS IN THE HTML ATTRIBUTES FILE

    this.attrSearchObj = [
      { search: /href/gi, text: 'HREF="', noError: true },
      { search: ' HREF=""', text: 'HREF=""' },
      {
        search: /http[^:]\HREF\s*=\s*"[A-Z|0-9|:|//|.|-|_]*\s[A-Z|0-9|:|//|.|-|_]*"/gi,
        text: 'HREF=" " /%20)'
      },
      { search: 'HREF="#"', text: 'HREF="#', noError: true },
      { search: 'LINKID=""', text: 'LINKID=""' },
      { search: 'HTTTP', text: 'HTTTP' },
      // { search: 'HTTP ', text: 'HTTP (%20)' },
      {
        search: 'HTTP://',
        text: 'HTTP://',
        noError: true
        // funcs: [checkEndTags.bind(null, 'HTTP://', 'HTTP:/')]
      },
      {
        search: /http:\/[^\/]/gi,
        text: 'HTTP:/'
      },
      {
        search: /http:[^\/]/gi,
        text: 'HTTP:'
      },
      {
        search: 'HTTP ',
        text: 'HTTP (%20)'
        // noError: true
      },
      { search: '\\..COM', text: '..COM' },
      { search: ',COM', text: ',COM' },
      { search: 'WWWW', text: 'WWWW' },
      { search: ':W3', text: 'W3', noError: true },
      { search: 'SRC="', text: 'SRC="', noError: true },
      { search: 'SRC=', text: 'SRC=', noError: true },
      { search: '."', text: '."', noError: true },
      { search: '\\[/@', text: '[/@', noError: true },
      { search: 'TRACKURL] "', text: 'trackurl] "' },
      { search: '=" "', text: '=" "' },
      {
        search: '<BODY',
        text: '<BODY>',
        noError: true,
        funcs: [checkEndTags.bind(null, '<BODY', '/BODY>')]
      },
      { search: '/BODY>', text: '/BODY>', noError: true },
      { search: 'HTML>', text: 'HTML>', noError: true },
      { search: '<!DOCTYPE', text: '<!DOCTYPE', noError: true },
      { search: 'HEAD>', text: 'HEAD>', noError: true },
      { search: '<META', text: '<META>', noError: true },
      {
        search: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gi,
       text: 'URL="%20")'
      }
    ];
// MAPPING THE ATTIBUTE CODE AND BINDING THE VALUE WITH THE HTML FILE
    this.attrSearchObj.map(item => {
      if (typeof item.search !== 'string') {
        item.count = ((myhtmlValue || '').match(item.search) || []).length;
      } else {
        item.count = this.AnchorTagAttribute(item.search, myhtmlValue);
      }
// CHECK COUNT AND PUSH THE ERROR VALUE TO THE HTML VALUES

      if (item.count && !item.noError) {
        item.classes = [];
        item.classes.push('errortd');
        errorcount += item.count;
        item.lineNos = [];
        this.attrSearchObjErrors.push(item);
      }
    });
    // FILTER THE ELEMENT ONCE THE VALUES ARE APPENDED

    const hasFuncs = this.attrSearchObj.filter(item => item.funcs);
    hasFuncs.map(item => {
      item.funcs.map(func => func());
    });
    appendLineNos(this.attrSearchObjErrors, myhtmlValue.split('\n'));
    this.sharedService.attribErrorsCount.next(errorcount || 0);
  }
// INVOKE FUNCTION FOR ALL CHECKBOXES EVENT on CHECKED OF CHECKBOX
  htmlAttrErrorClicked(evt, i) {
    if (evt.target.tagName === 'INPUT') {
      const item = this.attrSearchObjErrorsDisp[i];
      item.isSelected = !item.isSelected;
      this.setErrColorsToLines(item.line - 1, null, item.isSelected);

      this.selectAllBtn =
        this.attrSearchObjErrorsDisp.filter(item => item.isSelected).length ===
        this.attrSearchObjErrorsDisp.length;
    }
  }
// INVOKE FUNCTION Selectall ERRORS EVENT on CHECKED OF CHECKBOX
  selectAllErrors(evt) {
    const isChecked = evt.target.checked;
    const lineNums = this.attrSearchObjErrorsDisp.map(item => {
      item.isSelected = isChecked;
      return item.line - 1;
    });
    this.setErrColorsToLines(null, lineNums, isChecked);
    this.selectAllBtn = isChecked;
  }
  changeState(divName: string, i) {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    this.initial = !this.initial;
  }
  htmlTextErrorClicked(evt, i) {
    let oldClass = evt.target.getAttribute('class');
    if (evt.target.tagName === 'DIV') {
      const item = this.attrSearchObjErrorsDisp[i];
      item.isSelected = !item.isSelected;
      this.setErrColorsToLines(item.line - 1, null, item.isSelected);
    }
    if (oldClass == null) {
      oldClass = '';
      this.render.setElementAttribute(evt.target, "class", oldClass + 'overselected');
    } else if (oldClass.includes('overselected')) {
      oldClass = oldClass.replace('overselected', '')
      this.render.setElementAttribute(evt.target, "class", oldClass);
    } else {
      this.render.setElementAttribute(evt.target, "class", oldClass + ' overselected');
    }
  }
  setErrColorsToLines(lineNum, lineNums, showErr) {
    if(this.sharedService.htmlValueSplitted && lineNum){
     const line = this.sharedService.htmlValueSplitted.find(
       item => item.id === lineNum
      );
      line.isErr = showErr;
    }
    if(this.sharedService.htmlValueSplitted && lineNums){
      const lines = this.sharedService.htmlValueSplitted.filter(
        item => lineNums.includes(item.id)
       );
       lines.map(line => {
         line.isErr = showErr;
       })

     }

  }

  validateContent() {
    const myhtmlValue = this.sharedService.HtmlToValidate;
    if (!myhtmlValue) {
      return;
    }
    this.contentSearchObj = [
      { search: '<A', text: '<A>' },
      { search: '</A>', text: '</A>' },
      { search: 'TARGET="_BLANK', text: 'TARGET="_BLANK' },
      { search: 'TEL:', text: 'TEL' },
      { search: 'HREF="W', text: 'HREF="W"' },
      { search: 'HREF="HTTP', text: 'HREF="HTTP"' },
      { search: 'MAILTO:', text: 'MAIL TO' },
      { search: 'HREF="', text: 'HREF="COUNT"' },
      { search: 'HREF=" ', text: 'HREF="SPACE"' },
      { search: 'HREF="#"', text: 'HREF="#"' },
      { search: 'HREF="HTTPS', text: 'HREF="HTTPS"' },
      { search: 'ALIAS="', text: 'ALIAS="COUNT"' },
      { search: 'CONVERSION="TRUE"', text: 'CONVERSION="TRUE"' }
    ];
    //  console.log(this.contentSearchObj);

    // const myhtmlValue = htmlValue.toUpperCase();
    this.contentSearchObj.map(item => {
      item.count = this.AnchorTagAttribute(item.search, myhtmlValue);
      //this.sharedService.attributeErrorsCount.next(item.count);
    });
  }
  validateHTMLTAGS() {
    this.HTMLSearchObj = [
      { search: '<TABLE', text: '<TABLE>' },
      { search: '</TABLE>', text: '</TABLE>' },
      { search: '<TR', text: '<TR>' },
      { search: '</TR>', text: '</TR>' },
      { search: '<TD', text: '<TD>' },
      { search: '</TD', text: '</TD>' },
      { search: '<DIV', text: '<DIV>' },
      { search: '<SPAN', text: '<SPAN>' },
      { search: '</SPAN>', text: '</SPAN>' },
      { search: '<SUP', text: '<SUP>' },
      { search: '</SUP>', text: '</SUP>' },
      { search: '<\\!\\-\\-\\[IF', text: '<--[IF' },
      { search: '[ENDIF]-->', text: '[ENDIF]-->' },
      { search: 'WIDTH=', text: 'WIDTH=' },
      { search: 'IMG', text: 'IMAGE WIDTH > TD' }
    ];
    // console.log(this.HTMLSearchObj);
    const myhtmlValue = this.sharedService.HtmlToValidate;
    // const myhtmlValue = htmlValue.toUpperCase();
    this.HTMLSearchObj.map(item => {
      item.count = this.AnchorTagAttribute(item.search, myhtmlValue);
      //this.sharedService.attributeErrorsCount.next(item.count);
    });
  }
  validateHTMLIMAGES() {
    this.HTMLSearchImagesObj = [
      { search: '<IMG', text: '<IMG>' },
      { search: 'DISPLAY:BLOCK', text: 'DISPLAY:BLOCK' },
      { search: 'DISPLAY:INLINE-BLOCK', text: 'DISPLAY:INLINE-BLOCK' },
      { search: 'SRC=" "', text: 'IMG[SRC="SPACE"]' },
      { search: 'ALT="', text: 'ALT=" "' },
      { search: 'TITLE="', text: 'TITLE=" "' },
      { search: 'ALT=""', text: 'BLANK ALT' },
      { search: 'TITLE=""', text: 'BLANK TITLE' },
      { search: 'SRC=""', text: 'SRC="BLANK"' },
      { search: 'SRC="HTTP', text: 'SRC="HTTP' },
      { search: 'BACKGROUND="HTTP', text: 'BACKGROUND="HTTP' },
      { search: 'BORDER="0"', text: 'BORDER="0"' }
    ];
    // console.log(this.HTMLSearchObj);
    const myhtmlValue = this.sharedService.HtmlToValidate;
    // const myhtmlValue = htmlValue.toUpperCase();
    this.HTMLSearchImagesObj.map(item => {
      item.count = this.AnchorTagAttribute(item.search, myhtmlValue);
      //this.sharedService.attributeErrorsCount.next(item.count);
    });
  }
  // validateAttribute() {
  //   let htmlValue = this.sharedService.HtmlToValidate;
  //   let errorCount = 0;
  //   let parser = new DOMParser().parseFromString(htmlValue, 'text/html');
  //   let AttributeSection = document.getElementById('htmlAttributes');
  //   console.log(AttributeSection, parser);
  //   if (AttributeSection != null) {
  //     let spanTags = AttributeSection.querySelectorAll('span');
  //     let divTags = AttributeSection.querySelectorAll('div');

  //     //Check Language attribute
  //     // let count = this.AnchorTagAttribute('searchResult', htmlValue);
  //     let counts = this.searchResult.map(item => {
  //       return this.AnchorTagAttribute(item.href, htmlValue);
  //     });
  //     console.log(htmlValue);
  //     console.log(counts);
  //     // if (AnchorTag == null) errorCount++;
  //     // AnchorTag != null' ?
  //     // divTags[1].children[1].className = this.htmlClassNames.available :
  //     // divTags[1].children[1].className = this.htmlClassNames.unavailable;

  //     //Match href tag
  //     let bodyTag: boolean = this.validateTags(htmlValue, '<BODY>', '</BODY>');
  //     console.log(bodyTag);
  //     if (!bodyTag) errorCount++;
  //     bodyTag
  //       ? (divTags[22].children[0].className = this.htmlClassNames.available)
  //       : (divTags[22].children[0].className = this.htmlClassNames.unavailable);

  //     this.sharedService.attributeErrorsCount.next(errorCount);
  //   }
  // }
  //Validate achor tag attribute
  // htmlTagAttrib = '';
  // AnchorTagAttribute(parser): any{
  //   let htmlTagAttrib = parser.querySelectorAll("A[HREF]");
  //   console.log(htmlTagAttrib.length);
  //   return htmlTagAttrib.length;
  //   // var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  //   // if(!regex .test(htmlTagAttrib)) {
  //   //   alert("Please enter valid URL.");
  //   //   return false;
  //   // } else {
  //   //   return true;
  //   // }

  // }

  public htmlTagAttrib = '';
  AnchorTagAttribute(re, htmlValue): any {
    if (typeof re !== 'string') {
      return 0;
    }
    re = re === '.' ? '\\' + re : re;
    var cre = new RegExp(re, 'ig');
    let count = ((htmlValue || '').match(cre) || []).length;
    //console.log(count);
    return count;
  }

  //Get Pre header text
  getPreheaderText(parser) {
    let pht = '';
    Array.from(parser.body.querySelectorAll('div')).forEach((elem: any) => {
      if (
        elem.style.width == '0px' &&
        elem.style.fontSize == '0px' &&
        elem.style.display == 'none'
      )
        pht = elem.innerText;
    });
    return pht == '' ? 'MISSING' : pht;
  }

  //Get HTML Title
  getTitle(parser) {
    let titleTag = parser.querySelectorAll('TITLE');
    titleTag.length > 0;
    {
      return titleTag[0].text != null && titleTag[0].text != ''
        ? titleTag[0].text
        : 'MISSING';
    }
  }

  //Get content type
  getContentType(parser): any {
    return parser.charset == null || parser.charset == ''
      ? 'MISSING'
      : parser.charset;
  }

  //Check the Language attribute in Html tag
  checkLangAttribute(parser): any {
    let htmlTagAttrib = parser.querySelectorAll('HTML[LANG]');
    if (htmlTagAttrib.length > 0) {
      return htmlTagAttrib[0].lang != null && htmlTagAttrib[0].lang != ''
        ? htmlTagAttrib[0].lang
        : 'MISSING';
    }
    return 'MISSING';
  }

  //Validate start and end tags
  validateTags(htmlValue, startTag, endTag = '') {
    if (htmlValue.match(startTag) != null && htmlValue.match(endTag) != null)
      return true;
    return false;
  }

  // validatePreheader(htmlValue) {
  //   if (htmlValue.match('PREHEADER') != null || htmlValue.match('PRE-HEADER') != null ||
  //     htmlValue.match('PRE HEADER') != null)
  //     return true;
  //   return false;
  // }

  htmlToPlaintext(textAreaValue) {
    console.log();
    // tslint:disable-next-line:max-line-length
    this.textAreaValue = this.textAreaValue
      .replace(/•/gi, '-')
      .replace(/<o:PixelsPerInch[\s\S]*?>[\s\S]*?<\/o:PixelsPerInch>/gi, ' ')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/gm, ' ')
      .replace(/^\s*[\r\n]/gm, ' ');
  }

  imgs: any;
  imgSrc: Array<any>;

  getAlltheImgSrc() {
    let imgs = this.parser.querySelectorAll('img');
    this.imgSrc = [];
    for (let i = 0; i < imgs.length; i++) {
      this.imgSrc.push(imgs[i].src);
    }
    return this.imgSrc;
  }

  ursl: any;
  urlHref: Array<any>;

  getAlltheUrls() {
    let ursl = this.parser.querySelectorAll('a');
    this.urlHref = [];
    for (let i = 0; i < ursl.length; i++) {
      this.urlHref.push(ursl[i].href);
      console.log(this.urlHref);
    }
    return this.urlHref;
  }

  font: any;
  fonts: Array<any>;
  getAlltheFonts() {
    let font = this.parser.querySelectorAll('');
    this.fonts = [];
    for (let i = 0; i < font.length; i++) {
      this.fonts.push(font[i]);
      console.log(this.fonts);
    }
  }
}
