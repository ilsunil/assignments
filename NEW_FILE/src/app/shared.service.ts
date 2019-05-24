import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataSharedService {

    private htmlToValidate;
    private filename;
    private docType;
    private indexMapping = [];

    //Shared service variable to set and get section name being clicked
    htmlSectionName: BehaviorSubject<string> = new BehaviorSubject('');

    markupErrorCount: BehaviorSubject<number> = new BehaviorSubject(-1);
    attribErrorsCount: BehaviorSubject<number> = new BehaviorSubject(-1);
    myServices: BehaviorSubject<string> = new BehaviorSubject('');

    set FileName(value: any) {
        this.filename = value;
    }

    get FileName(): any {
        return this.filename;
    }

    set HtmlToValidate(value: any) {
        this.htmlToValidate = value;
    }

    get HtmlToValidate(): any {
        return this.htmlToValidate;
    }

    get getImgTags()
    {
        if(this.htmlToValidate)
        {
            let htmlContent = this.htmlToValidate;
            let parser = new DOMParser().parseFromString(htmlContent, 'text/html');
            this.docType = '<!DOCTYPE ' + parser.doctype.name + ' PUBLIC "' + 
                            parser.doctype.publicId + '" "' + parser.doctype.systemId + '">';
            return parser.body.querySelectorAll('img');
        }
    }

    get getDocType()
    {
        return this.docType;
    }

    get getAltTitleTotalCount()
    {
        if(this.getImgTags)
        {
            let totalCount = 0;
            let imgTags = this.getImgTags;
            this.indexMapping.length = imgTags.length;
            Array.from(imgTags).forEach((elem: HTMLImageElement, i) => {
            if(
                (elem.hasAttribute('alt') && elem.alt != '' && !elem.hasAttribute('title')) ||
                (elem.hasAttribute('alt') && elem.alt != '' && elem.hasAttribute('title') && 
                    elem.title == '')
                )
            {        
                totalCount++;
                this.indexMapping[i] = totalCount;
            }
            else
            {
                this.indexMapping[i] = '';
            }
            });
            return totalCount;
        }
    }

    get readIndexMapping()
    {
        return this.indexMapping;
    }
}
