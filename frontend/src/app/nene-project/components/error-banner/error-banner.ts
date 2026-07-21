import { Component, computed, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { Icons } from "../icons/icons";

@Component({
  selector: 'app-error-banner',
  imports: [Icons],
  templateUrl: './error-banner.html',
  styleUrl: './error-banner.css',
})
export class ErrorBanner {
  readonly errorMessage = input<string|null>(null);
  readonly classAttribute = input<string>();
  readonly showTick = input<number>();
  readonly isClose = output<void>();
  readonly close = computed<boolean>(()=> this.errorMessage() ? false : true);
  readonly show = computed<boolean>(()=>{
    return this.errorMessage() !== null && !this.close()
  });
  readonly errorBanner = viewChild<ElementRef<HTMLDivElement>>('errorBanner');

  onClose():void{
    this.isClose.emit();
  }

  constructor(){
    effect(()=>{
      const showTick = this.showTick();
      const banner = this.errorBanner()?.nativeElement;
      banner?.getAnimations().forEach((animation)=>{
        animation.play()
      })
    })
  }
}
