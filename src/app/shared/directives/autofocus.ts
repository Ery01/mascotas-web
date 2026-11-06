import { afterNextRender, booleanAttribute, Directive, ElementRef, inject, input } from '@angular/core';

// <input appAutofocus> recibe el foco al mostrarse
@Directive({
  selector: '[appAutofocus]',
})
export class Autofocus {

  private readonly _el = inject(ElementRef<HTMLElement>);

  appAutofocus = input(true, { transform: booleanAttribute });

  constructor() {
    afterNextRender(() => {
      if (this.appAutofocus()) {
        this._el.nativeElement.focus({ preventScroll: true });
      }
    });
  }

}