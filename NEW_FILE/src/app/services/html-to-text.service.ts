import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlToTextService {
  linkProcess = null;
  imgProcess = null;

  constructor() { }

  // to convert html to text by using the parameter as input
  htmlToPlaintext(htmlValue) {
    let parser = new DOMParser().parseFromString(htmlValue, "text/html");

    let IMG = parser.body.querySelectorAll('alt');
    let HREF = parser.body.querySelectorAll('href');

    htmlValue = htmlValue.replace(/•/gi, '-').replace(/<o:PixelsPerInch[\s\S]*?>[\s\S]*?<\/o:PixelsPerInch>/gi, ' ').replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ').replace(/<((?!h[1-6]( [^>]*)*>)(?!img( [^>]*)*>)(?!a( [^>]*)*>)(?!ul( [^>]*)*>)(?!ol( [^>]*)*>)(?!li( [^>]*)*>)(?!p( [^>]*)*>)(?!div( [^>]*)*>)(?!td( [^>]*)*>)(?!br( [^>]*)*>)[^>])*>/gi, ' ').replace(/<br( [^>]*)*>|<p( [^>]*)*>|<\/p( [^>]*)*>|<div( [^>]*)*>|<\/div( [^>]*)*>|<td( [^>]*)*>|<\/td( [^>]*)*>/gi, '\n');
    htmlValue = htmlValue.replace(/<img([^>]*)>/gi, (str, imAttrs) => {
      let imAlt = '';
      var imAltResult = (/alt="([^"]*)"/i).exec(imAttrs);
      if (imAltResult !== null) {
        imAlt = imAltResult[1];
      }
      if (typeof (this.imgProcess) === 'function') {
        return this.imgProcess(imAlt);
      }
      if (imAlt === '') {
        return '';
      }
      return imAlt;
    });

    htmlValue = htmlValue.replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a[^>]*>/gi, (str, href, linkText) => {
      if (typeof this.linkProcess === 'function') {
        return this.linkProcess(href, linkText);
      }
      return " " + linkText + " " + href + " " + '\n';
    });

    // tslint:disable-next-line:max-line-length
    htmlValue = htmlValue.replace(/<\/?span[^>]*>|<\/?a[^>]*>|<\/?sup[^>]*>|<\/?sub[^>]*>/g, ' ').replace(/<[^>]+>/gm, ' ').replace(/<\/?!--[^>]*>/g, "").replace(/\n[ \t\f]*/gi, "\n").replace(/\n\n\n+/gi, "\n\n").replace(/( |&nbsp;|\t)+/gi, ' ').replace(/\n +/gi, "\n").replace(/^ +/gi, ' ');
    return htmlValue;
  }


}
