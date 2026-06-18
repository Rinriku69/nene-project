import { ElementRef, Injectable, signal, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly userCurrencyElement: WritableSignal<ElementRef<HTMLElement> | null> = signal(null); 

  updateUserCurrencyElem(currencyElem: ElementRef<HTMLElement>){

    this.userCurrencyElement.set(currencyElem ? currencyElem : null);
  }

}
