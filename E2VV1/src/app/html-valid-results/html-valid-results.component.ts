import { Component, OnInit, Input } from '@angular/core';
import { DataSharedService } from '../shared.service';
import { SectionNames } from '../common.utils';

@Component({
  selector: 'app-html-valid-results',
  templateUrl: './html-valid-results.component.html',
  styleUrls: ['./html-valid-results.component.css']
})
export class HtmlValidResultsComponent implements OnInit {

  htmlSection;
  fileName;
  statusClassNames = {
    available: 'fa fa-check-square',
    unavailable: 'fa fa-window-close markupError'
  }

  divStatusClassNames = {
    green: 'bg-success w-25 text-white rounded mt-3 mb-3 pt-2 pb-2',
    red: 'bg-danger w-25 text-white rounded mt-3 mb-3 pt-2 pb-2'
  }

  constructor(private sharedService: DataSharedService) { }

  ngOnInit() {
    this.fileName = this.sharedService.FileName;
    //Invoke the subscribe method to load the HTML sections
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

  ngAfterViewChecked()
  {
    //Invoke this method when DOM is ready
    this.validateHtmlmarkup();
    this.validateAttribute();
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

    var parser = new DOMParser().parseFromString(htmlValue, "text/html");
    htmlValue = htmlValue.toUpperCase();
    let markupSection = document.getElementById('htmlMarkup');
    console.log(markupSection);
    if (markupSection != null) {
      let spanTags = markupSection.querySelectorAll('span');
      let divTags = markupSection.querySelectorAll('div');
      console.log(spanTags);
      //Match HTML tag
      let htmlExists: boolean = this.validateTags(htmlValue, "<HTML>", "</HTML>");
      if(!htmlExists) errorCount++;
      htmlExists ?
        spanTags[0].children[0].className = this.statusClassNames.available :
        spanTags[0].children[0].className = this.statusClassNames.unavailable;


      //Match Head tag
      let headExists: boolean = this.validateTags(htmlValue, "<HEAD>", "</HEAD>");
      if(!headExists) errorCount++;
      headExists ?
        spanTags[1].children[0].className = this.statusClassNames.available :
        spanTags[1].children[0].className = this.statusClassNames.unavailable;

      
      //Match Title tag
      let titleExists: boolean = this.validateTags(htmlValue, "<TITLE>", "</TITLE>");
      if(!titleExists) errorCount++;
      titleExists ?
        spanTags[2].children[0].className = this.statusClassNames.available :
        spanTags[2].children[0].className = this.statusClassNames.unavailable;

      
      //Check Content-type
      let contType = this.getContentType(parser);
      //this.validateTags(htmlValue, "CONTENT-TYPE") ?
      let ctMissingIndex = contType.indexOf('MISSING');
      if(ctMissingIndex >= 0) errorCount++;
      ctMissingIndex < 0 ?
        spanTags[3].children[0].className = this.statusClassNames.available :
        spanTags[3].children[0].className = this.statusClassNames.unavailable;

      
      //Match Body tag
      let bodyExists: boolean = this.validateTags(htmlValue, "<BODY>", "</BODY>");
      if(!bodyExists) errorCount++;
      bodyExists ?
        spanTags[4].children[0].className = this.statusClassNames.available :
        spanTags[4].children[0].className = this.statusClassNames.unavailable;

      
      //Check Language attribute
      let language = this.checkLangAttribute(parser)
      if(language == 'MISSING') errorCount++;      
      language != 'MISSING' ?
        spanTags[5].children[0].className = this.statusClassNames.available :
        spanTags[5].children[0].className = this.statusClassNames.unavailable;

      //Check Hidden pre header text occurence
      let phttext = this.getPreheaderText(parser);
      //this.validatePreheader(htmlValue) ?
      let phtIndex = phttext.indexOf('MISSING');
      if(phtIndex >= 0) errorCount++;
      phtIndex < 0 ?
        spanTags[6].children[0].className = this.statusClassNames.available :
        spanTags[6].children[0].className = this.statusClassNames.unavailable;

      
      divTags[1].innerText = 'CONTENT TYPE: ' + contType;
      (divTags[1].innerText.indexOf('MISSING') < 0) ?
        divTags[1].className = this.divStatusClassNames.green :
        divTags[1].className = this.divStatusClassNames.red;

      divTags[2].innerText = 'TITLE: ' + this.getTitle(parser);
      (divTags[2].innerText.indexOf('MISSING') < 0) ?
        divTags[2].className = this.divStatusClassNames.green :
        divTags[2].className = this.divStatusClassNames.red;

      if (language != '') {
        divTags[3].innerText = 'LANGUAGE: ' + language;
        (divTags[3].innerText.indexOf('MISSING') < 0) ?
          divTags[3].className = this.divStatusClassNames.green :
          divTags[3].className = this.divStatusClassNames.red;
      }

      divTags[4].innerText = 'HIDDEN PRE HEADER: ' + phttext;
      (divTags[4].innerText.indexOf('MISSING') < 0) ?
        divTags[4].className = this.divStatusClassNames.green :
        divTags[4].className = this.divStatusClassNames.red;


      this.sharedService.markupErrorCount.next(errorCount);   

    }
  }
//Method to validate the HTML Attribute section
validateAttribute() {
  let htmlValue = this.sharedService.HtmlToValidate;
  let errorCount = 0;
  let parser = new DOMParser().parseFromString(htmlValue, "text/html");
  htmlValue = htmlValue.toUpperCase();
  let AttributeSection = document.getElementById('htmlAttributes');
  console.log(AttributeSection, parser);
  if (AttributeSection != null) {
    let Anchortag = parser.querySelectorAll('a[href]');
    console.log(Anchortag);
    let divTags = AttributeSection.querySelectorAll('div');

    //Match HTML tag   
   
  }
}
  //Get Pre header text
  getPreheaderText(parser) {
    let pht = '';
    Array.from(parser.body.querySelectorAll('div'))
      .forEach((elem: any) => {
        if (elem.style.width == '0px' && elem.style.fontSize == '0px' && elem.style.display == 'none')
          pht = elem.innerText;
      });
    return pht == '' ? 'MISSING' : pht;
  }

  //Get HTML Title
  getTitle(parser) {
    let titleTag = parser.querySelectorAll("TITLE");
    (titleTag.length > 0)
    {
      return (titleTag[0].text != null && titleTag[0].text != '') ? titleTag[0].text : 'MISSING';
    }
  }

  //Get content type
  getContentType(parser): any {
    return (parser.charset == null || parser.charset == '') ? 'MISSING' : parser.charset;
  }

  //Check the Language attribute in Html tag
  checkLangAttribute(parser): any {
    let htmlTagAttrib = parser.querySelectorAll("HTML[LANG]");
    if (htmlTagAttrib.length > 0) {
      return (htmlTagAttrib[0].lang != null && htmlTagAttrib[0].lang != '') ?
        htmlTagAttrib[0].lang : 'MISSING';
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
}
