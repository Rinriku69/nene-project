import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  isMuted = false;

  constructor() { }
  playSfx(filename: string) {
    if (this.isMuted) return;
    const audio = new Audio(`/sounds/${filename}`);
    
    audio.volume = 0.35; 
    audio.play().catch(err => console.warn('Audio play failed:', err));
  }

  playSsrReveal() {
    if (this.isMuted) return;
    const audio = new Audio('/sounds/ssr-reveal.mp3');
    audio.volume = 1.0; 
    audio.play().catch(e => console.warn(e));
  }
}
