import { Injectable, signal } from '@angular/core';
import { count } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequest = signal<number>(0);

  isLoading = () => this.activeRequest() > 0;

  show(){
    this.activeRequest.update(count => count + 1);
  }

  hide(){
    this.activeRequest.update(count => Math.max(0,count-1));
  }
}
