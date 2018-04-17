import { Directive, Input, ElementRef, Renderer } from '@angular/core';


@Directive({
  selector: '[hide-header]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideHeaderDirective {

  @Input('header') header: HTMLElement;

  scrollContent: any;
  headerHeight: number;

  constructor(public emlement: ElementRef, public renderer: Renderer) {
    //console.log('Hello HideHeaderDirective Directive');
  }

  ngOnInit() {
    //console.log(this.header);
    this.headerHeight = this.header.clientHeight;
    //console.log('headerHeight: ' + this.headerHeight);
    this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 700ms');

    this.scrollContent = this.emlement.nativeElement.getElementsByClassName('scroll-content')[0];
    //console.log(this.scrollContent);
    this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 700ms');
  }

  onContentScroll(event) {
    //console.log(event);
    if (event.scrollTop > this.headerHeight) {
      this.renderer.setElementStyle(this.header, 'top', `-${this.headerHeight}px`);
      this.renderer.setElementStyle(this.scrollContent, 'margin-top', `10px`);
    } else {
      this.renderer.setElementStyle(this.header, 'top', `0px`);
      this.renderer.setElementStyle(this.scrollContent, 'margin-top', `${this.headerHeight}px`);
    }
  }

}
