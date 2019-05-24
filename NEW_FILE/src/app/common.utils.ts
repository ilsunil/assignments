export enum SectionNames
{
    markup = 'markup',
    attributes = 'attributes',
    tables = 'tables',
    images = 'images',
    content = 'content',
    info = 'info',
    fix = 'fix'
}

export class ReviewKeyValuePair {
    reviewName: string;
    totalCount: number;
    lineNumber: number;
    dataForReview: any;
}

export enum ReviewName
{
    altToTitle = 'AltToTitle',
    nonasciiToAscii = 'NonAsciiToAscii'
}

export enum ReviewHeader
{
    altToTitle = 'Alt to Title',
    nonasciiToAscii = 'Non ASCII to ASCII'
}

export class FixedElements{
    index : number;
    fixed : boolean;
}
