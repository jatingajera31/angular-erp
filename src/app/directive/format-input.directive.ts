import { Directive ,HostListener, ElementRef} from '@angular/core';
@Directive({
  selector: '[appFormatInput]'
})
export class FormatInputDirective {
  constructor(private element:ElementRef) { }
  @HostListener('blur') OnBlur(){
    let value = this.element.nativeElement.value;
    if (value) {
      this.element.nativeElement.value = parseFloat(value).toFixed(2);
    }
  }  
}