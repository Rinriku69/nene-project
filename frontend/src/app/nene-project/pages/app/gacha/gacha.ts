import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { GachaItem, ResourceErrorResponse } from '../../../models/Resource';
import { GachaService } from '../../../services/gacha.service';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-gacha',
  imports: [],
  templateUrl: './gacha.html',
  styleUrl: './gacha.css',
})
export class Gacha implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly gachaService = inject(GachaService)
  private readonly audioService = inject(AudioService);
  currentUser = computed(() => this.authService.currentUserState());
  isRolling = signal<boolean>(false);
  pullResults = signal<GachaItem[] | null>(null);
  selectedItem = signal<GachaItem | null>(null);

  rollType = signal<1 | 10 | 0>(0);
  confirmModal = signal<boolean>(false);
  pullAmount = signal<number|null>(null);
  gemLeft = signal<number>(0);

  featuredItems = [
    { url: 'https://res.cloudinary.com/dhvmcbbdi/image/upload/v1780825123/134227912693387031_1452_817_1780434105773_d4iyrq.jpg', alt: 'Nene Flower SR' },
    { url: 'https://res.cloudinary.com/dhvmcbbdi/image/upload/v1780825122/134215114489764490_1452_817_1780434219032_lir4w8.jpg', alt: 'Disney Princess R' },
    { url: 'https://res.cloudinary.com/dhvmcbbdi/image/upload/v1780825390/134224687394682974_1452_817_1780434126139_if4d0i.jpg', alt: 'Triple Meow SR' }
  ];

  viewItem(item: GachaItem) {
    this.selectedItem.set(item);
  }

  closeItem() {
    this.selectedItem.set(null);
  }

  closeConfirmModal(){
    this.confirmModal.set(false);
  }

  confirmPull(type: 1 | 10){
    this.confirmModal.set(true);
    if(type === 1){
     this.rollType.set(type);
     this.pullAmount.set(100);
     this.gemLeft.set(this.currentUser()?.currency! - this.pullAmount()!);
    }else{
      this.rollType.set(type);
      this.pullAmount.set(1000);
      this.gemLeft.set(this.currentUser()?.currency! - this.pullAmount()!);
    }
  }

  roll() {
    if (this.isRolling()) return;
    this.isRolling.set(true);
    this.closeConfirmModal();
    this.pullResults.set(null);
    
    this.gachaService.gachaRoll(this.rollType()).subscribe({
      next:(response)=>{
        this.pullResults.set(response.results);
        this.rollType() === 1 ? this.audioService.playSfx('singlePull.mp3') : this.audioService.playSfx('multiPull.mp3');
        this.authService.getUser().subscribe();
        this.isRolling.set(false);
      },
      error:(error:ResourceErrorResponse)=>{
        this.isRolling.set(false);
        console.error(error)
      }
    })
  }

  closeResults() {
    this.pullResults.set(null);
    this.isRolling.set(false);
  }

  currentSlide = signal(0);
  private slideInterval: any;
  ngOnInit(){
    this.slideInterval = setInterval(() => {
      this.currentSlide.update(index => 
        (index + 1) % this.featuredItems.length
      );
    }, 3000);
  }

  ngOnDestroy(){
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}
