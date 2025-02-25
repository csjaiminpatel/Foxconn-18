import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizedHtml',
  standalone: true
})
export class SanitizedHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: any, type?: string): any {
    if (!type) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }
    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      // case 'style':
      //   return this.sanitizer.bypassSecurityTrustStyle(value);
      // case 'script':
      //   return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
  }

}
