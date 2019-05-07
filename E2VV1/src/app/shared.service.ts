import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataSharedService {
    
    private htmlToValidate;
    private filename;

    //Shared service variable to set and get section name being clicked
    htmlSectionName: BehaviorSubject<string> = new BehaviorSubject('');

    markupErrorCount: BehaviorSubject<number> = new BehaviorSubject(-1);
    
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
}
