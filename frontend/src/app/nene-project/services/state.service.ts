import { computed, Service, signal } from '@angular/core';

@Service()
export class StateService {
    private readonly errorMessage = signal<string|null>(null);
    readonly errorMessageState = computed(()=>this.errorMessage());
    readonly showTick = signal<number>(0);

    setErrorMessage(message:string):void{
        this.errorMessage.set(message);
        this.showTick.set(this.showTick() + 1);
    }

    removeErrorMessage():void{
        this.errorMessage.set(null);
    }
}
