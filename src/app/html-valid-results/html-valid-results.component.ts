import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { DataSharedService } from '../shared.service';
import { SectionNames } from '../common.utils';

@Component({
  selector: 'app-html-valid-results',
  templateUrl: './html-valid-results.component.html',
  styleUrls: ['./html-valid-results.component.css']
})
export class HtmlValidResultsComponent implements OnInit, AfterViewChecked {
  textAreaValue = this.sharedService.HtmlToValidate;
  htmlValue = this.sharedService.HtmlToValidate;
  parser = new DOMParser().parseFromString(this.htmlValue, 'text/html');

  htmlSection;
  fileName;
  attrSearchObj;
  contentSearchObj;
  HTMLSearchObj;
  HTMLSearchImagesObj;
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

  constructor(private sharedService: DataSharedService) { }

  ngOnInit() {
    this.fileName = this.sharedService.FileName;
    // Invoke the subscribe method to load the HTML sections
    this.sharedService.htmlSectionName.subscribe((secName: string) => {
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
        case SectionNames.tools:
          this.htmlSection = SectionNames.tools;
          break;
        case SectionNames.markup:
        default:
          this.htmlSection = SectionNames.markup;
          break;
      }
    });
  }

  ngAfterViewChecked() {
    // Invoke this method when DOM is ready
    this.validateHtmlmarkup();
    this.validateAttribute();
    this.validateContent();
    this.validateHTMLTAGS();
    this.validateHTMLIMAGES();
  }

  //Method to validate the HTML markup section
  validateHtmlmarkup() {
    let htmlValue = this.sharedService.HtmlToValidate;
    let errorCount = 0;
    // let htmlValue = '<html lang="en"><head>' +
    // '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'+
    // '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
    // '<meta name="viewport" content="width=device-width, initial scale=1.0">'+
    // '<title>Sephora Stores</title></head><body></body>';
    // let htmlValue = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" ' +
    //   '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html lang="en"><head>' +
    //   '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
    //   '<meta http-equiv="X-UA-Compatible" content="IE=edge">' +
    //   '<meta name="viewport" content="width=device-width, initial scale=1.0">' +
    //   '<title>Sephora Stores</title></head>' +
    //   '<body><div style="width:0px;font-size:0;display:none;">Test</div></body></html>';

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
  // searchResult = ['{"key1":"value1","key2":"value2","key3":"value3"}'];

  validateAttribute() {
    let errorcount = 0;
    const checkEndTags = (startTagSearch, endTagSearch) => {
      const startTag = this.attrSearchObj.find(item => item.search === startTagSearch);
      const endTag = this.attrSearchObj.find(item => item.search === endTagSearch);
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
    const checkSpace = (specifictag) => {
      const startTag = this.attrSearchObj.find(item => item.search === specifictag);
      // const endTag = this.attrSearchObj.find(item => item.search === endTagSearch);
      var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
      console.log(regex.test(startTag));

      if (!regex .test(startTag)) {
        startTag.classes = [];
        startTag.classes.push('errortd');
        errorcount += startTag.count;
      } else{
        return true;
      }
    };
    this.attrSearchObj = [
      { search: 'HREF', text: 'HREF="', noError: true },
      { search: ' HREF=""', text: 'HREF=""' },
      { search: 'HREF=" "', text: 'HREF=" " /%20)', funcs: [checkSpace.bind(null, 'HREF=" "')] },
      { search: 'HREF="#"', text: 'HREF="#', noError: true  },
      { search: 'LINKID=""', text: 'LINKID=""' },
      { search: 'HTTTP', text: 'HTTTP' },
      { search: 'HTTP ', text: 'HTTP (%20)' },
      {
        search: 'HTTP://',
        text: 'HTTP://',
        noError: true
      },
      {
        search: 'HTTP:/',
        text: 'HTTP:/',
        noError: true,
             },
      {
        search: 'HTTP:',
        text: 'HTTP:',
        noError: true,
      },
      {
        search: 'HTTP',
        text: 'HTTP',
        noError: true,
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
      { search: '<META', text: '<META>', noError: true }
    ];
    // console.log(this.attrSearchObj);
    const htmlValue = this.sharedService.HtmlToValidate;
    const myhtmlValue = htmlValue.toUpperCase();
    this.attrSearchObj.map(item => {
      item.count = this.AnchorTagAttribute(item.search, myhtmlValue);
      if (item.count && !item.noError) {
        item.classes = [];
        item.classes.push('errortd');
        errorcount += item.count;
      }
    });
    const hasFuncs = this.attrSearchObj.filter(item => item.funcs);
    hasFuncs.map(item => {
      item.funcs.map(func => func());
    });
    this.sharedService.attribErrorsCount.next(errorcount || 0);
  }
  validateContent() {
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
    const htmlValue = this.sharedService.HtmlToValidate;
    const myhtmlValue = htmlValue.toUpperCase();
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
      { search: '\\[IF', text: '<--[IF' },
      { search: '[ENDIF]-->', text: '[ENDIF]-->' },
      { search: 'WIDTH=', text: 'WIDTH=' },
      { search: 'IMG', text: 'IMAGE WIDTH > TD' }
    ];
    // console.log(this.HTMLSearchObj);
    const htmlValue = this.sharedService.HtmlToValidate;
    const myhtmlValue = htmlValue.toUpperCase();
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
    const htmlValue = this.sharedService.HtmlToValidate;
    const myhtmlValue = htmlValue.toUpperCase();
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
    var cre = new RegExp(re, 'g');
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
